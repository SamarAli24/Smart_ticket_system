using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Options;

namespace TicketSystem.Api.Integrations.AI;

/// <summary>
/// Thin HTTP wrapper around the configured AI provider's text-generation endpoint.
/// Callers send a plain text prompt and get a plain text reply back; the provider's
/// specific request/response contract is entirely contained here, so swapping providers
/// only means changing this one class plus configuration — nothing that calls
/// <see cref="GenerateTextAsync"/> needs to change.
/// </summary>
public class AiApiClient
{
    private static readonly TimeSpan RequestTimeout = TimeSpan.FromSeconds(5);

    private readonly HttpClient _httpClient;
    private readonly AiApiOptions _options;

    public AiApiClient(HttpClient httpClient, IOptions<AiApiOptions> options)
    {
        _httpClient = httpClient;
        _options = options.Value;
    }

    public bool IsConfigured => !string.IsNullOrWhiteSpace(_options.ApiKey);

    /// <summary>
    /// Sends a text prompt to the provider and returns its text reply. Throws on any
    /// failure (missing config, network error, timeout, non-success response, unexpected
    /// response shape) — callers are expected to catch and fall back.
    /// </summary>
    public async Task<string> GenerateTextAsync(string prompt)
    {
        using var cts = new CancellationTokenSource(RequestTimeout);

        var requestUrl = $"{_options.BaseUrl.TrimEnd('/')}/{_options.Model}:generateContent?key={_options.ApiKey}";

        var requestBody = new
        {
            contents = new[]
            {
                new { parts = new[] { new { text = prompt } } }
            },
            generationConfig = new { temperature = 0, maxOutputTokens = 10 }
        };

        using var content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");
        using var response = await _httpClient.PostAsync(requestUrl, content, cts.Token);
        response.EnsureSuccessStatusCode();

        var responseJson = await response.Content.ReadAsStringAsync(cts.Token);
        return ExtractText(responseJson);
    }

    private static string ExtractText(string responseJson)
    {
        using var document = JsonDocument.Parse(responseJson);
        return document.RootElement
            .GetProperty("candidates").EnumerateArray().First()
            .GetProperty("content")
            .GetProperty("parts").EnumerateArray().First()
            .GetProperty("text")
            .GetString() ?? string.Empty;
    }
}
