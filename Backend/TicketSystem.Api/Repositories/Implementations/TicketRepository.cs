using Microsoft.EntityFrameworkCore;
using TicketSystem.Api.Data;
using TicketSystem.Api.Models;
using TicketSystem.Api.Repositories.Interfaces;

namespace TicketSystem.Api.Repositories.Implementations;

public class TicketRepository : ITicketRepository
{
    private readonly AppDbContext _context;

    public TicketRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Ticket>> GetAllWithAssignedUserAsync() =>
        await _context.Tickets
            .Include(t => t.AssignedToUser)
            .OrderByDescending(t => t.CreatedDate)
            .ToListAsync();

    public async Task<Ticket?> GetByIdWithAssignedUserAsync(int id) =>
        await _context.Tickets
            .Include(t => t.AssignedToUser)
            .FirstOrDefaultAsync(t => t.Id == id);

    public async Task<Ticket?> FindAsync(int id) => await _context.Tickets.FindAsync(id);

    public async Task AddAsync(Ticket ticket)
    {
        _context.Tickets.Add(ticket);
        await _context.SaveChangesAsync();
    }

    public async Task SaveChangesAsync() => await _context.SaveChangesAsync();
}
