using AutoRentalSystem.Core.Models;
using AutoRentalSystem.Core.Models.Common;

namespace AutoRentalSystem.Application.Contracts
{
    public interface IFineService
    {
        Task AddFine(Fine fine);
        Task<PagedResult<Fine>> GetByUserId(int userId);
        Task PayFine(int userId, int fineId);
    }
}