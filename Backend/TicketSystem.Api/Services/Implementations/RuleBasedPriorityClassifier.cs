using TicketSystem.Api.Models;
using TicketSystem.Api.Services.Interfaces;

namespace TicketSystem.Api.Services.Implementations;

public class RuleBasedPriorityClassifier : IPriorityClassifier
{
    private static readonly string[] HighPriorityKeywords =
    {
        "server down", "system unavailable", "critical", "outage"
    };

    private static readonly string[] MediumPriorityKeywords =
    {
        "error", "not working", "bug", "issue"
    };

    public TicketPriority Classify(string description)
    {
        if (string.IsNullOrWhiteSpace(description))
        {
            return TicketPriority.Low;
        }

        var text = description.ToLowerInvariant();

        if (HighPriorityKeywords.Any(text.Contains))
        {
            return TicketPriority.High;
        }

        if (MediumPriorityKeywords.Any(text.Contains))
        {
            return TicketPriority.Medium;
        }

        return TicketPriority.Low;
    }
}
