using AutoRentalSystem.Core.Models;
using AutoRentalSystem.Core.Models.Common;
using AutoRentalSystem.Core.Models.Filters;

namespace AutoRentalSystem.Application.Contracts
{
    public interface ICarService
    {
        Task Add(Car car);
        Task Delete(int id);
        Task<PagedResult<Car>> GetAvailableCars(CarFilter filter, PagedRequest request);
        Task<Car?> GetById(int id);
        Task Update(Car car);
    }
}