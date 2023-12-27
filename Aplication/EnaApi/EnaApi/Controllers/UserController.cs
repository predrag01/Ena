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
    }

    
}
