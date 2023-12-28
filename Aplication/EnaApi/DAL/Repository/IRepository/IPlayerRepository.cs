using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Repository.IRepository
{
    public interface IPlayerRepository : IRepository<Player>
    {
        Task<Player> GetPlayerByIdInGameById(int playerId, int gameId);
    }
}
