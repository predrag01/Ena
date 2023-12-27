using BLL.Services.IServices;
using BLL.Services;
using DAL.DataContext;
using Microsoft.AspNetCore.Mvc;
using DAL.DTOs;

namespace EnaApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RequestController : ControllerBase
    {
        private readonly EnaContext _db;
        public IRequestService _requestService { get; set; }

        public RequestController(EnaContext db)
        {
            this._db = db;
            _requestService = new RequestService(db);
        }

        [Route("SendFriendRequest")]
        [HttpPost]
        public async Task<IActionResult> SendFriendRequest([FromBody] RequestDTO request)
        {
            try
            {
                await this._requestService.SendFriendRequest(request);
                return Ok(request);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}