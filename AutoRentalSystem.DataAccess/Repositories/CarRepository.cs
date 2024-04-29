using AutoRentalSystem.Core.Contracts;
using AutoRentalSystem.Core.Models;
using AutoRentalSystem.Core.Models.Common;
using AutoRentalSystem.Core.Models.Filters;
using Microsoft.EntityFrameworkCore;

namespace AutoRentalSystem.DataAccess.Repositories
{
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
            {
                var brandLower = filter.Brand.ToLower();
                query = query.Where(c => c.Brand.ToLower().Contains(brandLower));
            }

            if (!string.IsNullOrWhiteSpace(filter.Model))
            {
                var modelLower = filter.Model.ToLower();
                query = query.Where(c => c.Model.ToLower().Contains(modelLower));
            }

            if (filter.YearFrom.HasValue)
                query = query.Where(c => c.Year >= filter.YearFrom.Value);
            if (filter.YearTo.HasValue)
                query = query.Where(c => c.Year <= filter.YearTo.Value);
            if (filter.MinPricePerDay.HasValue)
                query = query.Where(c => c.PricePerDay >= filter.MinPricePerDay.Value);
            if (filter.MaxPricePerDay.HasValue)
                query = query.Where(c => c.PricePerDay <= filter.MaxPricePerDay.Value);

            if (!string.IsNullOrWhiteSpace(filter.FuelType))
            {
                var fuelLower = filter.FuelType.ToLower();
                query = query.Where(c => c.FuelType.ToLower().Contains(fuelLower));
            }

            if (!string.IsNullOrWhiteSpace(filter.Transmission))
            {
                var transLower = filter.Transmission.ToLower();
                query = query.Where(c => c.Transmission.ToLower().Contains(transLower));
            }

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
}
