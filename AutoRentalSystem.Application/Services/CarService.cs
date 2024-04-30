using AutoRentalSystem.API.Controllers;
using AutoRentalSystem.Application.Contracts;
using AutoRentalSystem.Core.Contracts;
using AutoRentalSystem.Core.Models;
using AutoRentalSystem.Core.Models.Common;
using AutoRentalSystem.Core.Models.Filters;
using Microsoft.AspNetCore.Http;

namespace AutoRentalSystem.Application.Services
{
    // ================== CARS ==================
    public class CarService : ICarService
    {
        private readonly ICarRepository _cars;
        private readonly IFileStorageService _fileStorage;

        public CarService(ICarRepository cars, IFileStorageService fileStorage)
        {
            _cars = cars;
            _fileStorage = fileStorage;
        }

        public async Task<PagedResult<Car>> GetAvailableCars(CarFilter filter, PagedRequest request) =>
            await _cars.GetFilteredAsync(filter, request);

        public async Task<Car?> GetById(int id) => await _cars.GetByIdAsync(id);

        public async Task Add(Car car, IFormFile? image = null)
        {
            if (image != null)
            {
                using var stream = image.OpenReadStream();
                car.ImageUrl = await _fileStorage.UploadFileAsync(stream, image.FileName);
            }

            await _cars.AddAsync(car);
        }

        public async Task Update(Car car, IFormFile? image = null)
        {
            if (image != null)
            {
                using var stream = image.OpenReadStream();
                car.ImageUrl = await _fileStorage.UploadFileAsync(stream, image.FileName);
            }

            await _cars.UpdateAsync(car);
        }

        public async Task UpdatePartialAsync(int id, CarPatchDto dto)
        {
            var car = await _cars.GetByIdAsync(id);
            if (car == null)
                throw new KeyNotFoundException();

            // обновляем только пришедшие значения
            if (dto.Brand != null)
                car.Brand = dto.Brand;

            if (dto.Model != null)
                car.Model = dto.Model;

            if (dto.Year.HasValue)
                car.Year = dto.Year.Value;

            if (dto.PlateNumber != null)
                car.PlateNumber = dto.PlateNumber;

            if (dto.VIN != null)
                car.VIN = dto.VIN;

            if (dto.Mileage.HasValue)
                car.Mileage = dto.Mileage.Value;

            if (dto.Status.HasValue)
                car.Status = dto.Status.Value;

            if (dto.PricePerDay.HasValue)
                car.PricePerDay = dto.PricePerDay.Value;

            if (dto.DepositAmount.HasValue)
                car.DepositAmount = dto.DepositAmount.Value;

            if (dto.FuelType != null)
                car.FuelType = dto.FuelType;

            if (dto.Transmission != null)
                car.Transmission = dto.Transmission;

            if (dto.Seats.HasValue)
                car.Seats = dto.Seats.Value;

            // обновление картинки
            if (dto.Image != null)
            {
                // если была старая картинка — можно удалить
                //if (!string.IsNullOrWhiteSpace(car.ImageUrl))
                    //await _fileStorage.DeleteFileAsync(car.ImageUrl);

                using var stream = dto.Image.OpenReadStream();
                car.ImageUrl = await _fileStorage.UploadFileAsync(stream, dto.Image.FileName);
            }

            await _cars.UpdateAsync(car);
        }




        public async Task Delete(int id) => await _cars.DeleteAsync(id);
    }

}
