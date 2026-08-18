using TicketSystem.Api.Models;
using TicketSystem.Api.Services.Implementations;
using TicketSystem.Api.Services.Interfaces;

namespace TicketSystem.Api.Integrations.AI;

/// <summary>
/// AI-based priority classifier. Falls back to <see cref="RuleBasedPriorityClassifier"/>
/// for any failure — unconfigured provider, network error, timeout, non-success response,
/// or an unparseable reply — so ticket creation never depends on the AI provider's
/// availability.
/// </summary>
public class AiPriorityClassifier : IPriorityClassifier
{
    private readonly AiApiClient _apiClient;
    private readonly RuleBasedPriorityClassifier _fallbackClassifier;
    private readonly ILogger<AiPriorityClassifier> _logger;

    public AiPriorityClassifier(AiApiClient apiClient, RuleBasedPriorityClassifier fallbackClassifier, ILogger<AiPriorityClassifier> logger)
    {
        _apiClient = apiClient;
        _fallbackClassifier = fallbackClassifier;
        _logger = logger;
    }

    // IPriorityClassifier.Classify is synchronous (TicketService calls it inline, unawaited,
    // and that call site must stay untouched), so the async provider call is blocked on here.
    // Safe in ASP.NET Core (no SynchronizationContext to deadlock on) at the cost of a
    // thread-pool thread for the ~5s the request can take.
    public TicketPriority Classify(string description)
    {
        if (!_apiClient.IsConfigured)
        {
            _logger.LogWarning("AI provider is not configured; falling back to rule-based priority classification.");
            return _fallbackClassifier.Classify(description);
        }

        try
        {
            var responseText = _apiClient.GenerateTextAsync(BuildPrompt(description)).GetAwaiter().GetResult();
            var priority = ParsePriority(responseText);
            if (priority is not null)
            {
                return priority.Value;
            }

            _logger.LogWarning(
                "AI provider returned an unrecognized priority ('{ResponseText}'); falling back to rule-based classification.",
                responseText);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "AI priority classification failed; falling back to rule-based classification.");
        }

        return _fallbackClassifier.Classify(description);
    }

    private static string BuildPrompt(string description) =>
        $"""
        You are a support ticket triage assistant. Classify the following support ticket
        description into exactly one priority level: High, Medium, or Low.

        Rules:
        - High: critical outages, system down, service unavailable, urgent business impact.
        - Medium: errors, bugs, something not working but not fully blocking.
        - Low: general requests, questions, minor issues.

        Respond with exactly one word — High, Medium, or Low — and nothing else.

        Ticket description: "{description}"
        """;

    private static TicketPriority? ParsePriority(string? text)
    {
        if (string.IsNullOrWhiteSpace(text))
        {
            return null;
        }

        var firstWord = text.Trim().Split((char[]?)null, StringSplitOptions.RemoveEmptyEntries).FirstOrDefault() ?? string.Empty;

        return firstWord.Trim('.', ' ').ToLowerInvariant() switch
        {
            "high" => TicketPriority.High,
            "medium" => TicketPriority.Medium,
            "low" => TicketPriority.Low,
            _ => null
        };
    }
}
