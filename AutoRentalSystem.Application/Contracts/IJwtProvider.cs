using AutoRentalSystem.Core.Models;

namespace AutoRentalSystem.Infrastructure.Auth
{
    public interface IJwtProvider
    {
        string GenerateToken(User user);
    }
}