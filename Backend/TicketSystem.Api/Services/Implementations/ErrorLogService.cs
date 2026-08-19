using TicketSystem.Api.Common;
using TicketSystem.Api.Data;
using TicketSystem.Api.Models.Logging;
using TicketSystem.Api.Services.Interfaces;

namespace TicketSystem.Api.Services.Implementations;

public class ErrorLogService : IErrorLogService
{
    private readonly AppDbContext _dbContext;
    private readonly ILogger<ErrorLogService> _logger;

    public ErrorLogService(AppDbContext dbContext, ILogger<ErrorLogService> logger)
    {
        _dbContext = dbContext;
        _logger = logger;
    }

    public async Task LogAsync(
        HttpContext context,
        int statusCode,
        string message,
        int? errorCode = null,
        string? exceptionType = null,
        string? stackTrace = null)
    {
        try
        {
            // The DbContext is scoped per-request and may still be tracking an entity that was
            // mid-save when the error occurred (e.g. a failed create). Clear it first so
            // SaveChangesAsync below only persists the new ErrorLog row.
            _dbContext.ChangeTracker.Clear();

            _dbContext.ErrorLogs.Add(new ErrorLog
            {
                Method = context.Request.Method,
                Path = context.Request.Path.Value ?? string.Empty,
                StatusCode = statusCode,
                ErrorCode = errorCode,
                Message = message,
                ExceptionType = exceptionType,
                StackTrace = stackTrace,
                UserId = context.User.GetUserId(),
                IPAddress = context.Connection.RemoteIpAddress?.ToString(),
                Timestamp = DateTime.UtcNow
            });
            await _dbContext.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            // Logging must never break the actual response.
            _logger.LogWarning(ex, "Failed to write error log for {Method} {Path}", context.Request.Method, context.Request.Path);
        }
    }
}
