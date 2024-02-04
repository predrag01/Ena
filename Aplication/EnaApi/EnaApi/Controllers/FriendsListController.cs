using BLL.Services.IServices;
using BLL.Services;
using DAL.DataContext;
using Microsoft.AspNetCore.Mvc;
using DAL.DTOs;
using DAL.Models;
using Microsoft.AspNetCore.Authorization;

namespace EnaApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class FriendsController : ControllerBase
    {
        private readonly EnaContext _db;
        public IRequestService _requestService { get; set; }
        public IFriendsListService _friendsListService { get; set; }
        public IUserService _userService { get; set; }

        public FriendsController(EnaContext db, IRequestService requestService, IFriendsListService friendsListService, IUserService userService)
        {
            this._db = db;
            _requestService = requestService;
            _friendsListService = friendsListService;
            _userService = userService;
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