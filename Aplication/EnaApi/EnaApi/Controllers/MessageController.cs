using BLL.Services.IServices;
using BLL.Services;
using DAL.DataContext;
using Microsoft.AspNetCore.Mvc;
using DAL.DTOs;
using DAL.Models;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Authorization;

namespace EnaApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("message")]
    public class MessageController : ControllerBase
    {

        private readonly EnaContext _db;
        public IChatMessageService _messageService { get; set; }
        public IRequestService _requestService { get; set; }
        public IFriendsListService _friendsListService { get; set; }
        public IUserService _userService { get; set; }
        protected readonly IHubContext<ChatHub> _chatHub;

        public MessageController(EnaContext db, IHubContext<ChatHub> chatHub, IChatMessageService messageService, IRequestService requestService, IFriendsListService friendsListService, IUserService userService)
        {
            this._db = db;
            _messageService = messageService;
            _requestService = requestService;
            _friendsListService = friendsListService;
            _userService = userService;
            _chatHub = chatHub;
        }

        [Route("Create")]
        [HttpPost]
        public async Task<IActionResult> Create(MessagePost messagePost)
        {
            await _chatHub.Clients.All.SendAsync("sendToReact", "The message '" +
            messagePost.Message + "' has been received");
            return Ok();
        }

        //[Route("SendMessage")]
        //[HttpPost]
        //public async Task<IActionResult> SendMessage([FromBody] ChatMessageDTO message)
        //{

        //    try
        //    {
        //        await this._messageService.SendMessage(message);
        //        return Ok(message);
        //    }
        //    catch (Exception e)
        //    {
        //        return BadRequest(e.Message);
        //    }
        //}

        [Route("SendMessage")]
        [HttpPost]
        public async Task<IActionResult> SendMessage(string senderUsername, string recipientUsername, string content)
        {
            var friend1 = await this._userService.GetUserByUsername(senderUsername);
            var friend2 = await this._userService.GetUserByUsername(recipientUsername);

            ChatMessageDTO message = new ChatMessageDTO(friend1.Id, friend2.Id, content, DateTime.Now);
            try
            {
                await this._messageService.SendMessage(message);
                return Ok(message);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Route("GetAllMessagesForChat")]
        [HttpGet]
        public async Task<IActionResult> GetAllMessagesForChat(string senderUsername, string recipientUsername)
        {
            var friend1 = await this._userService.GetUserByUsername(senderUsername);
            var friend2 = await this._userService.GetUserByUsername(recipientUsername);
            try
            {
                List<ChatMessage> messages1= await this._messageService.GetAllMessagesForChat(friend1.Id, friend2.Id);
                List<ChatMessage> messages2 = await this._messageService.GetAllMessagesForChat(friend2.Id, friend1.Id);
                messages1.AddRange(messages2);
                return Ok(messages1.OrderBy(m => m.Timestamp).ToList());
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

    }
    public class MessagePost
    {
        public virtual string Message { get; set; }
    }
}