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
        public PlayerService _playerService { get; set; }

        public GameRequestService(EnaContext db)
        {
            this._db = db;
            this._unitOfWork= new UnitOfWork(db);
            this._playerService = new PlayerService(db);
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

                var requestCreated = new GameRequest(request.SenderId, request.RecipientId, request.GameId, false, request.Timestamp);
                await _unitOfWork.GameRequest.Add(requestCreated);
                await _unitOfWork.Save();
            }
        }

        public async Task AcceptGameRequset(int gameRequestId)
        {
            var request = await this._unitOfWork.GameRequest.GetGameRequestById(gameRequestId);
            if (request == null)
            {
                throw new Exception("No game request");
            }

            this._playerService.CreatePlayer(request.RecipientId, request.GameId);

            request.IsAccepted= true;
            this._unitOfWork.GameRequest.Update(request);
            await _unitOfWork.Save();
        }
    }
}
