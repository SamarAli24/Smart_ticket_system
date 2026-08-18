namespace TicketSystem.Api.Models;

public class Ticket
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public TicketPriority Priority { get; set; }
    public TicketStatus Status { get; set; } = TicketStatus.Open;
    public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

    public int? AssignedToUserId { get; set; }
    public User? AssignedToUser { get; set; }

    public bool IsDeleted { get; set; } = false;
}
