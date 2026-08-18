using TicketSystem.Api.Models;

namespace TicketSystem.Api.Services.Interfaces;

/// <summary>
/// Determines a ticket's priority from its description. Implementations can be
/// swapped (e.g. rule-based today, AI/LLM-based later) without touching callers.
/// </summary>
public interface IPriorityClassifier
{
    TicketPriority Classify(string description);
}
