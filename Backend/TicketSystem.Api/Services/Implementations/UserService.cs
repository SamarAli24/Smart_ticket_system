using System.Net;
using Microsoft.AspNetCore.Identity;
using TicketSystem.Api.Common.Responses;
using TicketSystem.Api.DTOs;
using TicketSystem.Api.Helpers;
using TicketSystem.Api.Models;
using TicketSystem.Api.Repositories.Interfaces;
using TicketSystem.Api.Services.Interfaces;

namespace TicketSystem.Api.Services.Implementations;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;
    private readonly IPasswordHasher<User> _passwordHasher;

    public UserService(IUserRepository userRepository, IPasswordHasher<User> passwordHasher)
    {
        _userRepository = userRepository;
        _passwordHasher = passwordHasher;
    }

    public async Task<Result> GetAllAsync()
    {
        var result = new Result();

        var users = await _userRepository.GetAllAsync();
        var userDtos = users.Select(MapToDto).ToList();

        return result.SetSuccess(HttpStatusCode.OK, MessageCode.UsersRetrieved, userDtos, userDtos.Count);
    }

    public async Task<Result> CreateAsync(CreateUserDto dto)
    {
        var result = new Result();

        if (!Enum.TryParse<UserRole>(dto.Role, ignoreCase: true, out var role))
        {
            return result.SetError(
                HttpStatusCode.BadRequest,
                MessageCode.InvalidUserRole,
                dto.Role,
                string.Join(", ", Enum.GetNames<UserRole>()));
        }

        var emailExists = await _userRepository.EmailExistsAsync(dto.Email);
        if (emailExists)
        {
            return result.SetError(HttpStatusCode.BadRequest, MessageCode.EmailAlreadyExists, dto.Email);
        }

        var user = new User
        {
            FullName = dto.FullName,
            Email = dto.Email,
            Role = role,
            IsActive = true
        };
        user.PasswordHash = _passwordHasher.HashPassword(user, dto.Password);

        await _userRepository.AddAsync(user);

        return result.SetSuccess(HttpStatusCode.Created, MessageCode.UserCreated, MapToDto(user));
    }

    public async Task<Result> DeactivateAsync(int id)
    {
        var result = new Result();

        var user = await _userRepository.FindAsync(id);
        if (user is null)
        {
            return result.SetError(HttpStatusCode.NotFound, MessageCode.UserNotFound, id.ToString());
        }

        user.IsActive = false;
        await _userRepository.SaveChangesAsync();

        return result.SetSuccess(HttpStatusCode.OK, MessageCode.UserDeactivated, MapToDto(user));
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
