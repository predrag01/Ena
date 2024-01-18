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
        public IUserService _userService { get; set; }

        public RequestController(EnaContext db)
        {
            this._db = db;
            _requestService = new RequestService(db);
            _friendsListService = new FriendsListService(db);
            _userService=new UserService(db);
        }

        //[Route("SendFriendRequest")]
        //[HttpPost]
        //public async Task<IActionResult> SendFriendRequest([FromBody] RequestDTO request)
        //{
        //    try
        //    {
        //        await this._requestService.SendFriendRequest(request);
        //        return Ok(request);
        //    }
        //    catch (Exception e)
        //    {
        //        return BadRequest(e.Message);
        //    }
        //}

        [Route("SendFriendRequest/{username}/{friendUsername}")]
        [HttpPost]
        public async Task<IActionResult> SendFriendRequest(string username, string friendUsername)
        {
            try
            {
                var friend1 = await this._userService.GetUserByUsername(username);
                var friend2 = await this._userService.GetUserByUsername(friendUsername);
                if (friend1 != null && friend2 != null)
                {

                    RequestDTO request = new RequestDTO
                    {
                        SenderId = friend1.Id,
                        RecipientId = friend2.Id,
                        IsAccepted = false,
                        Timestamp = DateTime.Now
                    };
                    await this._requestService.SendFriendRequest(request);
                    return Ok(request);
                }
                else
                    return BadRequest();
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
        public async Task<IActionResult> GetAllFriendRequests(string username)
        {
            var friend1 = await this._userService.GetUserByUsername(username);
            try
            {

                List<Request> requests = await this._requestService.GetAllFriendRequestsForUser(friend1.Id);
                foreach(Request req in requests)
                {
                    req.Sender = await this._userService.GetUserByUserId(req.SenderId);
                }
                return Ok(requests);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Route("CheckIfFriendRequestSent/{UserName}/{FriendName}")]
        [HttpGet]
        public async Task<IActionResult> CheckIfFriendRequestSent(string UserName, string FriendName)
        {
            try
            {
                bool friends = await this._requestService.CheckIfFriendRequestSent(UserName, FriendName);

                return Ok(friends);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}