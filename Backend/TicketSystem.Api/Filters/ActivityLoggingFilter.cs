using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Routing;
using TicketSystem.Api.Common;
using TicketSystem.Api.Common.Responses;
using TicketSystem.Api.Data;
using TicketSystem.Api.Models.Logging;

namespace TicketSystem.Api.Filters;

/// <summary>
/// Global MVC filter that automatically writes an ActivityLog row for every successful
/// mutating request (POST/PUT/PATCH/DELETE). Nothing in a controller ever calls this directly —
/// the action name, entity name and entity id are all derived from the HTTP method and the
/// controller's attribute route template, so any new controller gets this for free.
/// </summary>
public class ActivityLoggingFilter : IAsyncActionFilter
{
    // Route segments whose name already describes the resulting state change (rather than
    // a field being updated), e.g. ".../deactivate" -> "UserDeactivated", not "UserDeactivateUpdated".
    private static readonly Dictionary<string, string> VerbSegmentActions = new(StringComparer.OrdinalIgnoreCase)
    {
        ["deactivate"] = "Deactivated",
        ["activate"] = "Activated"
    };

    private static readonly HashSet<string> MutatingMethods = new(StringComparer.OrdinalIgnoreCase)
    {
        "POST", "PUT", "PATCH", "DELETE"
    };

    private readonly AppDbContext _dbContext;
    private readonly ILogger<ActivityLoggingFilter> _logger;

    public ActivityLoggingFilter(AppDbContext dbContext, ILogger<ActivityLoggingFilter> logger)
    {
        _dbContext = dbContext;
        _logger = logger;
    }

    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        var httpMethod = context.HttpContext.Request.Method;
        if (!MutatingMethods.Contains(httpMethod))
        {
            await next();
            return;
        }

        var executedContext = await next();

        // The action threw (e.g. NotFoundException/BadRequestException) and nothing handled it here —
        // ExceptionHandlingMiddleware will turn it into the error response. Only log real successes.
        if (executedContext.Exception is not null && !executedContext.ExceptionHandled)
        {
            return;
        }

        try
        {
            await LogActivityAsync(context, executedContext, httpMethod);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to write activity log for {Method} {Path}",
                httpMethod, context.HttpContext.Request.Path);
        }
    }

    private async Task LogActivityAsync(ActionExecutingContext context, ActionExecutedContext executedContext, string httpMethod)
    {
        var statusCode = GetStatusCode(executedContext.Result);
        if (statusCode is < 200 or >= 300)
        {
            return;
        }

        if (context.ActionDescriptor is not ControllerActionDescriptor descriptor)
        {
            return;
        }

        var entityId = GetEntityId(context.RouteData.Values, executedContext.Result);
        if (entityId is null)
        {
            return;
        }

        var entityName = Singularize(descriptor.ControllerName);
        var action = BuildActionName(entityName, httpMethod, descriptor.AttributeRouteInfo?.Template);

        var activityLog = new ActivityLog
        {
            Action = action,
            EntityName = entityName,
            EntityId = entityId.Value,
            PerformedByUserId = context.HttpContext.User.GetUserId(),
            Details = BuildDetails(executedContext.Result),
            Timestamp = DateTime.UtcNow
        };

        _dbContext.ActivityLogs.Add(activityLog);
        await _dbContext.SaveChangesAsync();
    }

    private static string BuildActionName(string entityName, string httpMethod, string? routeTemplate)
    {
        var baseVerb = httpMethod.ToUpperInvariant() switch
        {
            "POST" => "Created",
            "DELETE" => "Deleted",
            _ => "Updated" // PUT / PATCH
        };

        var extraSegment = GetExtraRouteSegment(routeTemplate);

        if (extraSegment is not null && VerbSegmentActions.TryGetValue(extraSegment, out var verbAction))
        {
            return $"{entityName}{verbAction}";
        }

        if (extraSegment is not null)
        {
            return $"{entityName}{ToPascalCase(extraSegment)}{baseVerb}";
        }

        return $"{entityName}{baseVerb}";
    }

    /// <summary>
    /// Returns the literal route segment that comes after the controller's base segment and any
    /// {id} parameter (e.g. "status" for "api/tickets/{id}/status"), or null if there isn't one.
    /// </summary>
    private static string? GetExtraRouteSegment(string? template)
    {
        if (string.IsNullOrWhiteSpace(template))
        {
            return null;
        }

        var literalSegments = template
            .Split('/', StringSplitOptions.RemoveEmptyEntries)
            .Where(s => !s.StartsWith('{') && !s.Equals("api", StringComparison.OrdinalIgnoreCase))
            .ToArray();

        // literalSegments[0] is the controller's own route segment (e.g. "tickets"); anything after it
        // is an explicit sub-action in the route (e.g. "status", "deactivate").
        return literalSegments.Length > 1 ? literalSegments[^1] : null;
    }

    private static string ToPascalCase(string value) =>
        string.IsNullOrEmpty(value) ? value : char.ToUpperInvariant(value[0]) + value[1..].ToLowerInvariant();

    private static string Singularize(string controllerName) =>
        controllerName.EndsWith('s') ? controllerName[..^1] : controllerName;

    private static int? GetStatusCode(IActionResult? result) => result switch
    {
        ObjectResult obj => obj.StatusCode,
        StatusCodeResult status => status.StatusCode,
        _ => 200
    };

    private static int? GetEntityId(RouteValueDictionary routeValues, IActionResult? result)
    {
        if (routeValues.TryGetValue("id", out var routeId) && int.TryParse(routeId?.ToString(), out var idFromRoute))
        {
            return idFromRoute;
        }

        var payload = ExtractData(result);
        if (payload is not null)
        {
            var idProperty = payload.GetType().GetProperty("Id");
            if (idProperty?.GetValue(payload) is int idFromBody)
            {
                return idFromBody;
            }
        }

        return null;
    }

    // Controllers respond with a Result envelope — the real entity lives in Result.Data.
    private static object? ExtractData(IActionResult? result) =>
        result is ObjectResult { Value: Result apiResult } ? apiResult.Data : null;

    private static string? BuildDetails(IActionResult? result)
    {
        var payload = ExtractData(result);
        return payload is null ? null : JsonSerializer.Serialize(payload);
    }
}
