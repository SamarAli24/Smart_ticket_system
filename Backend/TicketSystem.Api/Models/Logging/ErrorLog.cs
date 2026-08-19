namespace TicketSystem.Api.Models.Logging;

/// <summary>
/// Record of a single API error, written automatically by ApiControllerBase (for expected
/// errors like validation/not-found/unauthorized) and ExceptionHandlingMiddleware (for
/// unhandled exceptions). ExceptionType/StackTrace are only populated for the latter.
/// </summary>
public class ErrorLog
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
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}
