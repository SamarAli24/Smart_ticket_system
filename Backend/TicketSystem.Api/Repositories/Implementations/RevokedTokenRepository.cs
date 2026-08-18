using Microsoft.EntityFrameworkCore;
using TicketSystem.Api.Data;
using TicketSystem.Api.Models;
using TicketSystem.Api.Repositories.Interfaces;

namespace TicketSystem.Api.Repositories.Implementations;

public class RevokedTokenRepository : IRevokedTokenRepository
{
    private readonly AppDbContext _context;

    public RevokedTokenRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<bool> IsRevokedAsync(string jti) =>
        await _context.RevokedTokens.AnyAsync(r => r.Jti == jti);

    public async Task AddAsync(RevokedToken token)
    {
        _context.RevokedTokens.Add(token);
        await _context.SaveChangesAsync();
    }
}
