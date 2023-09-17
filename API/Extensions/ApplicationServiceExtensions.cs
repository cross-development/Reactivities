using Microsoft.EntityFrameworkCore;
using Application.Activities;
using Application.Core;
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
            options.UseSqlite(configuration.GetConnectionString("DefaultConnection"));
        });

        // Add Cors policy
        services.AddCors(options =>
        {
            options.AddPolicy("CorsPolicy", policy =>
            {
                policy.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:3000");
            });
        });

        // Add MediatR
        services.AddMediatR(config =>
        {
            config.RegisterServicesFromAssembly(typeof(List.Handler).Assembly);
        });

        // Add AutoMapper
        services.AddAutoMapper(typeof(MappingProfiles).Assembly);

        return services;
    }
}