using System.Net;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using TicketSystem.Api.Common;
using TicketSystem.Api.Common.Responses;
using TicketSystem.Api.Data;
using TicketSystem.Api.Filters;
using TicketSystem.Api.Helpers;
using TicketSystem.Api.Integrations.AI;
using TicketSystem.Api.Middleware;
using TicketSystem.Api.Models;
using TicketSystem.Api.Models.Logging;
using TicketSystem.Api.Repositories.Implementations;
using TicketSystem.Api.Repositories.Interfaces;
using TicketSystem.Api.Services.Implementations;
using TicketSystem.Api.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);

const string ReactAppCorsPolicy = "ReactAppCorsPolicy";

var jwtSettings = builder.Configuration.GetSection("Jwt").Get<JwtSettings>()
    ?? throw new InvalidOperationException("Jwt configuration section is missing.");

// The signing key may be supplied by the hosting environment so the value committed in
// appsettings.json is only a default. Both the standard "Jwt__Key" form (which configuration
// already maps onto Jwt:Key) and a flat "JWT_KEY" alias are honoured, the latter because some
// hosting panels don't accept double underscores in variable names.
var jwtKeyOverride = builder.Configuration["JWT_KEY"];
if (!string.IsNullOrWhiteSpace(jwtKeyOverride))
{
    jwtSettings.Key = jwtKeyOverride;
}

// HMAC-SHA256 needs at least a 256-bit (32-byte) key; failing here with a precise message beats
// failing later inside the token handler with an opaque one.
if (Encoding.UTF8.GetByteCount(jwtSettings.Key) < 32)
{
    throw new InvalidOperationException(
        "Jwt:Key is missing or shorter than 32 bytes. Set it in appsettings.json, or override it " +
        "with the JWT_KEY (or Jwt__Key) environment variable.");
}

// Register the resolved instance rather than re-binding the section, so token generation
// (JwtTokenService via IOptions) and token validation below can never use different keys.
builder.Services.AddSingleton(Options.Create(jwtSettings));
builder.Services.Configure<AiApiOptions>(builder.Configuration.GetSection("AiApi"));

// Services
builder.Services.AddControllers(options =>
{
    // Automatic business-level (ActivityLog) logging for every controller — no per-action code needed.
    options.Filters.Add<ActivityLoggingFilter>();
});

// Wrap [ApiController]'s automatic DataAnnotations validation failures in the same Result
// envelope as every other response, instead of the default ValidationProblemDetails shape.
builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.InvalidModelStateResponseFactory = context =>
    {
        var errors = context.ModelState
            .Where(e => e.Value?.Errors.Count > 0)
            .SelectMany(e => e.Value!.Errors.Select(err => $"{e.Key}: {err.ErrorMessage}"));

        var result = new Result();
        result.SetError(HttpStatusCode.BadRequest, MessageCode.ValidationFailed, string.Join(" | ", errors));

        // [ApiController]'s automatic model validation short-circuits before the controller
        // action (and therefore ApiControllerBase.RequestEnd) ever runs, so it needs its own
        // call into the shared error logger. The factory itself is synchronous, hence the block.
        LogAuthErrorAsync(context.HttpContext, result).GetAwaiter().GetResult();

        return new ObjectResult(result) { StatusCode = result.StatusCode };
    };
});
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "Smart Support Ticket System API",
        Version = "v1"
    });
});

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")
        ?? "Data Source=ticketsystem.db"));

builder.Services.AddScoped<ITicketRepository, TicketRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IRevokedTokenRepository, RevokedTokenRepository>();

builder.Services.AddScoped<ITicketService, TicketService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IAuthService, AuthService>();

// Rule-based classifier is kept registered on its own (both as the AI classifier's
// fallback dependency and as a directly swappable IPriorityClassifier implementation).
// To revert to rule-based-only classification, change the IPriorityClassifier
// registration below to: AddScoped<IPriorityClassifier, RuleBasedPriorityClassifier>().
builder.Services.AddSingleton<RuleBasedPriorityClassifier>();
builder.Services.AddHttpClient<AiApiClient>();
builder.Services.AddScoped<IPriorityClassifier, AiPriorityClassifier>();

