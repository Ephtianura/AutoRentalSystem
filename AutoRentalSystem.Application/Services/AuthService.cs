using AutoRentalSystem.Application.Contracts;
using AutoRentalSystem.Core.Contracts;
using AutoRentalSystem.Core.Models;
using AutoRentalSystem.Infrastructure.Auth;

namespace AutoRentalSystem.Application.Services
{
    //================== AUTH ==================
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _users;
        private readonly IPasswordHasher _passwordHasher;
        private readonly IJwtProvider _jwtProvider;

        public AuthService(IUserRepository users, IPasswordHasher passwordHasher, IJwtProvider jwtProvider)
        {
            _users = users;
            _passwordHasher = passwordHasher;
            _jwtProvider = jwtProvider;
        }

        public async Task Register(string userName, string password, string email, DateTime dateOfBirth)
        {
            var hashedPassword = _passwordHasher.Generate(password);

            var user = User.Create(userName, hashedPassword, email, dateOfBirth);

            await _users.AddAsync(user); 
        }

        public async Task<string> Login(string email, string password)
        {
            var user = await _users.GetByEmailAsync(email);
            if (user == null)
                throw new UnauthorizedAccessException("User not found.");

            var result = _passwordHasher.Verify(password, user.PasswordHash);
            if (!result)
                throw new UnauthorizedAccessException("Invalid password.");

            var token = _jwtProvider.GenerateToken(user);
            return token;
        }

    }
}
