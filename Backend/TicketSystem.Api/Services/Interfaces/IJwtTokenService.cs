using TicketSystem.Api.Models;

namespace TicketSystem.Api.Services.Interfaces;

public record GeneratedToken(string Token, string Jti, DateTime ExpiresAtUtc);

public interface IJwtTokenService
{
    GeneratedToken GenerateToken(User user);
}
