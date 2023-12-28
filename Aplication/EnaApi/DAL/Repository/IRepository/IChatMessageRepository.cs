using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Repository.IRepository
{
    public interface IChatMessageRepository : IRepository<ChatMessage>
    {
        Task<List<ChatMessage>> GetChatMessagesBySenderAndRecipient(int SenderId, int RecipientId);
        
    }
}
