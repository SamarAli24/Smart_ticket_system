namespace TicketSystem.Api.Models.Logging;

/// <summary>Business-level record of a meaningful mutation (create/update/delete), written automatically by ActivityLoggingFilter.</summary>
public class ActivityLog
{
    public int Id { get; set; }
    public string Action { get; set; } = string.Empty;
    public string EntityName { get; set; } = string.Empty;
    public int EntityId { get; set; }
    public int? PerformedByUserId { get; set; }
    public string? Details { get; set; }
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}
