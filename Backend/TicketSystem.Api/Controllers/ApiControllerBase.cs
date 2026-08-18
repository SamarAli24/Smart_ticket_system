using Microsoft.AspNetCore.Mvc;
using TicketSystem.Api.Common.Responses;

namespace TicketSystem.Api.Controllers;

[ApiController]
public abstract class ApiControllerBase : ControllerBase
{
    protected async Task<IActionResult> RequestEnd(Result result)
    {
        return StatusCode(Convert.ToInt32(result.HttpStatusCode), result);
    }
}
