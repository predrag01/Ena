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

namespace BLL.Services
{
    public class RequestService : IRequestService
    {
        private readonly EnaContext _db;
        public UnitOfWork _unitOfWork { get; set; }

        public RequestService(EnaContext db)
        {
            this._db = db;
            this._unitOfWork= new UnitOfWork(db);
        }

        public async Task SendFriendRequest(RequestDTO request)
        {
            if (request != null)
            {
                var requestFound = await this._unitOfWork.Request.GetRequestBySenderAndRecipient(request.SenderId, request.RecipientId);
                if (requestFound != null)
                {
                    throw new Exception("Friend request already sent.");
                }

                var requestCreated = new Request(request.SenderId, request.RecipientId, request.IsAccepted, request.Timestamp);
                await _unitOfWork.Request.Add(requestCreated);
                await _unitOfWork.Save();

            }
        }
        public async Task AcceptFriendRequest(int requestId)
        {
            var request = await this._unitOfWork.Request.GetRequestById(requestId);
            if (request == null)
            {
                throw new Exception("No such friend request");
            }
            request.IsAccepted = true;
            _unitOfWork.Request.Update(request);
            await _unitOfWork.Save();
        }

        public async Task DeclineFriendRequest(int requestId)
        {
            var request = await this._unitOfWork.Request.GetRequestById(requestId);
            if (request == null)
            {
                throw new Exception("No such friend request");
            }
            _unitOfWork.Request.Delete(request);
            await _unitOfWork.Save();
        }

        public async Task<List<Request>> GetAllFriendRequestsForUser(int UserId)
        {
            List<Request> friends = await this._unitOfWork.Request.GetFriendRequestsByUser(UserId);
            return friends;
        }
    }
}
