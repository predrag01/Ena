using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL.DTOs;

namespace BLL.Services.IServices
{
    public interface IFriendsListService
    {
        Task CreateFriendship(int requestId);
        Task<List<FriendsList>> GetAllFriendsForUser(int UserId);
        Task<bool> CheckIfFriends(string UserName, string FriendName);
    }
}
