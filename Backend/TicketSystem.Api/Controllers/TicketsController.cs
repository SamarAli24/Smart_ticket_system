using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TicketSystem.Api.Common.Responses;
using TicketSystem.Api.DTOs;
using TicketSystem.Api.Services.Interfaces;

namespace TicketSystem.Api.Controllers;

[Route("api/tickets")]
[Authorize]
public class TicketsController : ApiControllerBase
{
    private readonly ITicketService _ticketService;

    public TicketsController(ITicketService ticketService)
    {
        _ticketService = ticketService;
    }

    [HttpGet]
    [ProducesResponseType(typeof(Result), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll()
        => await RequestEnd(await _ticketService.GetAllAsync());

    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(Result), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(Result), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(int id)
        => await RequestEnd(await _ticketService.GetByIdAsync(id));

    [HttpPost]
    [ProducesResponseType(typeof(Result), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(Result), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] CreateTicketDto dto)
        => await RequestEnd(await _ticketService.CreateAsync(dto));

    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(Result), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(Result), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(Result), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateTicketDto dto)
        => await RequestEnd(await _ticketService.UpdateAsync(id, dto));

    [HttpPatch("{id:int}/status")]
    [ProducesResponseType(typeof(Result), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(Result), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(Result), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateTicketStatusDto dto)
        => await RequestEnd(await _ticketService.UpdateStatusAsync(id, dto));

    [HttpDelete("{id:int}")]
    [ProducesResponseType(typeof(Result), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(Result), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
        => await RequestEnd(await _ticketService.DeleteAsync(id));
}
