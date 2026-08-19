using TicketSystem.Api.Common.Responses;
using TicketSystem.Api.DTOs;

namespace TicketSystem.Api.Services.Interfaces;

public interface ITicketService
{
    Task<Result> GetAllAsync();
    Task<Result> GetByIdAsync(int id);
    Task<Result> CreateAsync(CreateTicketDto dto);
    Task<Result> UpdateAsync(int id, UpdateTicketDto dto);
    Task<Result> UpdateStatusAsync(int id, UpdateTicketStatusDto dto);
    Task<Result> DeleteAsync(int id);
}
