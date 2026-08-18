using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using TicketSystem.Api.Models;
using TicketSystem.Api.Services.Interfaces;

namespace TicketSystem.Api.Data;

/// <summary>
/// Seeds sample users and tickets for local development / demo purposes.
/// Only runs when the relevant tables are empty, so it is safe to call on every startup.
/// </summary>
public static class DbSeeder
{
    // Login for every seeded user in local/dev environments.
    private const string SeedPassword = "Password123!";

    public static async Task SeedAsync(AppDbContext context, IPriorityClassifier priorityClassifier, IPasswordHasher<User> passwordHasher)
    {
        if (!await context.Users.AnyAsync())
        {
            var users = new List<User>
            {
                new() { FullName = "Alice Johnson", Email = "alice.johnson@example.com", Role = UserRole.Admin, IsActive = true },
                new() { FullName = "Bob Smith", Email = "bob.smith@example.com", Role = UserRole.Agent, IsActive = true },
                new() { FullName = "Carol Lee", Email = "carol.lee@example.com", Role = UserRole.Agent, IsActive = true },
                new() { FullName = "David Kim", Email = "david.kim@example.com", Role = UserRole.Agent, IsActive = false }
            };

            foreach (var user in users)
            {
                user.PasswordHash = passwordHasher.HashPassword(user, SeedPassword);
            }

            context.Users.AddRange(users);
            await context.SaveChangesAsync();
        }

        if (!await context.Tickets.AnyAsync())
        {
            var bob = await context.Users.FirstAsync(u => u.Email == "bob.smith@example.com");
            var carol = await context.Users.FirstAsync(u => u.Email == "carol.lee@example.com");

            var seedTickets = new (string Title, string Description, TicketStatus Status, int? AssignedToUserId, int DaysAgo)[]
            {
                ("Production server down",
                    "The production server is down, this is a critical outage affecting all customers.",
                    TicketStatus.Open, bob.Id, 0),

                ("Login page bug",
                    "Users are reporting a bug on the login page, getting an error when submitting credentials.",
                    TicketStatus.InProgress, carol.Id, 1),

                ("Feature request: dark mode",
                    "It would be nice to have a dark mode option in the settings menu.",
                    TicketStatus.Open, null, 2),

                ("Email notifications not working",
                    "Email notifications not working for new ticket assignments, seems like an issue with the mail service.",
                    TicketStatus.Resolved, bob.Id, 4),

                ("System unavailable during peak hours",
                    "The system unavailable message appears every day during peak hours, likely a critical capacity issue.",
                    TicketStatus.Closed, carol.Id, 7)
            };

            var tickets = seedTickets.Select(t => new Ticket
            {
                Title = t.Title,
                Description = t.Description,
                Priority = priorityClassifier.Classify(t.Description),
                Status = t.Status,
                AssignedToUserId = t.AssignedToUserId,
                CreatedDate = DateTime.UtcNow.AddDays(-t.DaysAgo)
            });

            context.Tickets.AddRange(tickets);
            await context.SaveChangesAsync();
        }
    }
}
