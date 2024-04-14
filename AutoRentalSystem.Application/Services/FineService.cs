    using AutoRentalSystem.Application.Contracts;
    using AutoRentalSystem.Core.Contracts;
    using AutoRentalSystem.Core.Models;
    using AutoRentalSystem.Core.Models.Common;
    using AutoRentalSystem.Core.Models.Filters;

    namespace AutoRentalSystem.Application.Services
    {
        // ================== FINES ==================
        public class FineService : IFineService
        {
            private readonly IFineRepository _fines;
            private readonly IBookingRepository _bookings;

            public FineService(IFineRepository fines, IBookingRepository bookings)
            {
                _fines = fines;
                _bookings = bookings;
            }

            public async Task AddFine(Fine fine) => await _fines.AddAsync(fine);

            public async Task<PagedResult<Fine>> GetByUserId(int userId)
            {
                return await _fines.GetFilteredAsync(new FineFilter { UserId = userId }, new PagedRequest());
            }

            public async Task PayFine(int userId, int fineId)
            {
                var fine = await _fines.GetByIdAsync(fineId);
                if (fine == null)
                    throw new InvalidOperationException("Fine not found.");

                // загружаем бронирование, чтобы узнать кому оно принадлежит
                var booking = await _bookings.GetByIdAsync(fine.BookingId);
                if (booking == null || booking.UserId != userId)
                    throw new UnauthorizedAccessException("You cannot pay this fine.");

                fine.Status = FineStatus.Paid;
                await _fines.UpdateAsync(fine);
            }

        }

    }
