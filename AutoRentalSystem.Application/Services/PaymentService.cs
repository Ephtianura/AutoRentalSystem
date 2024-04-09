using AutoRentalSystem.Core.Contracts;
using AutoRentalSystem.Core.Models;
using AutoRentalSystem.Core.Models.Common;
using AutoRentalSystem.Core.Models.Filters;

namespace AutoRentalSystem.Application.Services
{
    // ================== PAYMENTS ==================
    public class PaymentService
    {
        private readonly IPaymentRepository _payments;
        private readonly IFineRepository _fines;

        public PaymentService(IPaymentRepository payments, IFineRepository fines)
        {
            _payments = payments;
            _fines = fines;
        }

        public async Task<Payment> PayBooking(Booking booking)
        {
            var fines = await _fines.GetFilteredAsync(
                new FineFilter { BookingId = booking.Id }, new PagedRequest { PageNumber = 1, PageSize = 100 });

            decimal total = (booking.EndDate - booking.StartDate).Days * booking.Car.PricePerDay
                            + fines.Items.Where(f => f.Status == FineStatus.Unpaid).Sum(f => f.Amount);

            var payment = new Payment
            {
                BookingId = booking.Id,
                Amount = total,
                Status = PaymentStatus.Pending,
                PaymentDate = DateTime.UtcNow
            };

            await _payments.AddAsync(payment);
            return payment;
        }

        public async Task MarkPaymentCompleted(Payment payment)
        {
            payment.Status = PaymentStatus.Completed;
            await _payments.UpdateAsync(payment);
        }

        public async Task<PagedResult<Payment>> GetPaymentsByBooking(PaymentFilter filter, PagedRequest request) =>
            await _payments.GetFilteredAsync(filter, request);
    }
}
