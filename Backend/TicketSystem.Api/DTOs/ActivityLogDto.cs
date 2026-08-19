namespace TicketSystem.Api.DTOs;

public class ActivityLogDto
{
    public int Id { get; set; }
    public string Action { get; set; } = string.Empty;
    public string EntityName { get; set; } = string.Empty;
    public int EntityId { get; set; }
    public int? PerformedByUserId { get; set; }
    public string? Details { get; set; }
    public DateTime Timestamp { get; set; }
}
