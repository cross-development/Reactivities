using Microsoft.EntityFrameworkCore;
using FluentValidation.AspNetCore;
using FluentValidation;
using Application.Activities;
using Application.Core;
using Application.Interfaces;
using Infrastructure.Photos;
using Infrastructure.Security;
using Persistence;

namespace API.Extensions;

public static class ApplicationServiceExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services,
        IConfiguration configuration)
    {
        // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen();

        // Add EF Core data context
        services.AddDbContext<DataContext>(options =>
        {
            var env = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");

            string connectionString;

            if (env == "Development")
            {
                // Use connection string from file.
                connectionString = configuration.GetConnectionString("DefaultConnection");
            }
            else
            {
                // Use connection string provided at runtime by Render.com.
                var connectionUrl = Environment.GetEnvironmentVariable("DATABASE_URL");

                // Parse connection URL to connection string for Npgsql
                connectionUrl = connectionUrl.Replace("postgres://", string.Empty);

                var pgUserPass = connectionUrl.Split("@")[0];
                var pgHostPortDb = connectionUrl.Split("@")[1];
                var pgHostPort = pgHostPortDb.Split("/")[0];

                var pgHost = pgHostPort.Split(":")[0];
                var pgPort = pgHostPort.Split(":")[1];
                var pgUser = pgUserPass.Split(":")[0];
                var pgPass = pgUserPass.Split(":")[1];
                var pgDb = pgHostPortDb.Split("/")[1];

                connectionString = $"Server={pgHost};Port={pgPort};User Id={pgUser};Password={pgPass};Database={pgDb};";
            }

            options.UseNpgsql(connectionString);
        });

        // Add Cors policy
        services.AddCors(options =>
        {
            options.AddPolicy("CorsPolicy", policy =>
            {
                policy.AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials()
                    .WithOrigins("http://localhost:3000");
            });
        });

        // Add MediatR
        services.AddMediatR(config =>
        {
            config.RegisterServicesFromAssembly(typeof(List.Handler).Assembly);
        });

        // Add AutoMapper
        services.AddAutoMapper(typeof(MappingProfiles).Assembly);

        // Add FluentValidation 
        services.AddFluentValidationAutoValidation();
        services.AddValidatorsFromAssemblyContaining<Create>();

        // Add User Accessor
        services.AddHttpContextAccessor();
        services.AddScoped<IUserAccessor, UserAccessor>();

        // Add Photo Accessor
        services.AddScoped<IPhotoAccessor, PhotoAccessor>();
        services.Configure<CloudinarySettings>(configuration.GetSection("Cloudinary"));

        // Add SignalR
        services.AddSignalR();

        return services;
    }
}