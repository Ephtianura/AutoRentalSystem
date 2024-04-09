using AutoRentalSystem.Core.Contracts;
using AutoRentalSystem.Core.Models;
using Microsoft.EntityFrameworkCore;

namespace AutoRentalSystem.DataAccess.Repositories
{
    public class ContractRepository : IContractRepository
    {
        private readonly AutoRentalDbContext _db;
        public ContractRepository(AutoRentalDbContext db) => _db = db;

        public async Task<Contract?> GetByBookingIdAsync(int bookingId) =>
            await _db.Contracts.FirstOrDefaultAsync(c => c.BookingId == bookingId);

        public async Task AddAsync(Contract contract)
        {
            await _db.Contracts.AddAsync(contract);
            await _db.SaveChangesAsync();
        }

        public async Task UpdateAsync(Contract contract)
        {
            _db.Contracts.Update(contract);
            await _db.SaveChangesAsync();
        }
    }
}
