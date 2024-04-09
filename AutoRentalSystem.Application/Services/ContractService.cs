using AutoRentalSystem.Core.Contracts;
using AutoRentalSystem.Core.Models;

namespace AutoRentalSystem.Application.Services
{
    // ================== CONTRACTS ==================
    public class ContractService
    {
        private readonly IContractRepository _contracts;

        public ContractService(IContractRepository contracts) => _contracts = contracts;

        public async Task<Core.Models.Contract> GenerateContract(Booking booking)
        {
            var contract = new Core.Models.Contract
            {
                BookingId = booking.Id,
                IsSignedByUser = false,
                IsSignedByAdmin = false
            };
            await _contracts.AddAsync(contract);
            return contract;
        }

        public async Task SignByUser(Core.Models.Contract contract)
        {
            contract.IsSignedByUser = true;
            await _contracts.UpdateAsync(contract);
        }

        public async Task SignByAdmin(Core.Models.Contract contract)
        {
            contract.IsSignedByAdmin = true;
            await _contracts.UpdateAsync(contract);
        }

        public async Task<Core.Models.Contract?> GetByBooking(int bookingId) =>
            await _contracts.GetByBookingIdAsync(bookingId);
    }
}
