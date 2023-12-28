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
        public async Task<GameRequest> GetGameRequestBySenderAndRecipient(int SenderId, int RecipientId)
        {
            var request = await _db.GameRequests.Where(x => x.SenderId == SenderId && x.RecipientId == RecipientId).FirstOrDefaultAsync();
            return request;
        }

        public async Task<GameRequest> GetGameRequestById(int gameRequestId)
        {
            var request = await _db.GameRequests.Where(x=> x.Id==gameRequestId).FirstOrDefaultAsync();
            return request;
        }
    }
}
