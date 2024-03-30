using AutoRentalSystem.Core.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AutoRentalSystem.DataAccess.Configurations
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.ToTable("Users");
            builder.HasKey(u => u.Id);

            builder.Property(u => u.UserName).IsRequired().HasMaxLength(150);
            builder.Property(u => u.Email).IsRequired().HasMaxLength(150);
            builder.HasIndex(u => u.Email).IsUnique();
            builder.Property(u => u.Phone).HasMaxLength(20);
            builder.Property(u => u.PasswordHash).IsRequired();
            builder.Property(u => u.Role).IsRequired();
            builder.Property(u => u.DriverLicenseNumber).HasMaxLength(50);
            builder.Property(u => u.Status).IsRequired();

            builder.HasMany(u => u.Bookings)
                .WithOne(b => b.User)
                .HasForeignKey(b => b.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasMany(u => u.AuditLogs)
                .WithOne(a => a.User)
                .HasForeignKey(a => a.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }

    public class CarConfiguration : IEntityTypeConfiguration<Car>
    {
        public void Configure(EntityTypeBuilder<Car> builder)
        {
            builder.ToTable("Cars");
            builder.HasKey(c => c.Id);

            builder.Property(c => c.Brand).IsRequired().HasMaxLength(50);
            builder.Property(c => c.Model).IsRequired().HasMaxLength(50);
            builder.Property(c => c.PlateNumber).IsRequired().HasMaxLength(20);
            builder.HasIndex(c => c.PlateNumber).IsUnique();
            builder.Property(c => c.VIN).IsRequired().HasMaxLength(50);
            builder.HasIndex(c => c.VIN).IsUnique();
            builder.Property(c => c.Status).IsRequired();
            builder.Property(c => c.PricePerDay).HasColumnType("decimal(18,2)");
            builder.Property(c => c.DepositAmount).HasColumnType("decimal(18,2)");
            builder.Property(c => c.FuelType).HasMaxLength(20);
            builder.Property(c => c.Transmission).HasMaxLength(20);

            builder.HasMany(c => c.Bookings)
                .WithOne(b => b.Car)
                .HasForeignKey(b => b.CarId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }

    public class BookingConfiguration : IEntityTypeConfiguration<Booking>
    {
        public void Configure(EntityTypeBuilder<Booking> builder)
        {
            builder.ToTable("Bookings");
            builder.HasKey(b => b.Id);

            builder.Property(b => b.Status).IsRequired();
            builder.Property(b => b.TotalPrice).HasColumnType("decimal(18,2)");

            builder.HasOne(b => b.Contract)
                .WithOne(c => c.Booking)
                .HasForeignKey<Contract>(c => c.BookingId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(b => b.Payments)
                .WithOne(p => p.Booking)
                .HasForeignKey(p => p.BookingId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(b => b.Fines)
                .WithOne(f => f.Booking)
                .HasForeignKey(f => f.BookingId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }

    public class ContractConfiguration : IEntityTypeConfiguration<Contract>
    {
        public void Configure(EntityTypeBuilder<Contract> builder)
        {
            builder.ToTable("Contracts");
            builder.HasKey(c => c.Id);

            builder.Property(c => c.Terms).IsRequired();
            builder.Property(c => c.ContractDate).IsRequired();

            builder.HasOne(c => c.User)
                .WithMany()
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(c => c.Car)
                .WithMany()
                .HasForeignKey(c => c.CarId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }

    public class PaymentConfiguration : IEntityTypeConfiguration<Payment>
    {
        public void Configure(EntityTypeBuilder<Payment> builder)
        {
            builder.ToTable("Payments");
            builder.HasKey(p => p.Id);

            builder.Property(p => p.Amount).HasColumnType("decimal(18,2)").IsRequired();
            builder.Property(p => p.PaymentDate).IsRequired();
            builder.Property(p => p.Status).IsRequired();
            builder.Property(p => p.PaymentMethod).IsRequired();
        }
    }

    public class FineConfiguration : IEntityTypeConfiguration<Fine>
    {
        public void Configure(EntityTypeBuilder<Fine> builder)
        {
            builder.ToTable("Fines");
            builder.HasKey(f => f.Id);

            builder.Property(f => f.Description).IsRequired();
            builder.Property(f => f.Amount).HasColumnType("decimal(18,2)").IsRequired();
            builder.Property(f => f.DateIssued).IsRequired();
            builder.Property(f => f.Status).IsRequired();
        }
    }

    public class AuditLogConfiguration : IEntityTypeConfiguration<AuditLog>
    {
        public void Configure(EntityTypeBuilder<AuditLog> builder)
        {
            builder.ToTable("AuditLogs");
            builder.HasKey(a => a.Id);

            builder.Property(a => a.Action).IsRequired().HasMaxLength(50);
            builder.Property(a => a.Date).IsRequired();
            builder.Property(a => a.Details).HasMaxLength(500);
        }
    }

}
