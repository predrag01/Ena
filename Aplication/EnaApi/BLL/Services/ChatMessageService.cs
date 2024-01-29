using BLL.Services.IServices;
using DAL.DataContext;
using DAL.Models;
using DAL.UnitOfWork;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL.DTOs;
using Microsoft.AspNetCore.Http.HttpResults;
using Azure.Core;
using System.Reflection.Metadata;

namespace BLL.Services
{
    public class ChatMessageService : IChatMessageService
    {
        private readonly EnaContext _db;
        public IUnitOfWork _unitOfWork { get; set; }

        public ChatMessageService(EnaContext db, IUnitOfWork unitOfWork)
        {
            this._db = db;
            this._unitOfWork= unitOfWork;
        }

        public async Task SendMessage(ChatMessageDTO message)
        {
            if (message != null)
            {
                var messageCreated = new ChatMessage(message.SenderId, message.RecipientId, message.Content, message.Timestamp);
                await _unitOfWork.ChatMessage.Add(messageCreated);
                await _unitOfWork.Save();
            }
        }
        public async Task<List<ChatMessage>> GetAllMessagesForChat(int SenderId, int RecipientId)
        {
            List<ChatMessage> messages = await this._unitOfWork.ChatMessage.GetChatMessagesBySenderAndRecipient(SenderId, RecipientId);
            return messages;
            /*
             List<Request> friends = await this._unitOfWork.Request.GetFriendRequestsByUser(UserId);
            return friends;
             * */
        }
    }
}
