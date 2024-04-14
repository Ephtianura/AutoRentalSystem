using AutoRentalSystem.Application.Contracts;
using AutoRentalSystem.Core.Contracts;
using AutoRentalSystem.Core.Models;

namespace AutoRentalSystem.Application.Services
{
    // ================== CONTRACTS ==================
    public class ContractService : IContractService
    {
        private readonly IContractRepository _contracts;

        public ContractService(IContractRepository contracts) => _contracts = contracts;

        public async Task<Contract> GenerateContract(Booking booking)
        {
            if (booking == null) throw new ArgumentNullException(nameof(booking));

            var contract = new Contract
            {
                BookingId = booking.Id,
                IsSignedByUser = false,
                IsSignedByAdmin = false
            };

            await _contracts.AddAsync(contract);
            return contract;
        }

        public async Task SignByUser(Contract contract)
        {
            if (contract == null) throw new ArgumentNullException(nameof(contract));
            if (contract.IsSignedByUser) throw new InvalidOperationException("Contract already signed by user.");

            contract.IsSignedByUser = true;
            await _contracts.UpdateAsync(contract);
        }

        public async Task SignByAdmin(Contract contract)
        {
            if (contract == null) throw new ArgumentNullException(nameof(contract));
            if (!contract.IsSignedByUser) throw new InvalidOperationException("User must sign contract first.");
            if (contract.IsSignedByAdmin) throw new InvalidOperationException("Contract already signed by admin.");

            contract.IsSignedByAdmin = true;
            await _contracts.UpdateAsync(contract);
        }

        public async Task<Contract?> GetByBooking(int bookingId) =>
            await _contracts.GetByBookingIdAsync(bookingId);
    }

}
