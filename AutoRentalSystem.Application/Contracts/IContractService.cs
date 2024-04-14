using AutoRentalSystem.Core.Models;

namespace AutoRentalSystem.Application.Contracts
{
    public interface IContractService
    {
        Task<Contract> GenerateContract(Booking booking);
        Task<Contract?> GetByBooking(int bookingId);
        Task SignByAdmin(Contract contract);
        Task SignByUser(Contract contract);
    }
}