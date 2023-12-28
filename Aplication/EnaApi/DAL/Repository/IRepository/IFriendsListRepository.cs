using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Repository.IRepository
{
    public interface IFriendsListRepository : IRepository<FriendsList>
    {
        Task<List<FriendsList>> GetFriendsListByUser(int UserId);
        Task<FriendsList> GetFriendsListByUserAndFriend(int UserId, int FriendId);
    }
}
