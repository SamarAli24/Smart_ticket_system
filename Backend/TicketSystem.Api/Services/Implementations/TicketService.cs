using System.Net;
using TicketSystem.Api.Common.Responses;
using TicketSystem.Api.DTOs;
using TicketSystem.Api.Helpers;
using TicketSystem.Api.Models;
using TicketSystem.Api.Repositories.Interfaces;
using TicketSystem.Api.Services.Interfaces;

namespace TicketSystem.Api.Services.Implementations;

public class TicketService : ITicketService
{
    private readonly ITicketRepository _ticketRepository;
    private readonly IUserRepository _userRepository;
    private readonly IPriorityClassifier _priorityClassifier;

    public TicketService(ITicketRepository ticketRepository, IUserRepository userRepository, IPriorityClassifier priorityClassifier)
    {
        _ticketRepository = ticketRepository;
        _userRepository = userRepository;
        _priorityClassifier = priorityClassifier;
    }

    public async Task<Result> GetAllAsync()
    {
        var result = new Result();

        var tickets = await _ticketRepository.GetAllWithAssignedUserAsync();
        var ticketDtos = tickets.Select(MapToDto).ToList();

        return result.SetSuccess(HttpStatusCode.OK, MessageCode.TicketsRetrieved, ticketDtos, ticketDtos.Count);
    }

    public async Task<Result> GetByIdAsync(int id)
    {
        var result = new Result();

        var ticket = await FetchDtoAsync(id);
        if (ticket is null)
        {
            return result.SetError(HttpStatusCode.NotFound, MessageCode.TicketNotFound, id.ToString());
        }

        return result.SetSuccess(HttpStatusCode.OK, MessageCode.TicketRetrieved, ticket);
    }

    public async Task<Result> CreateAsync(CreateTicketDto dto)
    {
        var result = new Result();

        if (dto.AssignedToUserId is not null)
        {
            var userExists = await _userRepository.ExistsAsync(dto.AssignedToUserId.Value);
            if (!userExists)
            {
                return result.SetError(HttpStatusCode.BadRequest, MessageCode.UserNotFound, dto.AssignedToUserId.Value.ToString());
            }
        }

        var ticket = new Ticket
        {
            Title = dto.Title,
            Description = dto.Description,
            AssignedToUserId = dto.AssignedToUserId,
            Priority = _priorityClassifier.Classify(dto.Description),
            Status = TicketStatus.Open,
            CreatedDate = DateTime.UtcNow
        };

        await _ticketRepository.AddAsync(ticket);

        var created = await FetchDtoAsync(ticket.Id);
        return result.SetSuccess(HttpStatusCode.Created, MessageCode.TicketCreated, created);
    }

    public async Task<Result> UpdateAsync(int id, UpdateTicketDto dto)
    {
        var result = new Result();

        var ticket = await _ticketRepository.FindAsync(id);
        if (ticket is null)
        {
            return result.SetError(HttpStatusCode.NotFound, MessageCode.TicketNotFound, id.ToString());
        }

        if (dto.AssignedToUserId is not null)
        {
            var userExists = await _userRepository.ExistsAsync(dto.AssignedToUserId.Value);
            if (!userExists)
            {
                return result.SetError(HttpStatusCode.BadRequest, MessageCode.UserNotFound, dto.AssignedToUserId.Value.ToString());
            }
        }

        ticket.Title = dto.Title;
        ticket.Description = dto.Description;
        ticket.AssignedToUserId = dto.AssignedToUserId;
        // Priority is re-evaluated from the (possibly changed) description, same classifier as on creation.
        ticket.Priority = _priorityClassifier.Classify(dto.Description);

        await _ticketRepository.SaveChangesAsync();

        var updated = await FetchDtoAsync(id);
        return result.SetSuccess(HttpStatusCode.OK, MessageCode.TicketUpdated, updated);
    }

    public async Task<Result> UpdateStatusAsync(int id, UpdateTicketStatusDto dto)
    {
        var result = new Result();

        if (!Enum.TryParse<TicketStatus>(dto.Status, ignoreCase: true, out var status))
        {
            return result.SetError(
                HttpStatusCode.BadRequest,
                MessageCode.InvalidTicketStatus,
                dto.Status,
                string.Join(", ", Enum.GetNames<TicketStatus>()));
        }

        var ticket = await _ticketRepository.FindAsync(id);
        if (ticket is null)
        {
            return result.SetError(HttpStatusCode.NotFound, MessageCode.TicketNotFound, id.ToString());
        }

        ticket.Status = status;
        await _ticketRepository.SaveChangesAsync();

        var updated = await FetchDtoAsync(id);
        return result.SetSuccess(HttpStatusCode.OK, MessageCode.TicketStatusUpdated, updated);
    }

    public async Task<Result> DeleteAsync(int id)
    {
        var result = new Result();

        var ticket = await _ticketRepository.FindAsync(id);
        if (ticket is null)
        {
            return result.SetError(HttpStatusCode.NotFound, MessageCode.TicketNotFound, id.ToString());
        }

        ticket.IsDeleted = true;
        await _ticketRepository.SaveChangesAsync();

        return result.SetSuccess(HttpStatusCode.OK, MessageCode.TicketDeleted);
    }

    private async Task<TicketDto?> FetchDtoAsync(int id)
    {
        var ticket = await _ticketRepository.GetByIdWithAssignedUserAsync(id);
        return ticket is null ? null : MapToDto(ticket);
    }

    private static TicketDto MapToDto(Ticket ticket) => new()
    {
        Id = ticket.Id,
        Title = ticket.Title,
        Description = ticket.Description,
        Priority = ticket.Priority.ToString(),
        Status = ticket.Status.ToString(),
        CreatedDate = ticket.CreatedDate,
        AssignedToUserId = ticket.AssignedToUserId,
        AssignedToUser = ticket.AssignedToUser is null
            ? null
            : new UserDto
            {
                Id = ticket.AssignedToUser.Id,
                FullName = ticket.AssignedToUser.FullName,
                Email = ticket.AssignedToUser.Email,
                Role = ticket.AssignedToUser.Role.ToString(),
                IsActive = ticket.AssignedToUser.IsActive
            }
    };
}
