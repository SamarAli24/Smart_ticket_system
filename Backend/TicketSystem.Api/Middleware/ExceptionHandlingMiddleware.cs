using System.Net;
using System.Text.Json;
using TicketSystem.Api.Common.Responses;
using TicketSystem.Api.Helpers;
using TicketSystem.Api.Services.Interfaces;

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

    public async Task InvokeAsync(HttpContext context, IErrorLogService errorLogService)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception occurred");
            await errorLogService.LogAsync(
                context,
                StatusCodes.Status500InternalServerError,
                ex.Message,
                exceptionType: ex.GetType().FullName,
                stackTrace: ex.StackTrace);

            var result = new Result();
            result.SetError(HttpStatusCode.InternalServerError, MessageCode.InternalServerError);

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = result.StatusCode;

            await context.Response.WriteAsync(JsonSerializer.Serialize(result));
        }
    }
}
