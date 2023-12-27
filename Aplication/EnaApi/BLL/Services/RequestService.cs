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

    }
}
