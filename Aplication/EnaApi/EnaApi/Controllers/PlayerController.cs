using BLL.Services.IServices;
using BLL.Services;
using DAL.DataContext;
using Microsoft.AspNetCore.Mvc;
using DAL.DTOs;

namespace EnaApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PlayerController : ControllerBase
    {
        private readonly EnaContext _db;
        public IPlayerService _playerService { get; set; }

        public PlayerController(EnaContext db)
        {
            this._db = db;
            _playerService = new PlayerService(db);
        }

        [Route("CreatePlayer")]
        [HttpPost]
        public async Task<IActionResult> CreatePlayer([FromBody] PlayerDTO player)
        {
            try
            {
                await this._playerService.CreatePlayer(player.UserId, player.GameId, player.Host);
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}