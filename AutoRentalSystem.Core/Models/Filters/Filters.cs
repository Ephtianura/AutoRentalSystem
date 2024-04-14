using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AutoRentalSystem.Core.Models.Filters
{
    public class UserFilter
    {
        public string? UserName { get; set; }
        public string? Email { get; set; }
        public UserStatus? Status { get; set; }
        public DateTime? RegisteredFrom { get; set; }
        public DateTime? RegisteredTo { get; set; }
        public UserRole? Role { get; set; }
    }
    public class CarFilter
    {
        public string? Brand { get; set; }
        public string? Model { get; set; }
        public int? YearFrom { get; set; }
        public int? YearTo { get; set; }
        public decimal? MinPricePerDay { get; set; }
        public decimal? MaxPricePerDay { get; set; }
        public string? FuelType { get; set; }
        public string? Transmission { get; set; }
        public int? MinSeats { get; set; }
        public int? MaxSeats { get; set; }
        public CarStatus? Status { get; set; }
    }

    public class BookingFilter
    {
        public int? UserId { get; set; }
        public int? CarId { get; set; }
        public BookingStatus? Status { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
    }

    public class PaymentFilter
    {
        public int? BookingId { get; set; }
        public PaymentStatus? Status { get; set; }
        public PaymentMethod? Method { get; set; }
        public DateTime? From { get; set; }
        public DateTime? To { get; set; }
    }
    public class FineFilter
    {
        public int? BookingId { get; set; }
        public FineStatus? Status { get; set; }
        public DateTime? IssuedFrom { get; set; }
        public DateTime? IssuedTo { get; set; }
        public int UserId { get; set; }
    }
    public class AuditLogFilter
    {
        public int? UserId { get; set; }
        public string? Action { get; set; }
        public DateTime? From { get; set; }
        public DateTime? To { get; set; }
    }
}
