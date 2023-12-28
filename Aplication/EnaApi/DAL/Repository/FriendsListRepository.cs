﻿using DAL.DataContext;
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
            var friends = await _db.FriendsLists.Where(x => x.UserId == UserId).ToListAsync();
            return friends;
            //var request = await _db.Requests.Where(x => x.SenderId == SenderId && x.RecipientId == RecipientId).FirstOrDefaultAsync();
            //return request; 
        }
        public async Task<FriendsList> GetFriendsListByUserAndFriend(int UserId, int FriendId)
        {
            var friendship = await _db.FriendsLists.Where(x => x.UserId == UserId && x.FriendId == FriendId).FirstOrDefaultAsync();
            return friendship;
            //var request = await _db.Requests.Where(x => x.Id == RequestId).FirstOrDefaultAsync();
            //return request;
        }
    }
}