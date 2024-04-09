using AutoRentalSystem.Core.Models;
using AutoRentalSystem.Core.Models.Common;
using AutoRentalSystem.Core.Models.Filters;

namespace AutoRentalSystem.Application.Contracts
{
    public interface IUserService
    {
        Task Block(int id);
        Task<PagedResult<User>> GetAll(UserFilter filter, PagedRequest request);
        Task<User?> GetById(int id);
        Task Unblock(int id);
        Task UpdateProfile(User user);
    }
}