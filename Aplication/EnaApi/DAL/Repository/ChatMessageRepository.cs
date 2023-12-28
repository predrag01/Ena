using DAL.DataContext;
using DAL.Models;
using DAL.Repository.IRepository;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Repository
{
    public class ChatMessageRepository : Repository<ChatMessage>, IChatMessageRepository
    {
        private EnaContext _db;
        public ChatMessageRepository(EnaContext db) : base(db)
        {
            _db = db;

        }
        public async Task<List<ChatMessage>> GetChatMessagesBySenderAndRecipient(int SenderId, int RecipientId)
        {
            List<ChatMessage> messages = await _db.Messages.Where(x => x.SenderId == SenderId && x.RecipientId == RecipientId).ToListAsync();
            //var requests = await _db.Requests.Where(x => x.RecipientId == UserId).ToListAsync();
            return messages; 
        }
    }
}