builder.Services.AddSingleton<IJwtTokenService, JwtTokenService>();
builder.Services.AddSingleton<IPasswordHasher<User>, PasswordHasher<User>>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = jwtSettings.Issuer,
            ValidateAudience = true,
            ValidAudience = jwtSettings.Audience,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Key)),
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };

        // Reject tokens that were explicitly revoked via logout, even if they haven't expired yet.
        options.Events = new JwtBearerEvents
        {
            OnTokenValidated = async context =>
            {
                var jti = context.Principal?.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Jti)?.Value;
                if (jti is null)
                {
                    return;
                }

                var revokedTokenRepository = context.HttpContext.RequestServices.GetRequiredService<IRevokedTokenRepository>();
                var isRevoked = await revokedTokenRepository.IsRevokedAsync(jti);
                if (isRevoked)
                {
                    context.Fail("This token has been revoked.");
                }
            },

            // Keep 401/403 responses in the same Result envelope as every other endpoint,
            // instead of the JwtBearer handler's default empty body.
            OnChallenge = async context =>
            {
                context.HandleResponse();
                var result = new Result();
                result.SetError(HttpStatusCode.Unauthorized, MessageCode.Unauthorized);
                await LogAuthErrorAsync(context.HttpContext, result);
                context.Response.ContentType = "application/json";
                context.Response.StatusCode = result.StatusCode;
                await context.Response.WriteAsync(System.Text.Json.JsonSerializer.Serialize(result));
            },
            OnForbidden = async context =>
            {
                var result = new Result();
                result.SetError(HttpStatusCode.Forbidden, MessageCode.Forbidden);
                await LogAuthErrorAsync(context.HttpContext, result);
                context.Response.ContentType = "application/json";
                context.Response.StatusCode = result.StatusCode;
                await context.Response.WriteAsync(System.Text.Json.JsonSerializer.Serialize(result));
            }
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddCors(options =>
{
    options.AddPolicy(ReactAppCorsPolicy, policy =>
    {
        policy.WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

// Apply pending EF Core migrations and seed sample data on startup
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();

    var priorityClassifier = scope.ServiceProvider.GetRequiredService<IPriorityClassifier>();
    var passwordHasher = scope.ServiceProvider.GetRequiredService<IPasswordHasher<User>>();
    await DbSeeder.SeedAsync(db, priorityClassifier, passwordHasher);
}

// Middleware pipeline
// RequestLoggingMiddleware is registered outermost (before ExceptionHandlingMiddleware) so it
// observes the true final status code of every response — including ones ExceptionHandlingMiddleware
// rewrites to 400/404/500 — and so it captures every request, even ones that fail auth or throw.
app.UseMiddleware<RequestLoggingMiddleware>();

app.UseMiddleware<ExceptionHandlingMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "Smart Support Ticket System API v1");
    });
}

app.UseHttpsRedirection();

// Serve the React (Vite) build that is copied into wwwroot at deploy time.
// UseDefaultFiles must come before UseStaticFiles so "/" resolves to index.html.
app.UseDefaultFiles();
app.UseStaticFiles();

app.UseRouting();

app.UseCors(ReactAppCorsPolicy);

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Client-side routing catch-all: any request that did not match an API controller or a
// physical static file falls back to the SPA shell. Must be registered last so it never
// shadows /api/* routes.
app.MapFallbackToFile("index.html");

app.Run();

// Shared by the JwtBearer OnChallenge/OnForbidden handlers above: those run outside any
// controller, so they never pass through ApiControllerBase.RequestEnd's own error logging.
static async Task LogAuthErrorAsync(HttpContext context, Result result)
{
    try
    {
        var dbContext = context.RequestServices.GetRequiredService<AppDbContext>();
        dbContext.ErrorLogs.Add(new ErrorLog
        {
            Method = context.Request.Method,
            Path = context.Request.Path.Value ?? string.Empty,
            StatusCode = result.StatusCode,
            ErrorCode = result.Error?.Code,
            Message = result.Message,
            UserId = context.User.GetUserId(),
            IPAddress = context.Connection.RemoteIpAddress?.ToString(),
            Timestamp = DateTime.UtcNow
        });
        await dbContext.SaveChangesAsync();
    }
    catch (Exception ex)
    {
        var logger = context.RequestServices.GetRequiredService<ILogger<Program>>();
        logger.LogWarning(ex, "Failed to write error log for {Method} {Path}", context.Request.Method, context.Request.Path);
    }
}

public partial class Program
{
}
