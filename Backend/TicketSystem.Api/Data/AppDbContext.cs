using Microsoft.EntityFrameworkCore;
using TicketSystem.Api.Models;
using TicketSystem.Api.Models.Logging;

namespace TicketSystem.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Ticket> Tickets => Set<Ticket>();
    public DbSet<User> Users => Set<User>();
    public DbSet<RequestLog> RequestLogs => Set<RequestLog>();
    public DbSet<ActivityLog> ActivityLogs => Set<ActivityLog>();
    public DbSet<ErrorLog> ErrorLogs => Set<ErrorLog>();
    public DbSet<RevokedToken> RevokedTokens => Set<RevokedToken>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(u => u.Id);
            entity.Property(u => u.FullName).IsRequired().HasMaxLength(200);
            entity.Property(u => u.Email).IsRequired().HasMaxLength(256);
            entity.HasIndex(u => u.Email).IsUnique();
            entity.Property(u => u.PasswordHash).IsRequired();
            entity.Property(u => u.Role).HasConversion<string>().HasMaxLength(20);
        });

        modelBuilder.Entity<Ticket>(entity =>
        {
            entity.HasKey(t => t.Id);
            entity.Property(t => t.Title).IsRequired().HasMaxLength(200);
            entity.Property(t => t.Description).IsRequired().HasMaxLength(4000);
            entity.Property(t => t.Priority).HasConversion<string>().HasMaxLength(20);
            entity.Property(t => t.Status).HasConversion<string>().HasMaxLength(20);
            entity.Property(t => t.IsDeleted).IsRequired();

            entity.HasOne(t => t.AssignedToUser)
                .WithMany(u => u.AssignedTickets)
                .HasForeignKey(t => t.AssignedToUserId)
                .OnDelete(DeleteBehavior.SetNull);

            // Soft delete: deleted tickets are hidden from every query by default.
            entity.HasQueryFilter(t => !t.IsDeleted);
        });

        // Log tables are intentionally denormalized: no FK to Users and no FK to each other,
        // so logging never fails or cascades due to relational constraints.
        modelBuilder.Entity<RequestLog>(entity =>
        {
            entity.HasKey(r => r.Id);
            entity.Property(r => r.Method).IsRequired().HasMaxLength(10);
            entity.Property(r => r.Path).IsRequired().HasMaxLength(500);
            entity.Property(r => r.QueryString).HasMaxLength(1000);
            entity.Property(r => r.IPAddress).HasMaxLength(45);
            entity.HasIndex(r => r.Timestamp);
        });

        modelBuilder.Entity<ActivityLog>(entity =>
        {
            entity.HasKey(a => a.Id);
            entity.Property(a => a.Action).IsRequired().HasMaxLength(100);
            entity.Property(a => a.EntityName).IsRequired().HasMaxLength(100);
            entity.Property(a => a.Details).HasMaxLength(4000);
            entity.HasIndex(a => a.Timestamp);
        });

        modelBuilder.Entity<ErrorLog>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Method).IsRequired().HasMaxLength(10);
            entity.Property(e => e.Path).IsRequired().HasMaxLength(500);
            entity.Property(e => e.Message).IsRequired().HasMaxLength(2000);
            entity.Property(e => e.ExceptionType).HasMaxLength(300);
            entity.Property(e => e.IPAddress).HasMaxLength(45);
            entity.HasIndex(e => e.Timestamp);
        });

        modelBuilder.Entity<RevokedToken>(entity =>
        {
            entity.HasKey(r => r.Id);
            entity.Property(r => r.Jti).IsRequired().HasMaxLength(100);
            entity.HasIndex(r => r.Jti).IsUnique();
        });
    }
}
