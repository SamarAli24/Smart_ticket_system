using TicketSystem.Api.Models;

namespace TicketSystem.Api.Repositories.Interfaces;

public interface ITicketRepository
{
    Task<List<Ticket>> GetAllWithAssignedUserAsync();
    Task<Ticket?> GetByIdWithAssignedUserAsync(int id);
    Task<Ticket?> FindAsync(int id);
    Task AddAsync(Ticket ticket);
    Task SaveChangesAsync();
}
