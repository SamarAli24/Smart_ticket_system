using Microsoft.AspNetCore.Mvc;
using TicketSystem.Api.Common;
using TicketSystem.Api.Common.Responses;
using TicketSystem.Api.Data;
using TicketSystem.Api.Models.Logging;

namespace TicketSystem.Api.Controllers;

[ApiController]
public abstract class ApiControllerBase : ControllerBase
{
    protected async Task<IActionResult> RequestEnd(Result result)
    {
        if (!result.Success)
        {
            await TryLogErrorAsync(result);
        }

        return StatusCode(Convert.ToInt32(result.HttpStatusCode), result);
    }

    // Every non-success Result (validation, not-found, unauthorized, etc.) is built via
    // Result.SetError and returned through this one method regardless of which controller or
    // service produced it, so this is the single place that captures every "expected" API
    // error. Unhandled exceptions never reach this method and are logged separately by
    // ExceptionHandlingMiddleware.
    private async Task TryLogErrorAsync(Result result)
    {
        try
        {
            var dbContext = HttpContext.RequestServices.GetRequiredService<AppDbContext>();
            dbContext.ErrorLogs.Add(new ErrorLog
            {
                Method = Request.Method,
                Path = Request.Path.Value ?? string.Empty,
                StatusCode = result.StatusCode,
                ErrorCode = result.Error?.Code,
                Message = result.Message,
                UserId = User.GetUserId(),
                IPAddress = HttpContext.Connection.RemoteIpAddress?.ToString(),
                Timestamp = DateTime.UtcNow
            });
            await dbContext.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            // Logging must never break the actual response.
            var logger = HttpContext.RequestServices.GetRequiredService<ILogger<ApiControllerBase>>();
            logger.LogWarning(ex, "Failed to write error log for {Method} {Path}", Request.Method, Request.Path);
        }
    }
}
