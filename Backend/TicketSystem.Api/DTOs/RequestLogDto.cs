namespace TicketSystem.Api.DTOs;

public class RequestLogDto
{
    public int Id { get; set; }
    public string Method { get; set; } = string.Empty;
    public string Path { get; set; } = string.Empty;
    public string? QueryString { get; set; }
    public int StatusCode { get; set; }
    public long ResponseTimeMs { get; set; }
    public string? IPAddress { get; set; }
    public int? UserId { get; set; }
    public DateTime Timestamp { get; set; }
}
