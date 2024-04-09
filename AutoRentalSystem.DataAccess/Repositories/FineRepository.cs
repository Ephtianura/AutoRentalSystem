using AutoRentalSystem.Core.Contracts;
using AutoRentalSystem.Core.Models;
using AutoRentalSystem.Core.Models.Common;
using AutoRentalSystem.Core.Models.Filters;
using Microsoft.EntityFrameworkCore;

namespace AutoRentalSystem.DataAccess.Repositories
{
    public class FineRepository : IFineRepository
    {
        private readonly AutoRentalDbContext _db;
        public FineRepository(AutoRentalDbContext db) => _db = db;

        public async Task<PagedResult<Fine>> GetFilteredAsync(FineFilter filter, PagedRequest request)
        {
            IQueryable<Fine> query = _db.Fines.Include(f => f.Booking);

            if (filter.BookingId.HasValue)
                query = query.Where(f => f.BookingId == filter.BookingId.Value);
            if (filter.Status.HasValue)
                query = query.Where(f => f.Status == filter.Status.Value);
            if (filter.IssuedFrom.HasValue)
                query = query.Where(f => f.DateIssued >= filter.IssuedFrom.Value);
            if (filter.IssuedTo.HasValue)
                query = query.Where(f => f.DateIssued <= filter.IssuedTo.Value);

            return await query.PaginateAsync(request);
        }

        public async Task AddAsync(Fine fine)
        {
            await _db.Fines.AddAsync(fine);
            await _db.SaveChangesAsync();
        }

        public async Task UpdateAsync(Fine fine)
        {
            _db.Fines.Update(fine);
            await _db.SaveChangesAsync();
        }
    }
}
