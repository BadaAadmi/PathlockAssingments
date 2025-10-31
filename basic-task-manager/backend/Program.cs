using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using TaskApi.Services;

var builder = WebApplication.CreateBuilder(args);

// Bind to a known port for development so the frontend can use a fixed API URL.
// This sets Kestrel to listen on http://localhost:5000 by default.
builder.WebHost.UseUrls("http://localhost:5000");

builder.Services.AddControllers();
builder.Services.AddSingleton<ITaskService, InMemoryTaskService>();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
});

var app = builder.Build();

app.UseCors();
app.MapControllers();

app.Run();
