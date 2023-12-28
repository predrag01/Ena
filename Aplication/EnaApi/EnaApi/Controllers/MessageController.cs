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
    public class MessageController : ControllerBase
    {

        private readonly EnaContext _db;
        public IChatMessageService _messageService { get; set; }
        public IRequestService _requestService { get; set; }
        public IFriendsListService _friendsListService { get; set; }

        public MessageController(EnaContext db)
        {
            this._db = db;
            _messageService = new ChatMessageService(db);
            _requestService = new RequestService(db);
            _friendsListService = new FriendsListService(db);
        }

        [Route("SendMessage")]
        [HttpPost]
        public async Task<IActionResult> SendMessage([FromBody] ChatMessageDTO message)
        {
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
        public async Task<IActionResult> GetAllMessagesForChat(int SenderId, int RecipientId)
        {
            try
            {
                List<ChatMessage> messages1= await this._messageService.GetAllMessagesForChat(SenderId, RecipientId);
                List<ChatMessage> messages2 = await this._messageService.GetAllMessagesForChat(RecipientId, SenderId);
                messages1.AddRange(messages2);
                return Ok(messages1.OrderBy(m => m.Timestamp).ToList());
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

    }
}