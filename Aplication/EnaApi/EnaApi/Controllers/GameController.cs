using BLL.Services.IServices;
using BLL.Services;
using DAL.DataContext;
using Microsoft.AspNetCore.Mvc;
using DAL.DTOs;

namespace EnaApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class GameController : ControllerBase
    {
        private readonly EnaContext _db;
        public IGameService _gameService { get; set; }

        public GameController(EnaContext db)
        {
            this._db = db;
            _gameService = new GameService(db);
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