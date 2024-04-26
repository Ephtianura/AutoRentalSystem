using AutoRentalSystem.Application.Contracts;
using AutoRentalSystem.Core.Contracts;
using AutoRentalSystem.Core.Models;
using AutoRentalSystem.Core.Models.Common;
using AutoRentalSystem.Core.Models.Filters;

namespace AutoRentalSystem.Application.Services
{
    // ================== BOOKINGS ==================
    public class BookingService : IBookingService
    {
        private readonly IBookingRepository _bookings;
        private readonly ICarRepository _cars;
        private readonly IUserRepository _users;

        public BookingService(IBookingRepository bookings, ICarRepository cars, IUserRepository users)
        {
            _bookings = bookings;
            _cars = cars;
            _users = users;
        }

        public async Task<Booking> CreateBooking(int userId, Booking booking)
        {
            var user = await _users.GetByIdAsync(userId);
            if (user == null)
                throw new InvalidOperationException("User not found.");

            if (user.Status == UserStatus.Blocked)
                throw new InvalidOperationException("Blocked users cannot create bookings.");

            var car = await _cars.GetByIdAsync(booking.CarId);
            if (car == null || car.Status != CarStatus.Available)
                throw new InvalidOperationException("Car not available.");

            var availableCars = await _cars.GetAvailableCarsAsync(booking.StartDate, booking.EndDate);
            if (!availableCars.Any(c => c.Id == booking.CarId))
                throw new InvalidOperationException("Car already booked for this period.");

            var userBookings = await _bookings.GetByUserIdAsync(userId);
            if (userBookings.Any(b => b.Status != BookingStatus.Finished &&
                                      b.StartDate < booking.EndDate &&
                                      b.EndDate > booking.StartDate))
                throw new InvalidOperationException("You already have a booking in this period.");

            booking.UserId = userId;
            booking.Status = BookingStatus.Pending;
            await _bookings.AddAsync(booking);
            return booking;
        }


        public async Task ApproveBooking(int bookingId)
        {
            var booking = await _bookings.GetByIdAsync(bookingId);
            if (booking == null) throw new InvalidOperationException("Booking not found.");

            booking.Status = BookingStatus.Approved;
            await _bookings.UpdateAsync(booking);
        }

        public async Task RejectBooking(int bookingId)
        {
            var booking = await _bookings.GetByIdAsync(bookingId);
            if (booking == null) throw new InvalidOperationException("Booking not found.");

            booking.Status = BookingStatus.Rejected;
            await _bookings.UpdateAsync(booking);
        }

        public async Task FinishBooking(int bookingId)
        {
            var booking = await _bookings.GetByIdAsync(bookingId);
            if (booking == null) throw new InvalidOperationException("Booking not found.");

            booking.Status = BookingStatus.Finished;
            var car = await _cars.GetByIdAsync(booking.CarId);
            if (car != null)
            {
                car.Status = CarStatus.Available;
                await _cars.UpdateAsync(car);
            }
            await _bookings.UpdateAsync(booking);
        }

        public async Task<PagedResult<Booking>> GetByUserId(int userId, BookingFilter? filter = null, PagedRequest? request = null)
        {
            filter ??= new BookingFilter { UserId = userId };
            return await _bookings.GetFilteredAsync(filter, request ?? new PagedRequest());
        }

        public async Task<PagedResult<Booking>> GetAll(BookingFilter? filter = null, PagedRequest? request = null)
        {
            return await _bookings.GetFilteredAsync(filter ?? new BookingFilter(), request ?? new PagedRequest());
        }
    }


}
