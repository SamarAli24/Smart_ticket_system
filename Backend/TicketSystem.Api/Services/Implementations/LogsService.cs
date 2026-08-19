using System.Net;
using Microsoft.EntityFrameworkCore;
using TicketSystem.Api.Common.Responses;
using TicketSystem.Api.Data;
using TicketSystem.Api.DTOs;
using TicketSystem.Api.Helpers;
using TicketSystem.Api.Services.Interfaces;

namespace TicketSystem.Api.Services.Implementations;

public class LogsService : ILogsService
{
    // Log tables grow with every request/mutation/error, so reads are capped to the most
    // recent rows instead of returning the whole table.
    private const int MaxRows = 200;

    private readonly AppDbContext _dbContext;

    public LogsService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<Result> GetActivityLogsAsync()
    {
        var result = new Result();

        var logs = await _dbContext.ActivityLogs
            .OrderByDescending(l => l.Timestamp)
            .Take(MaxRows)
            .Select(l => new ActivityLogDto
            {
                Id = l.Id,
                Action = l.Action,
                EntityName = l.EntityName,
                EntityId = l.EntityId,
                PerformedByUserId = l.PerformedByUserId,
                Details = l.Details,
                Timestamp = l.Timestamp
            })
            .ToListAsync();

        return result.SetSuccess(HttpStatusCode.OK, MessageCode.ActivityLogsRetrieved, logs, logs.Count);
    }

    public async Task<Result> GetRequestLogsAsync()
    {
        var result = new Result();

        var logs = await _dbContext.RequestLogs
            .OrderByDescending(l => l.Timestamp)
            .Take(MaxRows)
            .Select(l => new RequestLogDto
            {
                Id = l.Id,
                Method = l.Method,
                Path = l.Path,
                QueryString = l.QueryString,
                StatusCode = l.StatusCode,
                ResponseTimeMs = l.ResponseTimeMs,
                IPAddress = l.IPAddress,
                UserId = l.UserId,
                Timestamp = l.Timestamp
            })
            .ToListAsync();

        return result.SetSuccess(HttpStatusCode.OK, MessageCode.RequestLogsRetrieved, logs, logs.Count);
    }

    public async Task<Result> GetErrorLogsAsync()
    {
        var result = new Result();

        var logs = await _dbContext.ErrorLogs
            .OrderByDescending(l => l.Timestamp)
            .Take(MaxRows)
            .Select(l => new ErrorLogDto
            {
                Id = l.Id,
                Method = l.Method,
                Path = l.Path,
                StatusCode = l.StatusCode,
                ErrorCode = l.ErrorCode,
                Message = l.Message,
                ExceptionType = l.ExceptionType,
                StackTrace = l.StackTrace,
                UserId = l.UserId,
                IPAddress = l.IPAddress,
                Timestamp = l.Timestamp
            })
            .ToListAsync();

        return result.SetSuccess(HttpStatusCode.OK, MessageCode.ErrorLogsRetrieved, logs, logs.Count);
    }
}
