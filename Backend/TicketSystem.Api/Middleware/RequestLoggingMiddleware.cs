using System.Diagnostics;
using TicketSystem.Api.Common;
using TicketSystem.Api.Data;
using TicketSystem.Api.Models.Logging;

namespace TicketSystem.Api.Middleware;

/// <summary>
/// Records one RequestLog row for every HTTP request that passes through the pipeline.
/// Registered as the outermost middleware so it sees the final status code (including
/// ones rewritten by ExceptionHandlingMiddleware) and captures failed/unauthorized requests too.
/// </summary>
public class RequestLoggingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<RequestLoggingMiddleware> _logger;

    public RequestLoggingMiddleware(RequestDelegate next, ILogger<RequestLoggingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context, AppDbContext dbContext)
    {
        var stopwatch = Stopwatch.StartNew();
        try
        {
            await _next(context);
        }
        finally
        {
            stopwatch.Stop();
            await TryLogRequestAsync(context, dbContext, stopwatch.ElapsedMilliseconds);
        }
    }

    private async Task TryLogRequestAsync(HttpContext context, AppDbContext dbContext, long elapsedMs)
    {
        try
        {
            // If the request failed with a DbUpdateException (e.g. a unique-constraint race), the
            // offending entity is still tracked as "Added"/"Modified" on this shared per-request
            // DbContext. Without clearing it first, SaveChangesAsync below would try to re-persist
            // that stale entity, fail the same way, and silently drop this request's log row.
            dbContext.ChangeTracker.Clear();

            var log = new RequestLog
            {
                Method = context.Request.Method,
                Path = context.Request.Path.Value ?? string.Empty,
                QueryString = context.Request.QueryString.HasValue ? context.Request.QueryString.Value : null,
                StatusCode = context.Response.StatusCode,
                ResponseTimeMs = elapsedMs,
                IPAddress = context.Connection.RemoteIpAddress?.ToString(),
                UserId = context.User.GetUserId(),
                Timestamp = DateTime.UtcNow
            };

            dbContext.RequestLogs.Add(log);
            await dbContext.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            // Logging must never break the actual request.
            _logger.LogWarning(ex, "Failed to write request log for {Method} {Path}", context.Request.Method, context.Request.Path);
        }
    }
}
