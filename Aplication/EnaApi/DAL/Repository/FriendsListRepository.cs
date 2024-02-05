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
    public class FriendsListRepository : Repository<FriendsList>, IFriendsListRepository
    {
        private EnaContext _db;
        public FriendsListRepository(EnaContext db) : base(db)
        {
            _db = db;

        }
        public async Task<List<FriendsList>> GetFriendsListByUser(int UserId)
        {
            var friends = await _db.FriendsLists.Include(x=> x.Friend).Include(x=>x.User).Where(x => x.UserId == UserId).ToListAsync();
            return friends; 
        }
        public async Task<FriendsList> GetFriendsListByUserAndFriend(int UserId, int FriendId)
        {
            var friendship = await _db.FriendsLists.Where(x => x.UserId == UserId && x.FriendId == FriendId).FirstOrDefaultAsync();
            return friendship;
        }
    }
}
