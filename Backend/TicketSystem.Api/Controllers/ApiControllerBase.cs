using Microsoft.AspNetCore.Mvc;
using TicketSystem.Api.Common.Responses;
using TicketSystem.Api.Services.Interfaces;

namespace TicketSystem.Api.Controllers;

[ApiController]
public abstract class ApiControllerBase : ControllerBase
{
    protected async Task<IActionResult> RequestEnd(Result result)
    {
        if (!result.Success)
        {
            // Every non-success Result (validation, not-found, unauthorized, etc.) is built via
            // Result.SetError and returned through this one method regardless of which controller
            // or service produced it, so this is the single place that captures every "expected"
            // API error. Unhandled exceptions never reach this method and are logged separately
            // by ExceptionHandlingMiddleware. Both paths write through the same IErrorLogService.
            var errorLogService = HttpContext.RequestServices.GetRequiredService<IErrorLogService>();
            await errorLogService.LogAsync(HttpContext, result.StatusCode, result.Message, result.Error?.Code);
        }

        return StatusCode(Convert.ToInt32(result.HttpStatusCode), result);
    }
}
