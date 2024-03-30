using AutoRentalSystem.Core.Models;

namespace AutoRentalSystem.Application.Services
{
    public interface IAuthService
    {
        Task<string> Login(string email, string passwordHash);
        Task Register(string userName, string password, string email, DateTime dateOfBirth);
    }
}