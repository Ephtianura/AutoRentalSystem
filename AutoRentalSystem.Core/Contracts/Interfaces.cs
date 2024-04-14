using AutoRentalSystem.Core.Models;
using AutoRentalSystem.Core.Models.Common;
using AutoRentalSystem.Core.Models.Filters;

namespace AutoRentalSystem.Core.Contracts
{
    // 👤 Користувачі
    public interface IUserRepository
    {
        Task<User?> GetByIdAsync(int id);
        Task<User?> GetByEmailAsync(string email);
        Task<PagedResult<User>> GetFilteredAsync(UserFilter filter, PagedRequest request);
        Task AddAsync(User user);
        Task UpdateAsync(User user);
        Task BlockUserAsync(int id);
    }

    // 🚘 Автомобілі
    public interface ICarRepository
    {
        Task<Car?> GetByIdAsync(int id);
        Task<IEnumerable<Car>> GetAvailableCarsAsync(DateTime startDate, DateTime endDate);
        Task<PagedResult<Car>> GetFilteredAsync(CarFilter filter, PagedRequest request);
        Task AddAsync(Car car);
        Task UpdateAsync(Car car);
        Task DeleteAsync(int id);
    }

    // 📅 Бронювання
    public interface IBookingRepository
    {
        Task<IEnumerable<Booking>> GetByUserIdAsync(int userId);
        Task<Booking?> GetByIdAsync(int id);
        Task<PagedResult<Booking>> GetFilteredAsync(BookingFilter filter, PagedRequest request);
        Task AddAsync(Booking booking);
        Task UpdateAsync(Booking booking);
    }

    // 📜 Договіри
    public interface IContractRepository
    {
        Task<Contract?> GetByBookingIdAsync(int bookingId);
        Task AddAsync(Contract contract);
        Task UpdateAsync(Contract contract);
    }

    // 💳 Оплати
    public interface IPaymentRepository
    {
        Task<PagedResult<Payment>> GetFilteredAsync(PaymentFilter filter, PagedRequest request);
        Task AddAsync(Payment payment);
        Task<Payment?> GetByIdAsync(int id);
        Task UpdateAsync(Payment payment);
    }

    // ⚖️ Штрафи
    public interface IFineRepository
    {
        Task<PagedResult<Fine>> GetFilteredAsync(FineFilter filter, PagedRequest request);
        Task<Fine?> GetByIdAsync(int id);
        Task AddAsync(Fine fine);
        Task UpdateAsync(Fine fine);
    }

    // 📑 Логи
    public interface IAuditLogRepository
    {
        Task AddAsync(AuditLog log);
        Task<PagedResult<AuditLog>> GetFilteredAsync(AuditLogFilter filter, PagedRequest request);
    }
}
