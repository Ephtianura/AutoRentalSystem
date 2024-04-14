using AutoRentalSystem.Application.Contracts;
using AutoRentalSystem.Core.Contracts;
using AutoRentalSystem.Core.Models;
using AutoRentalSystem.Core.Models.Common;
using AutoRentalSystem.Core.Models.Filters;

namespace AutoRentalSystem.Application.Services
{
    // ================== PAYMENTS ==================
    public class PaymentService : IPaymentService
    {
        private readonly IPaymentRepository _payments;
        private readonly IFineRepository _fines;
        private readonly IBookingRepository _bookings;

        public PaymentService(IPaymentRepository payments, IFineRepository fines, IBookingRepository bookings)
        {
            _payments = payments;
            _fines = fines;
            _bookings = bookings;
        }

        public async Task<Payment> PayBooking(int userId, int bookingId)
        {
            var booking = await _bookings.GetByIdAsync(bookingId);
            if (booking == null || booking.UserId != userId)
                throw new UnauthorizedAccessException("You cannot pay for this booking.");

            var fines = await _fines.GetFilteredAsync(new FineFilter { BookingId = bookingId },
                                                     new PagedRequest { PageNumber = 1, PageSize = 100 });

            decimal total = (booking.EndDate - booking.StartDate).Days * booking.Car.PricePerDay
                            + fines.Items.Where(f => f.Status == FineStatus.Unpaid).Sum(f => f.Amount);

            var payment = new Payment
            {
                BookingId = bookingId,
                Amount = total,
                Status = PaymentStatus.Pending,
                PaymentDate = DateTime.UtcNow
            };

            await _payments.AddAsync(payment);
            return payment;
        }

        public async Task MarkPaymentCompleted(int paymentId)
        {
            var payment = await _payments.GetByIdAsync(paymentId);
            if (payment == null) throw new InvalidOperationException("Payment not found.");

            payment.Status = PaymentStatus.Completed;
            await _payments.UpdateAsync(payment);
        }

        public async Task<PagedResult<Payment>> GetPaymentsByBooking(PaymentFilter filter, PagedRequest request)
            => await _payments.GetFilteredAsync(filter, request);
    }


}
