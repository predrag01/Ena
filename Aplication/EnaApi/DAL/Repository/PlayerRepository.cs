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
    public class PlayerRepository : Repository<Player>, IPlayerRepository
    {
        private EnaContext _db;
        public PlayerRepository(EnaContext db) : base(db)
        {
            _db = db;
        }

        public async Task<Player> GetPlayerByIdInGameById(int playerId, int gameId)
        {
            return await this._db.Players.Where(x => x.ID == playerId && x.GameId == gameId).FirstOrDefaultAsync();
        }
        public async Task<Player> GetPlayerById(int playerId)
        {
            return await this._db.Players.Where(x => x.ID == playerId).FirstOrDefaultAsync();
        }
    }
}
