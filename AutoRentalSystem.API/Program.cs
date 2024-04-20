using AutoRentalSystem.API.Extensions;
using AutoRentalSystem.Application.Contracts;
using AutoRentalSystem.Application.Services;
using AutoRentalSystem.Core.Contracts;
using AutoRentalSystem.DataAccess;
using AutoRentalSystem.DataAccess.Repositories;
using AutoRentalSystem.Infrastructure.Auth;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.CookiePolicy;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var configuration = builder.Configuration;

builder.Services.Configure<JwtOptions>(configuration.GetSection(nameof(JwtOptions)));

//InitialDB
builder.Services.AddDbContext<AutoRentalDbContext>(
    options =>
    {
        options.UseNpgsql(configuration.GetConnectionString(nameof(AutoRentalDbContext)));
    });

//DI Repositories
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ICarRepository, CarRepository>();
builder.Services.AddScoped<IBookingRepository, BookingRepository>();
builder.Services.AddScoped<IContractRepository, ContractRepository>();
builder.Services.AddScoped<IPaymentRepository, PaymentRepository>();
builder.Services.AddScoped<IFineRepository, FineRepository>();
builder.Services.AddScoped<IAuditLogRepository, AuditLogRepository>();

//DI Services
builder.Services.AddScoped<IUserService, UserService>();

builder.Services.AddScoped<UserService>();

builder.Services.AddScoped<CarService>();
builder.Services.AddScoped<BookingService>();
builder.Services.AddScoped<ContractService>();
builder.Services.AddScoped<PaymentService>();
builder.Services.AddScoped<FineService>();
builder.Services.AddScoped<AuditLogService>();

//DI Auth

builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IJwtProvider, JwtProvider>();
builder.Services.AddScoped<IPasswordHasher, PasswordHasher>();

var jwtOptions = builder.Configuration.GetSection(nameof(JwtOptions)).Get<JwtOptions>();
builder.Services.AddApiAuthentication(jwtOptions);


builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy => policy
            .WithOrigins("http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials());
});






builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
    });


var app = builder.Build();

app.UseCors("AllowFrontend");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}



app.UseHttpsRedirection();

app.UseCookiePolicy(new CookiePolicyOptions
{
    MinimumSameSitePolicy = SameSiteMode.Strict,
    HttpOnly = HttpOnlyPolicy.Always,
    Secure = CookieSecurePolicy.Always
}
);

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
