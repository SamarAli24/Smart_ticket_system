using System.ComponentModel.DataAnnotations;

namespace TicketSystem.Api.DTOs;

public class UpdateTicketStatusDto
{
    /// <summary>Expected values: "Open", "InProgress", "Resolved", "Closed".</summary>
    [Required]
    public string Status { get; set; } = string.Empty;
}
