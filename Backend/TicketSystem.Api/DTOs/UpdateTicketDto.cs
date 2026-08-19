using System.ComponentModel.DataAnnotations;

namespace TicketSystem.Api.DTOs;

public class UpdateTicketDto
{
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [MaxLength(4000)]
    public string Description { get; set; } = string.Empty;

    public int? AssignedToUserId { get; set; }
}
