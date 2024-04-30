using AutoRentalSystem.Core.Models;
using AutoRentalSystem.Core.Models.Common;
using AutoRentalSystem.Core.Models.Filters;
using Microsoft.AspNetCore.Http;

namespace AutoRentalSystem.Application.Contracts
{
    public interface ICarService
    {
        Task Add(Car car, IFormFile? image = null);
        Task Update(Car car, IFormFile? image = null);
        Task Delete(int id);
        Task<PagedResult<Car>> GetAvailableCars(CarFilter filter, PagedRequest request);
        Task<Car?> GetById(int id);
    }
}