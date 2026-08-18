using System.Net;
using System.Text.Json;
using System.Text.Json.Serialization;
using TicketSystem.Api.Helpers;

namespace TicketSystem.Api.Common.Responses;

/// <summary>
/// Standard envelope for every API response. Services build this directly instead of throwing
/// exceptions for expected failures (not found, validation, etc.) — controllers just forward it
/// with <see cref="StatusCode"/> as the HTTP status.
/// </summary>
public class Result
{
    [JsonPropertyName("statusCode")]
    public int StatusCode { get; private set; }

    [JsonPropertyName("success")]
    public bool Success { get; private set; }

    [JsonPropertyName("message")]
    public string Message { get; private set; } = string.Empty;

    [JsonPropertyName("count")]
    public int? Count { get; private set; }

    [JsonPropertyName("data")]
    public object? Data { get; private set; }

    [JsonPropertyName("error")]
    public APIError? Error { get; private set; }

    [JsonIgnore]
    public HttpStatusCode HttpStatusCode { get; private set; }

    private static readonly string MessagesFilePath = Path.Combine(AppContext.BaseDirectory, "messages.json");
    private static readonly JsonSerializerOptions JsonOptions = new() { PropertyNameCaseInsensitive = true };

    public Result()
    {
        Reset();
    }

    private void Reset()
    {
        Data = null;
        Error = null;
        Count = null;
        Message = string.Empty;
    }

    public Result SetSuccess(HttpStatusCode httpStatusCode, MessageCode code, object? data = null, int? count = null, params string[] tokens)
    {
        Reset();
        HttpStatusCode = httpStatusCode;
        StatusCode = (int)httpStatusCode;
        Success = true;
        Message = FormatMessage((int)code, tokens);
        Count = count is > 0 ? count : null;
        Data = data;
        return this;
    }

    public Result SetError(HttpStatusCode httpStatusCode, MessageCode code, params string[] tokens)
    {
        Reset();
        HttpStatusCode = httpStatusCode;
        StatusCode = (int)httpStatusCode;
        Success = false;
        Message = FormatMessage((int)code, tokens);
        Error = new APIError { Code = (int)code, Message = Message };
        return this;
    }

    private static string FormatMessage(int code, string[]? tokens)
    {
        var template = LoadMessages().FirstOrDefault(m => m.Code == code)?.Message;
        if (template is null)
        {
            return "Unknown error.";
        }

        return tokens is { Length: > 0 } ? string.Format(template, tokens.Cast<object>().ToArray()) : template;
    }

    private static List<MessageDefinition> LoadMessages()
    {
        if (!File.Exists(MessagesFilePath))
        {
            return new List<MessageDefinition>();
        }

        var json = File.ReadAllText(MessagesFilePath);
        return JsonSerializer.Deserialize<List<MessageDefinition>>(json, JsonOptions) ?? new List<MessageDefinition>();
    }

    private class MessageDefinition
    {
        public int Code { get; set; }
        public string Message { get; set; } = string.Empty;
    }
}

public class APIError
{
    [JsonPropertyName("code")]
    public int Code { get; set; }

    [JsonPropertyName("message")]
    public string Message { get; set; } = string.Empty;
}
