using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using TicketSystem.Api.Common.Responses;
using TicketSystem.Api.DTOs;
using TicketSystem.Api.Helpers;
using TicketSystem.Api.Models;
using TicketSystem.Api.Repositories.Interfaces;
using TicketSystem.Api.Services.Interfaces;

namespace TicketSystem.Api.Services.Implementations;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IRevokedTokenRepository _revokedTokenRepository;
    private readonly IPasswordHasher<User> _passwordHasher;
    private readonly IJwtTokenService _jwtTokenService;

    public AuthService(
        IUserRepository userRepository,
        IRevokedTokenRepository revokedTokenRepository,
        IPasswordHasher<User> passwordHasher,
        IJwtTokenService jwtTokenService)
    {
        _userRepository = userRepository;
        _revokedTokenRepository = revokedTokenRepository;
        _passwordHasher = passwordHasher;
        _jwtTokenService = jwtTokenService;
    }

    public async Task<Result> LoginAsync(LoginDto dto)
    {
        var result = new Result();

        var user = await _userRepository.GetByEmailAsync(dto.Email);
        if (user is null || _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, dto.Password) == PasswordVerificationResult.Failed)
        {
            return result.SetError(HttpStatusCode.Unauthorized, MessageCode.InvalidCredentials);
        }

        if (!user.IsActive)
        {
            return result.SetError(HttpStatusCode.Unauthorized, MessageCode.AccountDeactivated);
        }

        var token = _jwtTokenService.GenerateToken(user);

        var response = new LoginResponseDto
        {
            Token = token.Token,
            ExpiresAtUtc = token.ExpiresAtUtc,
            User = MapToDto(user)
        };

        return result.SetSuccess(HttpStatusCode.OK, MessageCode.LoginSuccess, response);
    }

    public async Task<Result> LogoutAsync(ClaimsPrincipal principal)
    {
        var result = new Result();

        var jti = principal.FindFirst(JwtRegisteredClaimNames.Jti)?.Value;
        var expClaim = principal.FindFirst(JwtRegisteredClaimNames.Exp)?.Value;

        if (jti is null || expClaim is null || !long.TryParse(expClaim, out var expUnix))
        {
            return result.SetError(HttpStatusCode.Unauthorized, MessageCode.InvalidCredentials);
        }

        await _revokedTokenRepository.AddAsync(new RevokedToken
        {
            Jti = jti,
            ExpiresAtUtc = DateTimeOffset.FromUnixTimeSeconds(expUnix).UtcDateTime
        });

        return result.SetSuccess(HttpStatusCode.OK, MessageCode.LogoutSuccess);
    }

    private static UserDto MapToDto(User user) => new()
    {
        Id = user.Id,
        FullName = user.FullName,
        Email = user.Email,
        Role = user.Role.ToString(),
        IsActive = user.IsActive
    };
}
