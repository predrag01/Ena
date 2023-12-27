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
    public class GameRequestService : IGameRequestService
    {
        private readonly EnaContext _db;
        public UnitOfWork _unitOfWork { get; set; }

        public GameRequestService(EnaContext db)
        {
            this._db = db;
            this._unitOfWork= new UnitOfWork(db);
        }

        public async Task SendGameRequest(GameRequestDTO request)
        {
            if (request != null)
            {
                var requestFound = await this._unitOfWork.GameRequest.GetGameRequestBySenderAndRecipient(request.SenderId, request.RecipientId);
                if (requestFound != null)
                {
                    throw new Exception("Friend request already sent.");
                }

                var requestCreated = new GameRequest(request.SenderId, request.RecipientId, request.GameId, request.IsAccepted, request.Timestamp);
                await _unitOfWork.GameRequest.Add(requestCreated);
                await _unitOfWork.Save();
            }
        }

    }
}
