using AutoRentalSystem.Application.Contracts;
using AutoRentalSystem.Core.Contracts;
using AutoRentalSystem.Core.Models;
using AutoRentalSystem.Core.Models.Common;
using AutoRentalSystem.Core.Models.Filters;
using AutoRentalSystem.Infrastructure.Auth;
using System.Diagnostics.Contracts;

namespace AutoRentalSystem.Application.Services
{
    //================== AUTH ==================
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _users;
        private readonly IPasswordHasher _passwordHasher;
        private readonly IJwtProvider _jwtProvider;

        public AuthService(IUserRepository users, IPasswordHasher passwordHasher, IJwtProvider jwtProvider)
        {
            _users = users;
            _passwordHasher = passwordHasher;
            _jwtProvider = jwtProvider;
        }

        public async Task Register(string userName, string password, string email, DateTime dateOfBirth)
        {
            var hashedPassword = _passwordHasher.Generate(password);

            var user = User.Create(userName, hashedPassword, email, dateOfBirth);

            await _users.AddAsync(user); 
        }

        public async Task<string> Login(string email, string password)
        {
            var user = await _users.GetByEmailAsync(email);
            var result = _passwordHasher.Verify(password, user.PasswordHash);
            if (result == false)
            {
                throw new Exception("Failed to login");
            }

            var token = _jwtProvider.GenerateToken(user);

            return token;            
        }  
    }

    //================== USERS ==================
    public class UserService : IUserService
    {
        private readonly IUserRepository _users;

        public UserService(IUserRepository users)
        {
            _users = users;
        }

        public async Task<PagedResult<User>> GetAll(UserFilter filter, PagedRequest request) =>
            await _users.GetFilteredAsync(filter, request);

        public async Task<User?> GetById(int id) => await _users.GetByIdAsync(id);

        public async Task UpdateProfile(User user) => await _users.UpdateAsync(user);

        public async Task Block(int id) => await _users.BlockUserAsync(id);

        public async Task Unblock(int id) => await _users.BlockUserAsync(id);
    }

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

    // ================== BOOKINGS ==================
    public class BookingService
    {
        private readonly IBookingRepository _bookings;
        private readonly ICarRepository _cars;

        public BookingService(IBookingRepository bookings, ICarRepository cars)
        {
            _bookings = bookings;
            _cars = cars;
        }

        public async Task<Booking> CreateBooking(Booking booking)
        {
            var car = await _cars.GetByIdAsync(booking.CarId);
            if (car == null || car.Status != CarStatus.Available)
                throw new InvalidOperationException("Car not available.");

            var available = await _cars.GetAvailableCarsAsync(booking.StartDate, booking.EndDate);
            if (!available.Any(c => c.Id == booking.CarId))
                throw new InvalidOperationException("Car already booked for this period.");

            booking.Status = BookingStatus.Pending;
            await _bookings.AddAsync(booking);
            return booking;
        }

        public async Task ApproveBooking(Booking booking)
        {
            booking.Status = BookingStatus.Approved;
            await _bookings.UpdateAsync(booking);
        }

        public async Task RejectBooking(Booking booking)
        {
            booking.Status = BookingStatus.Rejected;
            await _bookings.UpdateAsync(booking);
        }

        public async Task FinishBooking(Booking booking)
        {
            booking.Status = BookingStatus.Finished;
            var car = await _cars.GetByIdAsync(booking.CarId);
            if (car != null)
            {
                car.Status = CarStatus.Available;
                await _cars.UpdateAsync(car);
            }
            await _bookings.UpdateAsync(booking);
        }

        public async Task<PagedResult<Booking>> GetUserBookings(BookingFilter filter, PagedRequest request) =>
            await _bookings.GetFilteredAsync(filter, request);

        public async Task<PagedResult<Booking>> GetAllBookings(BookingFilter filter, PagedRequest request) =>
            await _bookings.GetFilteredAsync(filter, request);
    }

    // ================== CONTRACTS ==================
    public class ContractService
    {
        private readonly IContractRepository _contracts;

        public ContractService(IContractRepository contracts) => _contracts = contracts;

        public async Task<Core.Models.Contract> GenerateContract(Booking booking)
        {
            var contract = new Core.Models.Contract
            {
                BookingId = booking.Id,
                IsSignedByUser = false,
                IsSignedByAdmin = false
            };
            await _contracts.AddAsync(contract);
            return contract;
        }

        public async Task SignByUser(Core.Models.Contract contract)
        {
            contract.IsSignedByUser = true;
            await _contracts.UpdateAsync(contract);
        }

        public async Task SignByAdmin(Core.Models.Contract contract)
        {
            contract.IsSignedByAdmin = true;
            await _contracts.UpdateAsync(contract);
        }

        public async Task<Core.Models.Contract?> GetByBooking(int bookingId) =>
            await _contracts.GetByBookingIdAsync(bookingId);
    }

    // ================== PAYMENTS ==================
    public class PaymentService
    {
        private readonly IPaymentRepository _payments;
        private readonly IFineRepository _fines;

        public PaymentService(IPaymentRepository payments, IFineRepository fines)
        {
            _payments = payments;
            _fines = fines;
        }

        public async Task<Payment> PayBooking(Booking booking)
        {
            var fines = await _fines.GetFilteredAsync(
                new FineFilter { BookingId = booking.Id }, new PagedRequest { PageNumber = 1, PageSize = 100 });

            decimal total = (booking.EndDate - booking.StartDate).Days * booking.Car.PricePerDay
                            + fines.Items.Where(f => f.Status == FineStatus.Unpaid).Sum(f => f.Amount);

            var payment = new Payment
            {
                BookingId = booking.Id,
                Amount = total,
                Status = PaymentStatus.Pending,
                PaymentDate = DateTime.UtcNow
            };

            await _payments.AddAsync(payment);
            return payment;
        }

        public async Task MarkPaymentCompleted(Payment payment)
        {
            payment.Status = PaymentStatus.Completed;
            await _payments.UpdateAsync(payment);
        }

        public async Task<PagedResult<Payment>> GetPaymentsByBooking(PaymentFilter filter, PagedRequest request) =>
            await _payments.GetFilteredAsync(filter, request);
    }

    // ================== FINES ==================
    public class FineService
    {
        private readonly IFineRepository _fines;

        public FineService(IFineRepository fines) => _fines = fines;

        public async Task AddFine(Fine fine) => await _fines.AddAsync(fine);

        public async Task<PagedResult<Fine>> GetFinesByBooking(FineFilter filter, PagedRequest request) =>
            await _fines.GetFilteredAsync(filter, request);

        public async Task PayFine(Fine fine)
        {
            fine.Status = FineStatus.Paid;
            await _fines.UpdateAsync(fine);
        }
    }

    // ================== AUDIT LOGS ==================
    public class AuditLogService
    {
        private readonly IAuditLogRepository _logs;

        public AuditLogService(IAuditLogRepository logs) => _logs = logs;

        public async Task LogAction(int userId, string action, string details)
        {
            var log = new AuditLog
            {
                UserId = userId,
                Action = action,
                Details = details,
                Date = DateTime.UtcNow
            };
            await _logs.AddAsync(log);
        }
    }
}
