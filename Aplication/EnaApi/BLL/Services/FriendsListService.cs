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
        public UnitOfWork _unitOfWork { get; set; }

        public FriendsListService(EnaContext db)
        {
            this._db = db;
            this._unitOfWork= new UnitOfWork(db);
        }

        public async Task CreateFriendship(int  requestId)
        {
            var request = await this._unitOfWork.Request.GetRequestById(requestId);
            if(request != null)
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

    }
}
