using AutoRentalSystem.Core.Contracts;
using AutoRentalSystem.Core.Models;
using AutoRentalSystem.Core.Models.Common;
using AutoRentalSystem.Core.Models.Filters;

namespace AutoRentalSystem.Application.Services
{
    // ================== FINES ==================
    public class FineService
    {
        private readonly IFineRepository _fines;

        public FineService(IFineRepository fines) => _fines = fines;

        public async Task AddFine(Fine fine) => await _fines.AddAsync(fine);

        public async Task<PagedResult<Fine>> GetFinesByBooking(FineFilter filter, PagedRequest request) =>
            await _fines.GetFilteredAsync(filter, request);

        public async Task PayFine(Fine fine)
        {
            fine.Status = FineStatus.Paid;
            await _fines.UpdateAsync(fine);
        }
    }
}
