using AutoRentalSystem.Core.Models;
using AutoRentalSystem.Core.Models.Common;
using AutoRentalSystem.Core.Models.Filters;

namespace AutoRentalSystem.Application.Contracts
{
    public interface IBookingService
    {
        Task ApproveBooking(int bookingId);
        Task<Booking> CreateBooking(int userId, Booking booking);
        Task FinishBooking(int bookingId);
        Task<PagedResult<Booking>> GetAll(BookingFilter? filter = null, PagedRequest? request = null);
        Task<PagedResult<Booking>> GetByUserId(int userId, BookingFilter? filter = null, PagedRequest? request = null);
        Task RejectBooking(int bookingId);
    }
}