using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TicketSystem.Api.Common.Responses;
using TicketSystem.Api.Services.Interfaces;

namespace TicketSystem.Api.Controllers;

[Route("api/logs")]
[Authorize]
public class LogsController : ApiControllerBase
{
    private readonly ILogsService _logsService;

    public LogsController(ILogsService logsService)
    {
        _logsService = logsService;
    }

    [HttpGet("activity")]
    [ProducesResponseType(typeof(Result), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetActivityLogs()
        => await RequestEnd(await _logsService.GetActivityLogsAsync());

    [HttpGet("requests")]
    [ProducesResponseType(typeof(Result), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetRequestLogs()
        => await RequestEnd(await _logsService.GetRequestLogsAsync());

    [HttpGet("errors")]
    [ProducesResponseType(typeof(Result), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetErrorLogs()
        => await RequestEnd(await _logsService.GetErrorLogsAsync());
}
