namespace TicketSystem.Api.DTOs;

public class ErrorLogDto
{
    public int Id { get; set; }
    public string Method { get; set; } = string.Empty;
    public string Path { get; set; } = string.Empty;
    public int StatusCode { get; set; }
    public int? ErrorCode { get; set; }
    public string Message { get; set; } = string.Empty;
    public string? ExceptionType { get; set; }
    public string? StackTrace { get; set; }
    public int? UserId { get; set; }
    public string? IPAddress { get; set; }
    public DateTime Timestamp { get; set; }
}
