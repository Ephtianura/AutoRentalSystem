using AutoRentalSystem.Application.Contracts;
using AutoRentalSystem.Application.Contracts.DTO;
using AutoRentalSystem.Application.Services;
using AutoRentalSystem.Core.Contracts;
using AutoRentalSystem.Core.Models;
using AutoRentalSystem.Core.Models.Common;
using AutoRentalSystem.Core.Models.Filters;
using AutoRentalSystem.DataAccess.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.Reflection;
using System.Security.Claims;

namespace AutoRentalSystem.API.Controllers
{
    // ================= AUTH =================
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterUserRequest request)
        {
            try
            {
                await _authService.Register(request.UserName, request.Password, request.Email, request.DateOfBirth);
                return Ok();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginUserRequest request)
        {
            try
            {
                var token = await _authService.Login(request.Email, request.Password);
                HttpContext.Response.Cookies.Append("cookies", token);
                return Ok(new { message = "Logged in" });
            }
            catch (UnauthorizedAccessException ex)
            {
                return BadRequest(new { error = ex.Message }); 
            }
            catch (Exception)
            {
                return StatusCode(500, new { error = "Internal server error" });
            }
        }
        
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            // Удаляем cookie с токеном
            if (HttpContext.Request.Cookies.ContainsKey("cookies"))
            {
                HttpContext.Response.Cookies.Delete("cookies");
            }

            return Ok(new { message = "Logged out" });
        }



        [Authorize(Policy = "AdminPolicy")]
        [HttpGet("Get")]
        public async Task<IActionResult> Get()
        {
            return Ok("Admin endpoint works");
        }

    }

    // ================= USERS =================
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly UserService _users;

        public UsersController(UserService users)  // <- интерфейс
        {
            _users = users;
        }


        [Authorize(Policy = "AdminPolicy")]
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] UserFilter filter, [FromQuery] PagedRequest request)
                => Ok(await _users.GetAll(filter, request));

        [Authorize(Policy = "AdminPolicy")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var user = await _users.GetById(id);
            return user == null ? NotFound() : Ok(user);
        }

        [Authorize(Policy = "UserPolicy")]
        [HttpGet("me")]
        public async Task<IActionResult> GetMe()
        {
            // Извлекаем userId из токена (Claim)
            var userIdClaim = User.FindFirst("userId")?.Value;

            if (string.IsNullOrEmpty(userIdClaim))
                return Unauthorized("Не удалось определить пользователя (нет userId в токене).");

            if (!int.TryParse(userIdClaim, out int userId))
                return BadRequest("Некорректный идентификатор пользователя.");

            var user = await _users.GetById(userId);
            return user == null ? NotFound() : Ok(user);
        }

        [Authorize(Policy = "AdminPolicy")]
        [HttpPut("{id}/update-role")]
        public async Task<IActionResult> UpdateRole(int id, [FromBody] UpdateUserDto dto)
        {
            var user = await _users.GetById(id);
            if (user == null)
                return NotFound();

            if (dto.Role.HasValue)
            {
                typeof(User)
                    .GetProperty("Role", BindingFlags.Instance | BindingFlags.NonPublic | BindingFlags.Public)!
                    .SetValue(user, dto.Role.Value);
            }

            await _users.UpdateProfile(user);

            return Ok(new { user.Id, user.UserName, user.Role, user.Status });
        }
        public class UpdateUserDto
        {
            public UserRole? Role { get; set; }
        }


        [Authorize(Policy = "AdminPolicy")]
        [HttpPut("{id}/block")]
        public async Task<IActionResult> Block(int id)
        {
            var user = await _users.GetById(id);
            if (user == null) return NotFound();
            await _users.Block(id);
            return NoContent();

        }

        [Authorize(Policy = "AdminPolicy")]
        [HttpPut("{id}/unblock")]
        public async Task<IActionResult> Unblock(int id)
        {
            var user = await _users.GetById(id);
            if (user == null) return NotFound();
            await _users.Unblock(id);
            return NoContent();

        }
    }

    // ================= CARS =================
    [ApiController]
    [Route("api/[controller]")]
    public class CarsController : ControllerBase
    {
        private readonly CarService _cars;
        public CarsController(CarService cars) => _cars = cars;

        [Authorize(Policy = "UserPolicy")]
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] CarFilter filter, [FromQuery] PagedRequest request)
                => Ok(await _cars.GetAvailableCars(filter, request));

        [Authorize(Policy = "UserPolicy")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var car = await _cars.GetById(id);
            return car == null ? NotFound() : Ok(car);
        }

        [Authorize(Policy = "AdminPolicy")]
        [HttpPost]
        public async Task<IActionResult> Add([FromBody] Car car)
        {
            try
            {
                await _cars.Add(car);
                return CreatedAtAction(nameof(GetById), new { id = car.Id }, car);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }


        [Authorize(Policy = "AdminPolicy")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Car car)
        {
            if (id != car.Id) return BadRequest("Не існує авто з таким Id");
            await _cars.Update(car);
            return NoContent();
        }

        [Authorize(Policy = "AdminPolicy")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            await _cars.Delete(id);
            return NoContent();
        }
    }

    // ================= BOOKINGS =================
    [ApiController]
    [Route("api/[controller]")]
    public class BookingsController : ControllerBase
    {
        private readonly BookingService _bookings;
        private readonly IUserService _users;

        public BookingsController(BookingService bookings, IUserService users)
        {
            _bookings = bookings ?? throw new ArgumentNullException(nameof(bookings));
            _users = users ?? throw new ArgumentNullException(nameof(users));
        }
        public class CreateBookingDto
        {
            [Required]
            public int CarId { get; set; }

            [Required]
            public DateTime StartDate { get; set; }

            [Required]
            public DateTime EndDate { get; set; }

            [Required]
            public decimal TotalPrice { get; set; }
        }


        // Клиент создаёт бронь
        [Authorize(Policy = "UserPolicy")]
        [HttpPost("Create")]
        public async Task<IActionResult> Create([FromBody] CreateBookingDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = int.Parse(User.FindFirst("userId")?.Value ?? "0");
            var user = await _users.GetById(userId);

            if (user == null)
                return NotFound("User not found.");

            if (user.Status == UserStatus.Blocked)
                return StatusCode(StatusCodes.Status403Forbidden,
                    new { message = "Заблокований користувач не може створювати бронювання." });


            var booking = new Booking
            {
                CarId = dto.CarId,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                TotalPrice = dto.TotalPrice
            };

            var result = await _bookings.CreateBooking(userId, booking);

            return Ok(MapToDto(result));
        }



        // Клиент видит свои бронирования
        [Authorize(Policy = "UserPolicy")]
        [HttpGet("my-bookings")]
        public async Task<IActionResult> GetMyBookings()
        {
            var userId = int.Parse(User.FindFirst("userId")?.Value ?? "0");
            var bookings = await _bookings.GetByUserId(userId);

            var bookingsDto = bookings.Items.Select(MapToDto).ToList();

            return Ok(new
            {
                bookings.PageNumber,
                bookings.PageSize,
                bookings.TotalCount,
                Items = bookingsDto
            });
        }

        // Админ видит все бронирования
        [Authorize(Policy = "AdminPolicy")]
        [HttpGet("all")]
        public async Task<IActionResult> GetAllBookings([FromQuery] PagedRequest request)
        {
            var bookings = await _bookings.GetAll(null, request);

            var bookingsDto = bookings.Items.Select(MapToDto).ToList();

            return Ok(new
            {
                bookings.PageNumber,
                bookings.PageSize,
                bookings.TotalCount,
                Items = bookingsDto
            });
        }

        // Админ подтверждает бронь
        [Authorize(Policy = "AdminPolicy")]
        [HttpPost("{id}/approve")]
        public async Task<IActionResult> Approve(int id)
        {
            await _bookings.ApproveBooking(id);
            return NoContent();
        }

        // Админ отклоняет бронь
        [Authorize(Policy = "AdminPolicy")]
        [HttpPost("{id}/reject")]
        public async Task<IActionResult> Reject(int id)
        {
            await _bookings.RejectBooking(id);
            return NoContent();
        }

        // Админ завершает аренду
        [Authorize(Policy = "AdminPolicy")]
        [HttpPost("{id}/finish")]
        public async Task<IActionResult> Finish(int id)
        {
            await _bookings.FinishBooking(id);
            return NoContent();
        }

        // ======================
        // Приватный метод маппинга Booking -> BookingDto
        private BookingDto MapToDto(Booking booking)
        {
            return new BookingDto
            {
                Id = booking.Id,
                Status = booking.Status,
                StartDate = booking.StartDate,
                EndDate = booking.EndDate,
                TotalPrice = booking.TotalPrice,
                Car = new CarDto
                {
                    Id = booking.Car.Id,
                    Brand = booking.Car.Brand,
                    Model = booking.Car.Model,
                    PlateNumber = booking.Car.PlateNumber
                },
                Contract = booking.Contract == null ? null : new ContractDto
                {
                    Id = booking.Contract.Id,
                    ContractDate = booking.Contract.ContractDate,
                    IsSignedByUser = booking.Contract.IsSignedByUser,
                    IsSignedByAdmin = booking.Contract.IsSignedByAdmin
                },
                User = booking.User == null ? null : new UserDto   
                {
                    Id = booking.User.Id,
                    UserName = booking.User.UserName,
                    Email = booking.User.Email
                }
            };
        }
    }

    // ======= DTOs =======
    public class BookingDto
    {
        public int Id { get; set; }
        public BookingStatus Status { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal TotalPrice { get; set; }
        public CarDto Car { get; set; } = null!;
        public ContractDto? Contract { get; set; }
        public UserDto? User { get; set; } 
    }
    public class UserDto
    {
        public int Id { get; set; }
        public string UserName { get; set; } = null!;
        public string Email { get; set; } = null!;
    }


    public class CarDto
    {
        public int Id { get; set; }
        public string Brand { get; set; } = null!;
        public string Model { get; set; } = null!;
        public string PlateNumber { get; set; } = null!;
    }

    public class ContractDto
    {
        public int Id { get; set; }
        public DateTime ContractDate { get; set; }
        public bool IsSignedByUser { get; set; }
        public bool IsSignedByAdmin { get; set; }
    }




    // ================= PAYMENTS =================
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentsController : ControllerBase
    {
        private readonly PaymentService _payments;

        public PaymentsController(PaymentService payments) => _payments = payments;

        // Клиент оплачивает бронь
        [Authorize(Policy = "UserPolicy")]
        [HttpPost("booking/{bookingId}")]
        public async Task<IActionResult> PayBooking(int bookingId)
        {
            var userId = int.Parse(User.FindFirst("userId")?.Value ?? "0");
            var payment = await _payments.PayBooking(userId, bookingId);
            return Ok(payment);
        }

        // Админ подтверждает оплату (наличные)
        [Authorize(Policy = "AdminPolicy")]
        [HttpPost("{id}/complete")]
        public async Task<IActionResult> Complete(int id)
        {
            await _payments.MarkPaymentCompleted(id);
            return NoContent();
        }
    }

    // ================= FINES =================
    [ApiController]
    [Route("api/[controller]")]
    public class FinesController : ControllerBase
    {
        private readonly FineService _fines;

        public FinesController(FineService fines) => _fines = fines;
        public class AddFineDto
        {
            public int BookingId { get; set; }
            public string Description { get; set; } = null!;
            public decimal Amount { get; set; }
        }

        // Админ добавляет штраф
        [Authorize(Policy = "AdminPolicy")]
        [HttpPost]
        public async Task<IActionResult> Add([FromBody] AddFineDto dto)
        {
            // Создаём объект Fine на сервере
            var fine = new Fine
            {
                BookingId = dto.BookingId,
                Description = dto.Description,
                Amount = dto.Amount,
                DateIssued = DateTime.UtcNow,
                Status = FineStatus.Unpaid
            };

            await _fines.AddFine(fine);
            return Ok(fine);
        }

        // Клиент оплачивает свой штраф
        [Authorize(Policy = "UserPolicy")]
        [HttpGet("my-fines")]
        public async Task<IActionResult> GetMyFines()
        {
            var userId = int.Parse(User.FindFirst("userId")?.Value ?? "0");
            var finesPaged = await _fines.GetByUserId(userId);

            // Маппим только Items
            var finesDto = finesPaged.Items.Select(f => new FineDto
            {
                Id = f.Id,
                Amount = f.Amount,
                Description = f.Description,
                DateIssued = f.DateIssued,
                Status = f.Status,
                BookingId = f.BookingId,
                CarId = f.Booking.CarId
            }).ToList();

            // Возвращаем новый PagedResult с DTO
            var result = new PagedResult<FineDto>
            {
                Items = finesDto,
                TotalCount = finesPaged.TotalCount
            };

            return Ok(result);

        }
        // DTO для штрафа
        public class FineDto
        {
            public int Id { get; set; }
            public decimal Amount { get; set; }
            public string Description { get; set; } = null!;
            public DateTime DateIssued { get; set; }
            public FineStatus Status { get; set; }
            public int BookingId { get; set; }
            public int CarId { get; set; } // можно добавить для удобства
        }


        [Authorize(Policy = "UserPolicy")]
        [HttpPost("{id}/pay")]
        public async Task<IActionResult> Pay(int id)
        {
            var userIdClaim = User.FindFirst("userId")?.Value;
            if (!int.TryParse(userIdClaim, out var userId))
                return BadRequest("User not found.");

            try
            {
                await _fines.PayFine(userId, id); // проверка принадлежности штрафа
                return NoContent();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message); // штраф не найден
            }
            catch (UnauthorizedAccessException ex)
            {
                return BadRequest(ex.Message); // пользователь не владелец штрафа
            }
        }

    }




    // ================= CONTRACTS =================
    [ApiController]
    [Route("api/[controller]")]
    public class ContractsController : ControllerBase
    {
        private readonly ContractService _contracts;

        public ContractsController(ContractService contracts) => _contracts = contracts;

        [HttpPost("generate")]
        public async Task<IActionResult> Generate([FromBody] Booking booking)
        {
            if (booking == null) return BadRequest("Booking is required.");

            var contract = await _contracts.GenerateContract(booking);
            return Ok(contract);
        }

        [Authorize(Policy = "UserPolicy")]
        [HttpPost("{bookingId}/sign-user")]
        public async Task<IActionResult> SignUser(int bookingId)
        {
            var userId = int.Parse(User.FindFirst("userId")?.Value ?? "0");

            var contract = await _contracts.GetByBooking(bookingId);
            if (contract == null) return NotFound("Contract not found.");

            if (contract.Booking.UserId != userId) return Forbid("You cannot sign this contract.");

            await _contracts.SignByUser(contract);
            return NoContent();
        }

        [Authorize(Policy = "AdminPolicy")]
        [HttpPost("{bookingId}/sign-admin")]
        public async Task<IActionResult> SignAdmin(int bookingId)
        {
            var contract = await _contracts.GetByBooking(bookingId);
            if (contract == null) return NotFound("Contract not found.");

            await _contracts.SignByAdmin(contract);
            return NoContent();
        }

        [Authorize(Policy = "UserPolicy")]
        [HttpGet("{bookingId}")]
        public async Task<IActionResult> GetContract(int bookingId)
        {
            var userId = int.Parse(User.FindFirst("userId")?.Value ?? "0");

            var contract = await _contracts.GetByBooking(bookingId);
            if (contract == null) return NotFound("Contract not found.");

            // Проверка прав: пользователь видит только свои контракты
            if (contract.Booking.UserId != userId) return Forbid();

            return Ok(contract);
        }

        [Authorize(Policy = "AdminPolicy")]
        [HttpGet("admin/{bookingId}")]
        public async Task<IActionResult> GetContractAdmin(int bookingId)
        {
            var contract = await _contracts.GetByBooking(bookingId);
            if (contract == null) return NotFound("Contract not found.");

            return Ok(contract); // админ видит любой контракт
        }

    }



}
