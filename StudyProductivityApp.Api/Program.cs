using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Text;
using HotChocolate.AspNetCore;
using HotChocolate.AspNetCore.Playground;
using StudyProductivityApp.Api.Hubs;
using StudyProductivityApp.Core.Graphql.Mutations;
using StudyProductivityApp.Core.Graphql.Queries;
using StudyProductivityApp.Core.Interfaces;
using StudyProductivityApp.Core.Interfaces.RepositoryInterfaces;
using StudyProductivityApp.Core.Interfaces.ServiceInterfaces;
using StudyProductivityApp.Api;
using StudyProductivityApp.Application.Services;
using Microsoft.AspNetCore.Http.Features;
using StudyProductivityApp.Persistence.Data;
using StudyProductivityApp.Persistence.Repositories;
using HotChocolate.Data;
using Azure.Storage.Blobs;
using Azure.Identity;
using Azure.Security.KeyVault.Secrets;
using Azure.Core;
using Azure.Extensions.AspNetCore.Configuration.Secrets;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.EntityFrameworkCore.SqlServer.Infrastructure.Internal;
using StudyProductivityApp.Core.Services;
using Microsoft.AspNetCore.Identity;
using StudyProductivityApp.Core.Models;
using dotenv.net;

var builder = WebApplication.CreateBuilder(new WebApplicationOptions
{
    Args = args,
    ContentRootPath = Directory.GetCurrentDirectory(),
    WebRootPath = System.IO.Path.Combine(Directory.GetCurrentDirectory(), "wwwroot")
});


var keyVaultUrl = "https://studyproductivitysecrets.vault.azure.net/";

var credential = new ClientSecretCredential(
    tenantId: "475de0f8-5bba-4360-8afa-75a847badfc1",
    clientId: "90e087ac-550f-4b1d-9cb3-555767b7b92f",
    clientSecret: "Kgl8Q~Dn3jAStr108wpFoWwju6tn14xTXhcbmdBD",
    new TokenCredentialOptions
    {
        AuthorityHost = AzureAuthorityHosts.AzurePublicCloud
    }
);

Console.WriteLine("TENANT ID: ", Environment.GetEnvironmentVariable("AZURE_TENANT_ID"));
Console.WriteLine("CLIENT ID: ", Environment.GetEnvironmentVariable("AZURE_CLIENT_ID"));




var secretClient = new SecretClient(
    new Uri(keyVaultUrl),
    credential,
    new SecretClientOptions()
    {
        Retry =
        {
            Delay = TimeSpan.FromSeconds(2),
            MaxDelay = TimeSpan.FromSeconds(16),
            MaxRetries = 5,
            Mode = RetryMode.Exponential
        }
    }
);

builder.Configuration.AddAzureKeyVault(
    secretClient,
    new AzureKeyVaultConfigurationOptions
    {
        ReloadInterval = TimeSpan.FromMinutes(5)
    }


);

// At the start of your configuration
builder.Configuration
    .SetBasePath(builder.Environment.ContentRootPath)
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true, reloadOnChange: true)
    .AddEnvironmentVariables()
    .Build();

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSignalR().AddAzureSignalR(options =>
{
    options.ConnectionString = builder.Configuration["azure-signalr-connectionstring"];
    options.ServerStickyMode = Microsoft.Azure.SignalR.ServerStickyMode.Required;
    options.InitialHubServerConnectionCount = 20; // Increase connection count
});
builder.Services.AddLogging();



var rootPath = Directory.GetParent(Directory.GetCurrentDirectory())?.FullName;
var envPath = System.IO.Path.Combine(rootPath!, ".env");

if (File.Exists(envPath))
{
    DotEnv.Load(options: new DotEnvOptions(envFilePaths: new[] { envPath }));
}





builder.Services.AddSingleton<BlobServiceClient>(sp =>
{
    var connectionString = builder.Configuration["StudyProdStorageAcc-ConnectionString"];
    if (string.IsNullOrEmpty(connectionString))
    {
        // For development, you could fall back to the Azure Storage Emulator
        connectionString = "UseDevelopmentStorage=true";
    }
    try
    {
        var client = new BlobServiceClient(connectionString);
        // Test the connection
        client.GetBlobContainers().FirstOrDefault();
        return client;
    }
    catch (Exception ex)
    {
        throw new InvalidOperationException($"Unable to create BlobServiceClient: {ex.Message}", ex);
    }
});

// Add this to verify the connection string is available
builder.Services.AddLogging(logging =>
{
    logging.AddConsole();
    logging.AddDebug();
    logging.SetMinimumLevel(LogLevel.Debug);
});

builder.Services.AddHealthChecks();





// Configure Entity Framework with SQL Server
// First, register DbContext as a singleton configuration
builder.Services.AddSingleton<DbContextOptions<StudyProductivityDbContext>>(provider =>
{
    var connectionString = builder.Configuration["DefaultConnection"];
    Console.WriteLine("Creating DbContext options...");

    if (string.IsNullOrEmpty(connectionString))
    {
        throw new InvalidOperationException("Database connection string is null or empty");
    }

    var optionsBuilder = new DbContextOptionsBuilder<StudyProductivityDbContext>();
    optionsBuilder.UseSqlServer(connectionString, sqlServerOptionsAction: sqlOptions =>
    {
        sqlOptions.EnableRetryOnFailure(
            maxRetryCount: 5,
            maxRetryDelay: TimeSpan.FromSeconds(30),
            errorNumbersToAdd: null);
        sqlOptions.CommandTimeout(30);
    });

    optionsBuilder
        .LogTo(
            Console.WriteLine,
            new[] { DbLoggerCategory.Database.Command.Name },
            LogLevel.Information,
            DbContextLoggerOptions.DefaultWithLocalTime)
        .EnableSensitiveDataLogging()
        .EnableDetailedErrors();

    return optionsBuilder.Options;
});

