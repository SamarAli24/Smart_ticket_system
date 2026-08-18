using System.Security.Claims;
using TicketSystem.Api.Common.Responses;
using TicketSystem.Api.DTOs;

namespace TicketSystem.Api.Services.Interfaces;

public interface IAuthService
{
    Task<Result> LoginAsync(LoginDto dto);
    Task<Result> LogoutAsync(ClaimsPrincipal principal);
}
