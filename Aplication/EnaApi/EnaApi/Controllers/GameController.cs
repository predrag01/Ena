using BLL.Services.IServices;
using BLL.Services;
using DAL.DataContext;
using Microsoft.AspNetCore.Mvc;
using DAL.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace EnaApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class GameController : ControllerBase
    {
        private readonly EnaContext _db;
        public IGameService _gameService { get; set; }

        public GameController(EnaContext db, IGameService gameService)
        {
            this._db = db;
            _gameService = gameService;
        }

        [Route("CreateGame")]
        [HttpPost]
        public async Task<IActionResult> CreateGame()
        {
            try
            {
                await this._gameService.CreateGame();
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}