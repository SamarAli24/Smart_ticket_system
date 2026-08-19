using System.Net;
using System.Text.Json;
using TicketSystem.Api.Common;
using TicketSystem.Api.Common.Responses;
using TicketSystem.Api.Data;
using TicketSystem.Api.Helpers;
using TicketSystem.Api.Models.Logging;

namespace TicketSystem.Api.Middleware;

/// <summary>
/// Last-resort safety net for exceptions that escape a controller/service unexpectedly.
/// Expected failures (not found, validation, etc.) never reach this — services return a
/// Result with the right status code directly instead of throwing.
/// </summary>
public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context, AppDbContext dbContext)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception occurred");
            await TryLogErrorAsync(context, dbContext, ex);

            var result = new Result();
            result.SetError(HttpStatusCode.InternalServerError, MessageCode.InternalServerError);

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = result.StatusCode;

            await context.Response.WriteAsync(JsonSerializer.Serialize(result));
        }
    }

    private async Task TryLogErrorAsync(HttpContext context, AppDbContext dbContext, Exception ex)
    {
        try
        {
            // The entity that was mid-save when the exception was thrown may still be tracked
            // as "Added"/"Modified" on this shared per-request DbContext. Clear it first so
            // SaveChangesAsync below only persists the new ErrorLog row.
            dbContext.ChangeTracker.Clear();

            dbContext.ErrorLogs.Add(new ErrorLog
            {
                Method = context.Request.Method,
                Path = context.Request.Path.Value ?? string.Empty,
                StatusCode = StatusCodes.Status500InternalServerError,
                Message = ex.Message,
                ExceptionType = ex.GetType().FullName,
                StackTrace = ex.StackTrace,
                UserId = context.User.GetUserId(),
                IPAddress = context.Connection.RemoteIpAddress?.ToString(),
                Timestamp = DateTime.UtcNow
            });
            await dbContext.SaveChangesAsync();
        }
        catch (Exception logEx)
        {
            _logger.LogWarning(logEx, "Failed to write error log for {Method} {Path}", context.Request.Method, context.Request.Path);
        }
    }
}
