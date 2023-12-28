using BLL.Services.IServices;
using BLL.Services;
using DAL.DataContext;
using Microsoft.AspNetCore.Mvc;
using DAL.DTOs;

namespace EnaApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WinnerController : ControllerBase
    {
        private readonly EnaContext _db;
        public IWinnerService _winnerService { get; set; }

        public WinnerController(EnaContext db)
        {
            this._db = db;
            _winnerService = new WinnerService(db);
        }

        [Route("CreateWinner/{playerId}")]
        [HttpPost]
        public async Task<IActionResult> CreateWinner(int playerId)
        {
            try
            {
                await this._winnerService.CreateWinner(playerId);
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}