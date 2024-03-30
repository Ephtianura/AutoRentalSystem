using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AutoRentalSystem.Application.Contracts.DTO
{
    // DTO для регистрации
    public record RegisterUserRequest(
        [Required] string UserName,
        [Required] string Password,
        [Required] string Email,
        [Required] DateTime DateOfBirth);


    public record LoginUserRequest(
        [Required] string Email,
        [Required] string Password);

    // DTO для ответа при логине
    //public class AuthResponseDto
    //{
    //    public string Token { get; set; }
    //    public DateTime Expires { get; set; }
    //}

}
