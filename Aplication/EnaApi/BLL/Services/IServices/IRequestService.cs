using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL.DTOs;

namespace BLL.Services.IServices
{
    public interface IRequestService
    {
        Task SendFriendRequest(RequestDTO request);
        Task AcceptFriendRequest(int requestId);
        Task DeclineFriendRequest(int requestId);

        Task<List<Request>> GetAllFriendRequestsForUser(int UserId);
    }
}
