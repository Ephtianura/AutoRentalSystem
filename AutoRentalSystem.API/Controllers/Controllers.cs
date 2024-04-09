using AutoRentalSystem.Application.Contracts;
using AutoRentalSystem.Application.Contracts.DTO;
using AutoRentalSystem.Application.Services;
using AutoRentalSystem.Core.Contracts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AutoRentalSystem.API.Controllers
{
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IUserService _userService;


        

        public AuthController(IAuthService authService, IUserService userService)
        {
            _authService = authService;
            _userService = userService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterUserRequest request)
        {
            await _authService.Register(request.Email, request.UserName, request.Password, request.DateOfBirth);
           

            return Ok();
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginUserRequest request)
        {
            var token = await _authService.Login(request.Email, request.Password);

            HttpContext.Response.Cookies.Append("cookies", token);

            return Ok();
        }

        [Authorize]
        [HttpGet("Get")]
        public async Task<IActionResult> Get()
        {
            
            return Ok();
        }

        //[Authorize]
        //[HttpGet("profile")]
        //public async Task<IActionResult> GetProfile()
        //{
        //    var userId = int.Parse(User.FindFirst("sub")?.Value ?? "0");
        //    var user = await _userService.GetByIdAsync(userId);
        //    if (user == null)
        //        return NotFound();

        //    return Ok(user);
        //}

    }
}
