namespace TicketSystem.Api.Services.Interfaces;

/// <summary>
/// Single place that writes to the ErrorLogs table. Every error path in the app (expected
/// Result.SetError responses, JWT auth challenges, model-validation failures, and unhandled
/// exceptions) calls this instead of writing to the database directly, so the persistence
/// logic exists in exactly one place.
/// </summary>
public interface IErrorLogService
{
    Task LogAsync(
        HttpContext context,
        int statusCode,
        string message,
        int? errorCode = null,
        string? exceptionType = null,
        string? stackTrace = null);
}
