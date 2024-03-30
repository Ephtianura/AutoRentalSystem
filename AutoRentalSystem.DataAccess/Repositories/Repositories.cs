using AutoRentalSystem.Core.Contracts;
using AutoRentalSystem.Core.Models;
using AutoRentalSystem.Core.Models.Common;
using AutoRentalSystem.Core.Models.Filters;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace AutoRentalSystem.DataAccess.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly AutoRentalDbContext _db;

        public UserRepository(AutoRentalDbContext db) => _db = db;

        public async Task<User?> GetByIdAsync(int id) =>
            await _db.Users.FindAsync(id);

        public async Task<User?> GetByEmailAsync(string email) =>
            await _db.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Email == email) ?? throw new Exception();

        public async Task<PagedResult<User>> GetFilteredAsync(UserFilter filter, PagedRequest request)
        {
            IQueryable<User> query = _db.Users;

            if (!string.IsNullOrWhiteSpace(filter.UserName))
                query = query.Where(u => u.UserName.Contains(filter.UserName));
            if (!string.IsNullOrWhiteSpace(filter.Email))
                query = query.Where(u => u.Email.Contains(filter.Email));
            if (filter.Status.HasValue)
                query = query.Where(u => u.Status == filter.Status.Value);
            if (filter.Role.HasValue)
                query = query.Where(u => u.Role == filter.Role.Value);
            if (filter.RegisteredFrom.HasValue)
                query = query.Where(u => u.RegistrationDate >= filter.RegisteredFrom.Value);
            if (filter.RegisteredTo.HasValue)
                query = query.Where(u => u.RegistrationDate <= filter.RegisteredTo.Value);

            return await query.PaginateAsync(request);
        }

        public async Task AddAsync(User user)
        {

            await _db.Users.AddAsync(user);
            await _db.SaveChangesAsync();
        }

        public async Task UpdateAsync(User user)
        {
            _db.Users.Update(user);
            await _db.SaveChangesAsync();
        }

        public async Task BlockUserAsync(int id)
        {
            var user = await _db.Users.FindAsync(id);
            if (user != null)
            {
                user.Block();
                await _db.SaveChangesAsync();
            }
        }

        public async Task UnblockUserAsync(int id)
        {
            var user = await _db.Users.FindAsync(id);
            if (user != null)
            {
                user.Unblock();
                await _db.SaveChangesAsync();
            }
        }
    }

    public class CarRepository : ICarRepository
    {
        private readonly AutoRentalDbContext _db;
        public CarRepository(AutoRentalDbContext db) => _db = db;

        public async Task<Car?> GetByIdAsync(int id) =>
            await _db.Cars.FindAsync(id);

        public async Task<IEnumerable<Car>> GetAvailableCarsAsync(DateTime startDate, DateTime endDate)
        {
            var bookedCarIds = await _db.Bookings
                .Where(b => b.Status == BookingStatus.Approved || b.Status == BookingStatus.Pending)
                .Where(b => b.StartDate < endDate && b.EndDate > startDate)
                .Select(b => b.CarId)
                .ToListAsync();

            return await _db.Cars
                .Where(c => !bookedCarIds.Contains(c.Id) && c.Status == CarStatus.Available)
                .ToListAsync();
        }

        public async Task<PagedResult<Car>> GetFilteredAsync(CarFilter filter, PagedRequest request)
        {
            IQueryable<Car> query = _db.Cars;

            if (!string.IsNullOrWhiteSpace(filter.Brand))
                query = query.Where(c => c.Brand.Contains(filter.Brand));
            if (!string.IsNullOrWhiteSpace(filter.Model))
                query = query.Where(c => c.Model.Contains(filter.Model));
            if (filter.YearFrom.HasValue)
                query = query.Where(c => c.Year >= filter.YearFrom.Value);
            if (filter.YearTo.HasValue)
                query = query.Where(c => c.Year <= filter.YearTo.Value);
            if (filter.MinPricePerDay.HasValue)
                query = query.Where(c => c.PricePerDay >= filter.MinPricePerDay.Value);
            if (filter.MaxPricePerDay.HasValue)
                query = query.Where(c => c.PricePerDay <= filter.MaxPricePerDay.Value);
            if (!string.IsNullOrWhiteSpace(filter.FuelType))
                query = query.Where(c => c.FuelType.Contains(filter.FuelType));
            if (!string.IsNullOrWhiteSpace(filter.Transmission))
                query = query.Where(c => c.Transmission.Contains(filter.Transmission));
            if (filter.MinSeats.HasValue)
                query = query.Where(c => c.Seats >= filter.MinSeats.Value);
            if (filter.MaxSeats.HasValue)
                query = query.Where(c => c.Seats <= filter.MaxSeats.Value);
            if (filter.Status.HasValue)
                query = query.Where(c => c.Status == filter.Status.Value);

            return await query.PaginateAsync(request);
        }

        public async Task AddAsync(Car car)
        {
            await _db.Cars.AddAsync(car);
            await _db.SaveChangesAsync();
        }

        public async Task UpdateAsync(Car car)
        {
            _db.Cars.Update(car);
            await _db.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var car = await _db.Cars.FindAsync(id);
            if (car != null)
            {
                _db.Cars.Remove(car);
                await _db.SaveChangesAsync();
            }
        }
    }

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

    public class ContractRepository : IContractRepository
    {
        private readonly AutoRentalDbContext _db;
        public ContractRepository(AutoRentalDbContext db) => _db = db;

        public async Task<Contract?> GetByBookingIdAsync(int bookingId) =>
            await _db.Contracts.FirstOrDefaultAsync(c => c.BookingId == bookingId);

        public async Task AddAsync(Contract contract)
        {
            await _db.Contracts.AddAsync(contract);
            await _db.SaveChangesAsync();
        }

        public async Task UpdateAsync(Contract contract)
        {
            _db.Contracts.Update(contract);
            await _db.SaveChangesAsync();
        }
    }

    public class PaymentRepository : IPaymentRepository
    {
        private readonly AutoRentalDbContext _db;
        public PaymentRepository(AutoRentalDbContext db) => _db = db;

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

    // 🔹 Расширение для пагинации и сортировки
    public static class IQueryableExtensions
    {
        public static async Task<PagedResult<T>> PaginateAsync<T>(this IQueryable<T> query, PagedRequest request)
        {
            if (!string.IsNullOrWhiteSpace(request.SortBy))
            {
                var param = Expression.Parameter(typeof(T));
                var property = Expression.Property(param, request.SortBy);
                var lambda = Expression.Lambda(property, param);

                string method = request.SortDirection == SortDirection.Asc ? "OrderBy" : "OrderByDescending";
                var result = typeof(Queryable).GetMethods()
                    .First(m => m.Name == method && m.GetParameters().Length == 2)
                    .MakeGenericMethod(typeof(T), property.Type)
                    .Invoke(null, new object[] { query, lambda }) as IQueryable<T>;

                query = result!;
            }

            int total = await query.CountAsync();
            var items = await query
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync();

            return new PagedResult<T>
            {
                Items = items,
                TotalCount = total,
                PageNumber = request.PageNumber,
                PageSize = request.PageSize
            };
        }
    }
}
