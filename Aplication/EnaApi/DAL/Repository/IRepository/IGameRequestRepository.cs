using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Repository.IRepository
{
    public interface IGameRequestRepository:IRepository<GameRequest>
    {
        Task<GameRequest> GetGameRequestBySenderAndRecipient(int SenderId, int RecipientId, int gameId);
        Task<GameRequest> GetGameRequestById(int gameRequestId);
        Task<List<GameRequest>> GetAllGameRequestByRecipientId(int recipientId);
        Task<List<GameRequest>> GetGameRequests(int gameId);
    }
}
