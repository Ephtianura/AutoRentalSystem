using AutoRentalSystem.Core.Contracts;
using AutoRentalSystem.Core.Models;
using AutoRentalSystem.Core.Models.Common;
using AutoRentalSystem.Core.Models.Filters;

namespace AutoRentalSystem.Application.Services
{
    // ================== CARS ==================
    public class CarService
    {
        private readonly ICarRepository _cars;

        public CarService(ICarRepository cars) => _cars = cars;

        public async Task<PagedResult<Car>> GetAvailableCars(CarFilter filter, PagedRequest request) =>
            await _cars.GetFilteredAsync(filter, request);

        public async Task<Car?> GetById(int id) => await _cars.GetByIdAsync(id);

        public async Task Add(Car car) => await _cars.AddAsync(car);

        public async Task Update(Car car) => await _cars.UpdateAsync(car);

        public async Task Delete(int id) => await _cars.DeleteAsync(id);
    }
}
