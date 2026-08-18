using TicketSystem.Api.Models;

namespace TicketSystem.Api.Repositories.Interfaces;

public interface IRevokedTokenRepository
{
    Task<bool> IsRevokedAsync(string jti);
    Task AddAsync(RevokedToken token);
}
