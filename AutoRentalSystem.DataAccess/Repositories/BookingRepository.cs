using AutoRentalSystem.Core.Contracts;
using AutoRentalSystem.Core.Models;
using AutoRentalSystem.Core.Models.Common;
using AutoRentalSystem.Core.Models.Filters;
using Microsoft.EntityFrameworkCore;

namespace AutoRentalSystem.DataAccess.Repositories
{
    public class BookingRepository : IBookingRepository
    {
        private readonly AutoRentalDbContext _db;
        public BookingRepository(AutoRentalDbContext db) => _db = db;

        public async Task<Booking?> GetByIdAsync(int id) =>
            await _db.Bookings.Include(b => b.Car).Include(b => b.User).FirstOrDefaultAsync(b => b.Id == id);

        public async Task<PagedResult<Booking>> GetFilteredAsync(BookingFilter filter, PagedRequest request)
        {
            IQueryable<Booking> query = _db.Bookings.Include(b => b.Car).Include(b => b.User);

            if (filter.UserId.HasValue)
                query = query.Where(b => b.UserId == filter.UserId.Value);
            if (filter.CarId.HasValue)
                query = query.Where(b => b.CarId == filter.CarId.Value);
            if (filter.Status.HasValue)
                query = query.Where(b => b.Status == filter.Status.Value);
            if (filter.FromDate.HasValue)
                query = query.Where(b => b.StartDate >= filter.FromDate.Value);
            if (filter.ToDate.HasValue)
                query = query.Where(b => b.EndDate <= filter.ToDate.Value);

            return await query.PaginateAsync(request);
        }
        public async Task<IEnumerable<Booking>> GetByUserIdAsync(int userId)
        {
            return await _db.Bookings
                .Include(b => b.Car)
                .Include(b => b.User)
                .Where(b => b.UserId == userId)
                .ToListAsync();
        }

        public async Task AddAsync(Booking booking)
        {
            await _db.Bookings.AddAsync(booking);
            await _db.SaveChangesAsync();
        }

        public async Task UpdateAsync(Booking booking)
        {
            _db.Bookings.Update(booking);
            await _db.SaveChangesAsync();
        }
    }
}
