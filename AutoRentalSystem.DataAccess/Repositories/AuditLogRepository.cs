using AutoRentalSystem.Core.Contracts;
using AutoRentalSystem.Core.Models;
using AutoRentalSystem.Core.Models.Common;
using AutoRentalSystem.Core.Models.Filters;
using Microsoft.EntityFrameworkCore;

namespace AutoRentalSystem.DataAccess.Repositories
{
    public class AuditLogRepository : IAuditLogRepository
    {
        private readonly AutoRentalDbContext _db;
        public AuditLogRepository(AutoRentalDbContext db) => _db = db;

        public async Task AddAsync(AuditLog log)
        {
            await _db.AuditLogs.AddAsync(log);
            await _db.SaveChangesAsync();
        }

        public async Task<PagedResult<AuditLog>> GetFilteredAsync(AuditLogFilter filter, PagedRequest request)
        {
            IQueryable<AuditLog> query = _db.AuditLogs.Include(a => a.User);

            if (filter.UserId.HasValue)
                query = query.Where(a => a.UserId == filter.UserId.Value);
            if (!string.IsNullOrWhiteSpace(filter.Action))
                query = query.Where(a => a.Action.Contains(filter.Action));
            if (filter.From.HasValue)
                query = query.Where(a => a.Date >= filter.From.Value);
            if (filter.To.HasValue)
                query = query.Where(a => a.Date <= filter.To.Value);

            return await query.PaginateAsync(request);
        }
    }
}
