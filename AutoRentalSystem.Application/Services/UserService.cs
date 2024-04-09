using AutoRentalSystem.Application.Contracts;
using AutoRentalSystem.Core.Contracts;
using AutoRentalSystem.Core.Models;
using AutoRentalSystem.Core.Models.Common;
using AutoRentalSystem.Core.Models.Filters;

namespace AutoRentalSystem.Application.Services
{
    //================== USERS ==================
    public class UserService : IUserService
    {
        private readonly IUserRepository _users;

        public UserService(IUserRepository users)
        {
            _users = users;
        }

        public async Task<PagedResult<User>> GetAll(UserFilter filter, PagedRequest request) =>
            await _users.GetFilteredAsync(filter, request);

        public async Task<User?> GetById(int id) => await _users.GetByIdAsync(id);

        public async Task UpdateProfile(User user) => await _users.UpdateAsync(user);

        public async Task Block(int id) => await _users.BlockUserAsync(id);

        public async Task Unblock(int id) => await _users.BlockUserAsync(id);
    }
}
