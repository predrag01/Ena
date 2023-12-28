using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL.DTOs;

namespace BLL.Services.IServices
{
    public interface IChatMessageService
    {
        Task SendMessage(ChatMessageDTO message);
        Task<List<ChatMessage>> GetAllMessagesForChat(int SenderId, int RecipientId);
    }
}
