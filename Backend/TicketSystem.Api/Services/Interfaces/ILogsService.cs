using TicketSystem.Api.Common.Responses;

namespace TicketSystem.Api.Services.Interfaces;

public interface ILogsService
{
    Task<Result> GetActivityLogsAsync();
    Task<Result> GetRequestLogsAsync();
    Task<Result> GetErrorLogsAsync();
}
