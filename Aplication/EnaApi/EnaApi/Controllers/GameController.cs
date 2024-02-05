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
    public class GameController : ControllerBase
    {
        private readonly EnaContext _db;
        public IGameService _gameService { get; set; }
        public IPlayerService _playerService { get; set; }

        public GameController(EnaContext db, IGameService gameService, IPlayerService playerService)
        {
            this._db = db;
            _gameService = gameService;
            _playerService = playerService;
        }

        [Route("CreateGame/{HostId}")]
        [HttpPost]
        public async Task<IActionResult> CreateGame(int HostId)
        {
            try
            {
                Game game = await this._gameService.CreateGame();

                await this._playerService.CreatePlayer(HostId, game.Id, true);

                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}