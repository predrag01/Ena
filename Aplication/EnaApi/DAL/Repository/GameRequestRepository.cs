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
    public class GameRequestRepository : Repository<GameRequest>, IGameRequestRepository
    {
        private EnaContext _db;
        public GameRequestRepository(EnaContext db) : base(db)
        {
            _db = db;

        }
        public async Task<GameRequest> GetGameRequestBySenderAndRecipient(int SenderId, int RecipientId, int gameId)
        {
            var request = await _db.GameRequests.Where(x => x.SenderId == SenderId && x.RecipientId == RecipientId && x.GameId == gameId).FirstOrDefaultAsync();
            return request;
        }

        public async Task<GameRequest> GetGameRequestById(int gameRequestId)
        {
            var request = await _db.GameRequests.Where(x=> x.Id==gameRequestId).FirstOrDefaultAsync();
            return request;
        }

        public async Task<List<GameRequest>> GetAllGameRequestByRecipientId(int recipientId)
        {
            //return await this._db.GameRequests.Include(x=> x.Sender).Where(x => x.RecipientId == recipientId && (DateTime.Now - x.Timestamp).TotalSeconds < 30).ToListAsync();
            var thresholdTime = DateTime.Now.AddSeconds(-30);

            return await this._db.GameRequests
                .Include(x => x.Sender)
                .Where(x => x.RecipientId == recipientId && x.Timestamp > thresholdTime)
                .ToListAsync();
        }
    }
}
