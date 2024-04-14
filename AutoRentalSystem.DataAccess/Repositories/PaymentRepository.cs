using AutoRentalSystem.Core.Contracts;
using AutoRentalSystem.Core.Models;
using AutoRentalSystem.Core.Models.Common;
using AutoRentalSystem.Core.Models.Filters;
using Microsoft.EntityFrameworkCore;

namespace AutoRentalSystem.DataAccess.Repositories
{
    public class PaymentRepository : IPaymentRepository
    {
        private readonly AutoRentalDbContext _db;
        public PaymentRepository(AutoRentalDbContext db) => _db = db;

        public async Task<Payment?> GetByIdAsync(int id)
        {
            return await _db.Payments
                .Include(p => p.Booking)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<PagedResult<Payment>> GetFilteredAsync(PaymentFilter filter, PagedRequest request)
        {
            IQueryable<Payment> query = _db.Payments.Include(p => p.Booking);

            if (filter.BookingId.HasValue)
                query = query.Where(p => p.BookingId == filter.BookingId.Value);
            if (filter.Status.HasValue)
                query = query.Where(p => p.Status == filter.Status.Value);
            if (filter.Method.HasValue)
                query = query.Where(p => p.PaymentMethod == filter.Method.Value);
            if (filter.From.HasValue)
                query = query.Where(p => p.PaymentDate >= filter.From.Value);
            if (filter.To.HasValue)
                query = query.Where(p => p.PaymentDate <= filter.To.Value);

            return await query.PaginateAsync(request);
        }

        public async Task AddAsync(Payment payment)
        {
            await _db.Payments.AddAsync(payment);
            await _db.SaveChangesAsync();
        }

        public async Task UpdateAsync(Payment payment)
        {
            _db.Payments.Update(payment);
            await _db.SaveChangesAsync();
        }
    }
}
