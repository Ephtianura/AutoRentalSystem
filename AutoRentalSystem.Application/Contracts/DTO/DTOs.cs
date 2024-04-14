using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AutoRentalSystem.Application.Contracts.DTO
{
    // 📁 File: AutoRentalSystem.Application.Contracts.DTO/Dtos.cs

    using System;

    namespace AutoRentalSystem.Application.Contracts.DTO
    {
        
        // 👤 ===== USERS =====

        public class UpdateUserRequest
        {
            public string? Email { get; set; }
            public string? Phone { get; set; }
            public string? DriverLicenseNumber { get; set; }
            public DateTime? DateOfBirth { get; set; }
        }

        public class UserResponse
        {
            public int Id { get; set; }
            public string UserName { get; set; } = null!;
            public string Email { get; set; } = null!;
            public string? Phone { get; set; }
            public string Role { get; set; } = null!;
            public string Status { get; set; } = null!;
            public DateTime RegistrationDate { get; set; }
        }

        // 🚘 ===== CARS =====

        public class CarCreateRequest
        {
            public string Brand { get; set; } = null!;
            public string Model { get; set; } = null!;
            public int Year { get; set; }
            public string PlateNumber { get; set; } = null!;
            public string VIN { get; set; } = null!;
            public int Mileage { get; set; }
            public decimal PricePerDay { get; set; }
            public decimal DepositAmount { get; set; }
            public string FuelType { get; set; } = null!;
            public string Transmission { get; set; } = null!;
            public int? Seats { get; set; }
        }

        public class CarResponse
        {
            public int Id { get; set; }
            public string Brand { get; set; } = null!;
            public string Model { get; set; } = null!;
            public int Year { get; set; }
            public string PlateNumber { get; set; } = null!;
            public string Status { get; set; } = null!;
            public decimal PricePerDay { get; set; }
            public decimal DepositAmount { get; set; }
        }

        // 📅 ===== BOOKINGS =====

        public class CreateBookingRequest
        {
            public int UserId { get; set; }
            public int CarId { get; set; }
            public DateTime StartDate { get; set; }
            public DateTime EndDate { get; set; }
        }

        public class BookingActionRequest
        {
            public int BookingId { get; set; }
        }

        public class BookingResponse
        {
            public int Id { get; set; }
            public int UserId { get; set; }
            public int CarId { get; set; }
            public string Status { get; set; } = null!;
            public decimal TotalPrice { get; set; }
            public DateTime StartDate { get; set; }
            public DateTime EndDate { get; set; }
        }

        // 💳 ===== PAYMENTS =====

        public class PayBookingRequest
        {
            public int BookingId { get; set; }
            public decimal Amount { get; set; }
            public string PaymentMethod { get; set; } = "Card";
        }

        public class CompletePaymentRequest
        {
            public int PaymentId { get; set; }
        }

        // ⚖️ ===== FINES =====

        public class AddFineRequest
        {
            public int BookingId { get; set; }
            public string Description { get; set; } = null!;
            public decimal Amount { get; set; }
        }

        public class PayFineRequest
        {
            public int FineId { get; set; }
        }

        // 📜 ===== CONTRACTS =====

        public class GenerateContractRequest
        {
            public int BookingId { get; set; }
        }

        public class SignContractRequest
        {
            public int ContractId { get; set; }
        }
    }

}
