using BLL.Services.IServices;
using BLL.Services;
using DAL.DataContext;
using Microsoft.AspNetCore.Mvc;
using DAL.DTOs;

namespace EnaApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class GameRequestController : ControllerBase
    {
        private readonly EnaContext _db;
        public IGameRequestService _gameRequestService { get; set; }

        public GameRequestController(EnaContext db)
        {
            this._db = db;
            _gameRequestService = new GameRequestService(db);
        }

        [Route("SendGameRequest")]
        [HttpPost]
        public async Task<IActionResult> SendGameRequest([FromBody] GameRequestDTO request)
        {
            try
            {
                await this._gameRequestService.SendGameRequest(request);
                return Ok(request);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}