using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL.DTOs;

namespace BLL.Services.IServices
{
    public interface IGameRequestService
    {
        Task<GameRequest> SendGameRequest(GameRequestDTO request);
        Task AcceptGameRequset(int gameRequestId);
        Task DeclineGameRequset(int gameRequestId);
        Task<List<GameRequest>> GetAllGameRequestByRecipientId(int recipientId);
    }
}
