using AutoRentalSystem.Core.Models;
using Microsoft.AspNetCore.Http;

namespace AutoRentalSystem.API.Controllers
{
    public class CarPatchDto
    {
        public string? Brand { get; set; }
        public string? Model { get; set; }
        public int? Year { get; set; }
        public string? PlateNumber { get; set; }
        public string? VIN { get; set; }
        public int? Mileage { get; set; }
        public CarStatus? Status { get; set; }
        public decimal? PricePerDay { get; set; }
        public decimal? DepositAmount { get; set; }
        public string? FuelType { get; set; }
        public string? Transmission { get; set; }
        public int? Seats { get; set; }

        public IFormFile? Image { get; set; } 
    }




}
