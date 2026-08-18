using TicketSystem.Api.Models;

namespace TicketSystem.Api.Repositories.Interfaces;

public interface IUserRepository
{
    Task<List<User>> GetAllAsync();
    Task<User?> FindAsync(int id);
    Task<User?> GetByEmailAsync(string email);
    Task<bool> ExistsAsync(int id);
    Task<bool> EmailExistsAsync(string email);
    Task AddAsync(User user);
    Task SaveChangesAsync();
}
