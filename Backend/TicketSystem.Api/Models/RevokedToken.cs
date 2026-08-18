namespace TicketSystem.Api.Models;

/// <summary>
/// A JWT that was invalidated via logout before its natural expiry. Checked on every
/// authenticated request; rows can be purged once ExpiresAtUtc has passed.
/// </summary>
public class RevokedToken
{
    public int Id { get; set; }
    public string Jti { get; set; } = string.Empty;
    public DateTime ExpiresAtUtc { get; set; }
}
