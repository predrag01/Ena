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

        public FriendsController(EnaContext db)
        {
            this._db = db;
            _requestService = new RequestService(db);
            _friendsListService = new FriendsListService(db);
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
    }
}