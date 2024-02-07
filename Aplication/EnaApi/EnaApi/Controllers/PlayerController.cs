using BLL.Services.IServices;
using BLL.Services;
using DAL.DataContext;
using Microsoft.AspNetCore.Mvc;
using DAL.DTOs;
using Microsoft.AspNetCore.Authorization;
using DAL.Models;

namespace EnaApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class PlayerController : ControllerBase
    {
        private readonly EnaContext _db;
        public IPlayerService _playerService { get; set; }

        public PlayerController(EnaContext db, IPlayerService playerService)
        {
            this._db = db;
            _playerService = playerService;
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
        [Route("GetAllPlayersByGameId/{gameId}")]
        [HttpGet]
        public async Task<IActionResult> GetAllPlayersByGameId(int gameId)
        {
            try
            {
                var players = await this._playerService.GetAllPlayersByGameId(gameId);
                return Ok(players);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}