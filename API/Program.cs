using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using API.Extensions;
using API.Middleware;
using API.SignalR;
using Domain;
using Persistence;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers(options =>
{
    var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();

    options.Filters.Add(new AuthorizeFilter(policy));
});
builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddIdentityServices(builder.Configuration);

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseMiddleware<ExceptionMiddleware>();

app.UseXContentTypeOptions();
app.UseReferrerPolicy(options =>
{
    options.NoReferrer();
});
app.UseXXssProtection(options =>
{
    options.EnabledWithBlockMode();
});
app.UseXfo(options =>
{
    options.Deny();
});
app.UseCsp(options =>
{
    options.BlockAllMixedContent();
    options.FontSources(configuration => configuration.Self()
        .CustomSources("https://fonts.gstatic.com", "data:"));
    options.FormActions(configuration => configuration.Self());
    options.StyleSources(configuration => configuration.Self()
        .CustomSources("https://fonts.googleapis.com", "sha256-DpOoqibK/BsYhobWHnU38Pyzt5SjDZuR/mFsAiVN7kk="));
    options.ImageSources(configuration => configuration.Self()
        .CustomSources("blob:", "data:", "https://res.cloudinary.com", "https://scontent-iev1-1.xx.fbcdn.net"));
    options.ScriptSources(configuration => configuration.Self()
        .CustomSources("https://connect.facebook.net"));
    options.FrameAncestors(configuration => configuration.Self());
});

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.Use(async (context, next) =>
    {
        context.Response.Headers.Add("Strict-Transport-Security", "max-age=31536000");

        await next.Invoke();
    });
}

app.UseCors("CorsPolicy");

app.UseAuthentication();
app.UseAuthorization();

app.UseDefaultFiles();
app.UseStaticFiles();

app.MapControllers();
app.MapHub<ChatHub>("/chat");
app.MapFallbackToController("Index", "Fallback");

using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;

try
{
    var context = services.GetRequiredService<DataContext>();
    var userManager = services.GetRequiredService<UserManager<AppUser>>();

    await context.Database.MigrateAsync();

    await Seed.SeedData(context, userManager);
}
catch (Exception e)
{
    var logger = services.GetRequiredService<ILogger<Program>>();
    logger.LogError(e, "An error occurred during migration");
}

app.Run();
