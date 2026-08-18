using TicketSystem.Api.Common.Responses;
using TicketSystem.Api.DTOs;

namespace TicketSystem.Api.Services.Interfaces;

public interface IUserService
{
    Task<Result> GetAllAsync();
    Task<Result> CreateAsync(CreateUserDto dto);
    Task<Result> DeactivateAsync(int id);
}
