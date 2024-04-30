using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AutoRentalSystem.Core.Models
{
    // 🔐 Ролі користувачів
    public enum UserRole
    {
        User,
        Admin
    }

    public enum UserStatus
    {
        Active,
        Blocked
    }

    // 🚘 Статуси авто
    public enum CarStatus
    {
        Available,
        Booked,
        InRent,
        Maintenance
    }

    // 📅 Статуси бронювання
    public enum BookingStatus
    {
        Pending,
        Approved,
        Rejected,
        Cancelled,
        Finished
    }

    // 💳 Статус оплати
    public enum PaymentStatus
    {
        Pending,
        Completed,
        Failed
    }

    //Метод оплати
    public enum PaymentMethod
    {
        Card,
        Cash,
        BankTransfer
    }

    // ⚖️ Статус штрафа
    public enum FineStatus
    {
        Unpaid,
        Paid
    }

    // 👤 Користувач
    public class User
    {
        public int Id { get; private set; } // EF сам сгенерирует Id

        public string UserName { get; private set; } = null!;
        private string _email = null!;
        public string Email
        {
            get => _email;
            private set => _email = value.ToLower().Trim();
        }
        public string? Phone { get; private set;}
        public string PasswordHash { get; private set; } = null!;
        public UserRole Role { get; private set; } = UserRole.User;
        public string? DriverLicenseNumber { get; private set; }
        public DateTime DateOfBirth { get; private set; }
        public DateTime RegistrationDate { get; private set; } = DateTime.UtcNow;
        public UserStatus Status { get; private set; } = UserStatus.Active;

        // Навигационные свойства
        public ICollection<Booking> Bookings { get; private set; } = new List<Booking>();
        public ICollection<AuditLog> AuditLogs { get; private set; } = new List<AuditLog>();

        // EF Core конструктор
        private User() { }

        private User(string userName, string passwordHash, string email, DateTime dateOfBirth)
        {
            UserName = userName;
            PasswordHash = passwordHash;
            Email = email;
            DateOfBirth = dateOfBirth;
        }

        public static User Create(string userName, string passwordHash, string email, DateTime dateOfBirth)
        {
            return new User(userName, passwordHash, email, dateOfBirth);
        }

        
        public void UpdatePhone(string phone) => Phone = phone;

        public void UpdateEmail(string email) => Email = email;
        public void ChangePassword(string newHash) => PasswordHash = newHash;
        public void Block() => Status = UserStatus.Blocked;
        public void Unblock() => Status = UserStatus.Active;
    }


    // 🚘 Автомобіль
    public class Car
    {
        public int Id { get; set; }
        public string Brand { get; set; } = null!;
        public string Model { get; set; } = null!;
        public int Year { get; set; }
        public string PlateNumber { get; set; } = null!;
        public string VIN { get; set; } = null!;
        public int Mileage { get; set; }
        public CarStatus Status { get; set; } = CarStatus.Available;
        public decimal PricePerDay { get; set; }
        public decimal DepositAmount { get; set; }
        public string FuelType { get; set; } = null!;
        public string Transmission { get; set; } = null!;
        public int? Seats { get; set; }

        public string? ImageUrl { get; set; }

        // Навигація
        public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
    }

    // 📅 Бронювання
    public class Booking
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int CarId { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public BookingStatus Status { get; set; } = BookingStatus.Pending;
        public decimal TotalPrice { get; set; }

        // Навигація
        public User User { get; set; } = null!;
        public Car Car { get; set; } = null!;
        public Contract? Contract { get; set; }
        public ICollection<Payment> Payments { get; set; } = new List<Payment>();
        public ICollection<Fine> Fines { get; set; } = new List<Fine>();
    }

    // 📜 Договір
    public class Contract
    {
        public int Id { get; set; }
        public int BookingId { get; set; }
        public int UserId { get; set; }
        public int CarId { get; set; }
        public DateTime ContractDate { get; set; } = DateTime.UtcNow;
        public string Terms { get; set; } = null!;
        public bool IsSignedByUser { get; set; }
        public bool IsSignedByAdmin { get; set; }

        // Навигація
        public Booking Booking { get; set; } = null!;
        public User User { get; set; } = null!;
        public Car Car { get; set; } = null!;
    }

    // 💳 Оплата
    public class Payment
    {
        public int Id { get; set; }
        public int BookingId { get; set; }
        public decimal Amount { get; set; }
        public DateTime PaymentDate { get; set; } = DateTime.UtcNow;
        public PaymentMethod PaymentMethod { get; set; }
        public PaymentStatus Status { get; set; } = PaymentStatus.Pending;

        // Навигація
        public Booking Booking { get; set; } = null!;
    }

    // ⚖️ Штраф
    public class Fine
    {
        public int Id { get; set; }
        public int BookingId { get; set; }
        public string Description { get; set; } = null!;
        public decimal Amount { get; set; }
        public DateTime DateIssued { get; set; } = DateTime.UtcNow;
        public FineStatus Status { get; set; } = FineStatus.Unpaid;

        // Навигація
        public Booking Booking { get; set; } = null!;
    }

    // 📑 Журнал 
    public class AuditLog
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Action { get; set; } = null!;
        public DateTime Date { get; set; } = DateTime.UtcNow;
        public string Details { get; set; } = string.Empty;

        // Навигація
        public User User { get; set; } = null!;
    }
}

