using BLL.Services;
using BLL.Services.IServices;
using DAL.DataContext;
using DAL.DTOs;
using DAL.Models;
using Microsoft.AspNetCore.Mvc;

namespace EnaApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly EnaContext _db;
        public IUserService _userService { get; set; }

        public UserController(EnaContext db)
        {
            this._db = db;
            _userService = new UserService(db);
        }

        [Route("Register")]
        [HttpPost]
        public async Task<IActionResult> Register([FromBody] UserDTO user)
        {
            try
            {
                await this._userService.Register(user);
                return Ok(user);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Route("Login/{email}/{password}")]
        [HttpGet]
        public async Task<IActionResult> Login(string email, string password)
        {
            try
            {
                var user = this._userService.Login(email, password);
                return Ok(user);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Route("UpdateProfile")]
        [HttpPut]
        public async Task<IActionResult> UpdateProfile([FromBody] UserUpdateDTO user)
        {
            try
            {
                await this._userService.UpdateProfile(user);
                return Ok(user);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }

    
}
