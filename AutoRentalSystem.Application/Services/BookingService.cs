using AutoRentalSystem.Core.Contracts;
using AutoRentalSystem.Core.Models;
using AutoRentalSystem.Core.Models.Common;
using AutoRentalSystem.Core.Models.Filters;

namespace AutoRentalSystem.Application.Services
{
    // ================== BOOKINGS ==================
    public class BookingService
    {
        private readonly IBookingRepository _bookings;
        private readonly ICarRepository _cars;

        public BookingService(IBookingRepository bookings, ICarRepository cars)
        {
            _bookings = bookings;
            _cars = cars;
        }

        public async Task<Booking> CreateBooking(Booking booking)
        {
            var car = await _cars.GetByIdAsync(booking.CarId);
            if (car == null || car.Status != CarStatus.Available)
                throw new InvalidOperationException("Car not available.");

            var available = await _cars.GetAvailableCarsAsync(booking.StartDate, booking.EndDate);
            if (!available.Any(c => c.Id == booking.CarId))
                throw new InvalidOperationException("Car already booked for this period.");

            booking.Status = BookingStatus.Pending;
            await _bookings.AddAsync(booking);
            return booking;
        }

        public async Task ApproveBooking(Booking booking)
        {
            booking.Status = BookingStatus.Approved;
            await _bookings.UpdateAsync(booking);
        }

        public async Task RejectBooking(Booking booking)
        {
            booking.Status = BookingStatus.Rejected;
            await _bookings.UpdateAsync(booking);
        }

        public async Task FinishBooking(Booking booking)
        {
            booking.Status = BookingStatus.Finished;
            var car = await _cars.GetByIdAsync(booking.CarId);
            if (car != null)
            {
                car.Status = CarStatus.Available;
                await _cars.UpdateAsync(car);
            }
            await _bookings.UpdateAsync(booking);
        }

        public async Task<PagedResult<Booking>> GetUserBookings(BookingFilter filter, PagedRequest request) =>
            await _bookings.GetFilteredAsync(filter, request);

        public async Task<PagedResult<Booking>> GetAllBookings(BookingFilter filter, PagedRequest request) =>
            await _bookings.GetFilteredAsync(filter, request);
    }
}