// Then register the DbContext itself as scoped
builder.Services.AddDbContext<StudyProductivityDbContext>(options =>
{
    var connectionString = builder.Configuration["DefaultConnection"];
    if (string.IsNullOrEmpty(connectionString))
    {
        throw new InvalidOperationException("Database connection string is null or empty");
    }

    options.UseSqlServer(connectionString, sqlServerOptionsAction: sqlOptions =>
    {
        sqlOptions.EnableRetryOnFailure(
            maxRetryCount: 5,
            maxRetryDelay: TimeSpan.FromSeconds(30),
            errorNumbersToAdd: null);
    });
});


// Add this near the top with other service registrations
builder.Services.AddHttpClient();

// Or if you want a named client specifically for SignalR
builder.Services.AddSignalR()
    .AddAzureSignalR(options =>
    {
        options.ConnectionString = builder.Configuration["azure-signalr-connectionstring"];
        options.ServerStickyMode = Microsoft.Azure.SignalR.ServerStickyMode.Required;
        options.ApplicationName = "StudyProductivityApp";
        options.InitialHubServerConnectionCount = 50;
    });



builder.Services.AddHostedService<SasTokenRefreshService>();

// Register repositories
builder.Services.AddScoped<ITodoTaskRepository, TodoTaskRepository>();
builder.Services.AddScoped<IDocumentRepository, DocumentRepository>();
builder.Services.AddScoped<IChatRoomRepository, ChatRoomRepository>();
builder.Services.AddScoped<IMessageRepository, MessageRepository>();
builder.Services.AddScoped<IUserFileRepository, UserFileRepository>();
builder.Services.AddScoped<IMeetupRepository, MeetupRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IFriendRepository, FriendRepository>();
builder.Services.AddScoped<IExerciseRepository, ExerciseRepository>();
builder.Services.AddScoped<ITodoTaskRepository, TodoTaskRepository>();


// Register services
builder.Services.AddScoped<IChatService, ChatService>();
builder.Services.AddScoped<IMeetupService, MeetupService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IUserFileService, UserFileService>();
builder.Services.AddScoped<IFriendService, FriendService>();
builder.Services.AddScoped<IExerciseService, ExerciseService>();
builder.Services.AddScoped<ITodoTaskService, TodoTaskService>();
builder.Services.AddSingleton<IEncryptionService, EncryptionService>();
builder.Services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();



// Add AutoMapper
builder.Services.AddAutoMapper(typeof(MapperConfig));

builder.Services.AddApplicationInsightsTelemetry();

// Configure JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["jwt-issuer"],
            ValidAudience = builder.Configuration["jwt-audience"], // Use this if different from Issuer
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["jwt-key"]))
        };

        // Enable JWT token for SignalR connections via query string
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var accessToken = context.Request.Query["access_token"];
                var path = context.HttpContext.Request.Path;

                // If the request is for our SignalR hub, assign the token
                if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/hubs/chat"))
                {
                    context.Token = accessToken;
                }
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();






builder.Services.Configure<FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = 1073741824; // 2 GB
});

builder.Services.AddScoped<UserMutations>(); // Ensure UserMutations is registered
builder.Services.AddScoped<Mutation>();
builder.Services.AddScoped<UserQueries>(); // Ensure UserQueries is registered
builder.Services.AddScoped<Query>();


// Configure GraphQL with Hot Chocolate
builder.Services
    .AddGraphQLServer()
    .RegisterDbContext<StudyProductivityDbContext>(DbContextKind.Synchronized)
    .AddQueryType<Query>()
    .AddMutationType<Mutation>()
    .ModifyRequestOptions(opt => opt.IncludeExceptionDetails = builder.Environment.IsDevelopment());

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder =>
        {
            builder
                .WithOrigins(
                    "https://studyproductivityapp-frontend.azurewebsites.net"
                )
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
        });
});

var secret = builder.Configuration["DefaultConnection"];
Console.WriteLine("TEST BACKEND VAR: ", Environment.GetEnvironmentVariable("TEST_VAR"));

// Build and configure the application
var app = builder.Build();

// Configure middleware in correct order
app.UseXContentTypeOptions();
app.UseReferrerPolicy(opt => opt.NoReferrer());
app.UseXXssProtection(opt => opt.EnabledWithBlockMode());
app.UseXfo(opt => opt.Deny());
app.UseCspReportOnly(opt => opt
    .BlockAllMixedContent()
    .StyleSources(s => s.Self().CustomSources("https://fonts.googleapis.com"))
    .FontSources(s => s.Self().CustomSources("https://fonts.gstatic.com", "data:"))
    .FormActions(s => s.Self())
    .FrameAncestors(s => s.Self())
    .ImageSources(s => s.Self().CustomSources("blob:"))
    .ScriptSources(s => s.Self())
);

// CORS should be one of the first middleware
app.UseCors("AllowAll");

// Static files and HTTPS redirection
app.UseStaticFiles();
app.UseHttpsRedirection();

// Authentication and Authorization
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UsePlayground(new PlaygroundOptions
    {
        QueryPath = "/graphql",
        Path = "/playground"
    });
}

// Health check endpoint
app.MapGet("/health", () =>
{
    Console.WriteLine("Health check called");
    return Results.Ok("Healthy");
});

// Map other endpoints
app.MapGraphQL();
app.MapHub<DocumentHub>("/hubs/document");
app.MapHub<ChatHub>("/hubs/chat");
app.MapControllers();

// Ensure we're listening on all interfaces
app.Urls.Add($"http://*:5193");

// Run the application (only once)
await app.RunAsync();