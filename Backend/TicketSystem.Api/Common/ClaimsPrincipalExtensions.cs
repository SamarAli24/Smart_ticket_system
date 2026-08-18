using System.Security.Claims;

namespace TicketSystem.Api.Common;

public static class ClaimsPrincipalExtensions
{
    /// <summary>Extracts the numeric user id from the NameIdentifier/"sub" claim, or null if unauthenticated/absent.</summary>
    public static int? GetUserId(this ClaimsPrincipal user)
    {
        var claim = user.FindFirst(ClaimTypes.NameIdentifier) ?? user.FindFirst("sub");
        return claim is not null && int.TryParse(claim.Value, out var id) ? id : null;
    }
}
