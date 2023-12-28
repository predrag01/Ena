using BLL.Services.IServices;
using BLL.Services;
using DAL.DataContext;
using Microsoft.AspNetCore.Mvc;
using DAL.DTOs;
using DAL.Models;

namespace EnaApi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RequestController : ControllerBase
    {
        private readonly EnaContext _db;
        public IRequestService _requestService { get; set; }
        public IFriendsListService _friendsListService { get; set; }

        public RequestController(EnaContext db)
        {
            this._db = db;
            _requestService = new RequestService(db);
            _friendsListService = new FriendsListService(db);
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

        [Route("AcceptFriendRequest")]
        [HttpPost]
        public async Task<IActionResult> AcceptFriendRequest(int requestId)
        {
            try
            {
                await this._requestService.AcceptFriendRequest(requestId);
                await this._friendsListService.CreateFriendship(requestId);
                return Ok(requestId);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Route("DeclineFriendRequest")]
        [HttpPost]
        public async Task<IActionResult> DeclineFriendRequest(int requestId)
        {
            try
            {
                await this._requestService.DeclineFriendRequest(requestId);
                
                return Ok(requestId);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Route("GetAllFriendRequests")]
        [HttpGet]
        public async Task<IActionResult> GetAllFriendRequests(int UserId)
        {
            try
            {

                List<Request> requests = await this._requestService.GetAllFriendRequestsForUser(UserId);
                return Ok(requests)
                    ;
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}