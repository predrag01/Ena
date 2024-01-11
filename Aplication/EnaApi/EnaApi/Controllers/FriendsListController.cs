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
    public class FriendsController : ControllerBase
    {
        private readonly EnaContext _db;
        public IRequestService _requestService { get; set; }
        public IFriendsListService _friendsListService { get; set; }
        public IUserService _userService { get; set; }

        public FriendsController(EnaContext db)
        {
            this._db = db;
            _requestService = new RequestService(db);
            _friendsListService = new FriendsListService(db);
            _userService = new UserService(db);
        }



        [Route("GetAllFriends/{UserId}")]
        [HttpGet]
        public async Task<IActionResult> GetAllFriends(int UserId)
        {
            try
            {
                List<FriendsList> friends = await this._friendsListService.GetAllFriendsForUser(UserId);

                return Ok(friends);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Route("CheckIfFriends/{UserName}/{FriendName}")]
        [HttpGet]
        public async Task<IActionResult> CheckIfFriends(string UserName, string FriendName)
        {
            try
            {
                bool friends = await this._friendsListService.CheckIfFriends(UserName, FriendName);

                return Ok(friends);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}