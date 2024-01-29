using BLL.Services.IServices;
using BLL.Services;
using DAL.DataContext;
using Microsoft.AspNetCore.Mvc;
using DAL.DTOs;

namespace EnaApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TurnController : ControllerBase
    {
        private readonly EnaContext _db;
        public ITurnService _turnService { get; set; }

        public TurnController(EnaContext db, ITurnService turnService)
        {
            this._db = db;
            _turnService = turnService;
        }

        [Route("PlayMove")]
        [HttpPost]
        public async Task<IActionResult> PlayMove([FromBody] TurnDTO turn)
        {
            try
            {
                await this._turnService.PlayMove(turn);
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}