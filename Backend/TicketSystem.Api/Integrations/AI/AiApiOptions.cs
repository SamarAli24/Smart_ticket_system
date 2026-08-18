namespace TicketSystem.Api.Integrations.AI;

/// <summary>Bound from the "AiApi" section of appsettings.json.</summary>
public class AiApiOptions
{
    public string ApiKey { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
    public string BaseUrl { get; set; } = string.Empty;
}
