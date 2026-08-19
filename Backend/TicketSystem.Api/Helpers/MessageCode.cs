namespace TicketSystem.Api.Helpers;

/// <summary>
/// Every code here must have a matching entry in messages.json (matched by its numeric value).
/// </summary>
public enum MessageCode
{
    // Success — Tickets
    TicketsRetrieved = 1001,
    TicketRetrieved = 1002,
    TicketCreated = 1003,
    TicketStatusUpdated = 1004,
    TicketDeleted = 1005,
    TicketUpdated = 1006,

    // Success — Users
    UsersRetrieved = 1101,
    UserCreated = 1102,
    UserDeactivated = 1103,

    // Success — Auth
    LoginSuccess = 1104,
    LogoutSuccess = 1105,

    // Success — Logs
    ActivityLogsRetrieved = 1201,
    RequestLogsRetrieved = 1202,
    ErrorLogsRetrieved = 1203,

    // Errors — Tickets
    TicketNotFound = 9001,
    InvalidTicketStatus = 9002,

    // Errors — Users
    UserNotFound = 9101,
    InvalidUserRole = 9102,
    EmailAlreadyExists = 9103,

    // Errors — Auth
    InvalidCredentials = 9104,
    AccountDeactivated = 9105,
    Unauthorized = 9106,
    Forbidden = 9107,

    // Generic errors
    ValidationFailed = 9901,
    InternalServerError = 9999
}
