using AutoRentalSystem.Core.Models;
using Microsoft.EntityFrameworkCore;

namespace AutoRentalSystem.DataAccess
{
    public class AutoRentalDbContext : DbContext
    {
        public AutoRentalDbContext(DbContextOptions<AutoRentalDbContext> options)
            : base(options)
        { }

        public DbSet<User> Users => Set<User>();
        public DbSet<Car> Cars => Set<Car>();
        public DbSet<Booking> Bookings => Set<Booking>();
        public DbSet<Contract> Contracts => Set<Contract>();
        public DbSet<Payment> Payments => Set<Payment>();
        public DbSet<Fine> Fines => Set<Fine>();
        public DbSet<AuditLog> AuditLogs => Set<AuditLog>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(AutoRentalDbContext).Assembly);
        }
    }

}