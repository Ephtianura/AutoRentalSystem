using AutoRentalSystem.Core.Models;
using AutoRentalSystem.Core.Models.Common;
using AutoRentalSystem.Core.Models.Filters;

namespace AutoRentalSystem.Application.Contracts
{
    public interface IPaymentService
    {
        Task<PagedResult<Payment>> GetPaymentsByBooking(PaymentFilter filter, PagedRequest request);
        Task MarkPaymentCompleted(int paymentId);
        Task<Payment> PayBooking(int userId, int bookingId);
    }
}