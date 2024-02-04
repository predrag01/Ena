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
    public class GameRequestController : ControllerBase
    {
        private readonly EnaContext _db;
        public IGameRequestService _gameRequestService { get; set; }

        public GameRequestController(EnaContext db, IGameRequestService gameRequestService)
        {
            this._db = db;
            _gameRequestService = gameRequestService;
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

        [Route("AcceptGameRequest/{requestId}")]
        [HttpPut]
        public async Task<IActionResult> AcceptGameRequest(int requestId)
        {
            try
            {
                await this._gameRequestService.AcceptGameRequset(requestId);
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Route("DeleteGameRequest/{requestId}")]
        [HttpDelete]
        public async Task<IActionResult> DeleteGameRequest(int requestId)
        {
            try
            {
                await this._gameRequestService.DeclineGameRequset(requestId);
                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Route("GetAllGameRequestByRecipientId/{recipientId}")]
        [HttpGet]
        public async Task<IActionResult> GetAllGameRequestByRecipientId(int recipientId)
        {
            try
            {
                var gameRequestList = await this._gameRequestService.GetAllGameRequestByRecipientId(recipientId);
                return Ok(gameRequestList);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}