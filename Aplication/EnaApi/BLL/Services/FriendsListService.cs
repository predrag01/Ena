using BLL.Services.IServices;
using DAL.DataContext;
using DAL.Models;
using DAL.UnitOfWork;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL.DTOs;
using Microsoft.AspNetCore.Http.HttpResults;
using Azure.Core;

namespace BLL.Services
{
    public class FriendsListService : IFriendsListService
    {
        private readonly EnaContext _db;
        public IUnitOfWork _unitOfWork { get; set; }

        public FriendsListService(EnaContext db, IUnitOfWork unitOfWork)
        {
            this._db = db;
            this._unitOfWork = unitOfWork;
        }

        public async Task CreateFriendship(int requestId)
        {
            var request = await this._unitOfWork.Request.GetRequestById(requestId);
            if (request != null)
            {
                var friendsList = await this._unitOfWork.FriendsList.GetFriendsListByUserAndFriend(request.SenderId, request.RecipientId);
                if (friendsList == null)
                {
                    var friendslistCreated1 = new FriendsList(request.SenderId, request.RecipientId);
                    var friendslistCreated2 = new FriendsList(request.RecipientId, request.SenderId);
                    await _unitOfWork.FriendsList.Add(friendslistCreated1);
                    await _unitOfWork.FriendsList.Add(friendslistCreated2);
                    await _unitOfWork.Save();
                }

            }
        }

        public async Task<List<FriendsList>> GetAllFriendsForUser(int UserId)
        {
            List<FriendsList> friends = await this._unitOfWork.FriendsList.GetFriendsListByUser(UserId);
            return friends;
        }

        public async Task<bool> CheckIfFriends(string UserName, string FriendName)
        {
            var friend1 = await this._unitOfWork.User.GetUserByUsername(UserName);
            var friend2 = await this._unitOfWork.User.GetUserByUsername(FriendName);
            if (friend1 == null || friend2 == null)
            {
                return false;
            }
            var friendsList = await this._unitOfWork.FriendsList.GetFriendsListByUserAndFriend(friend1.Id, friend2.Id);
            if (friendsList == null)
                return false;
            return true;
        }

    }
}
