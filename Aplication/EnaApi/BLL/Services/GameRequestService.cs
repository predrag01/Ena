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
        public IUnitOfWork _unitOfWork { get; set; }
        public IPlayerService _playerService { get; set; }

        public GameRequestService(EnaContext db, IUnitOfWork unitOfWork, IPlayerService playerService)
        {
            this._db = db;
            this._unitOfWork= unitOfWork;
            this._playerService = playerService;
        }

        public async Task<GameRequest> SendGameRequest(GameRequestDTO request)
        {
            if (request != null)
            {
                var requestFound = await this._unitOfWork.GameRequest.GetGameRequestBySenderAndRecipient(request.SenderId, request.RecipientId, request.GameId);
                if (requestFound != null)
                {
                    return null;
                }

                var requestCreated = new GameRequest(request.SenderId, request.RecipientId, request.GameId, false, request.Timestamp);
                await _unitOfWork.GameRequest.Add(requestCreated);
                await _unitOfWork.Save();

                return requestCreated;
            }
            else
            {
                return null;
            }
        }

        public async Task<Player> AcceptGameRequset(int gameRequestId)
        {
            var request = await this._unitOfWork.GameRequest.GetGameRequestById(gameRequestId);
            if (request == null)
            {
                throw new Exception("No game request");
            }

            Player player = await this._playerService.CreatePlayer(request.RecipientId, request.GameId);

            request.IsAccepted= true;
            this._unitOfWork.GameRequest.Update(request);
            await _unitOfWork.Save();

            return player;
        }

        public async Task DeclineGameRequset(int gameRequestId)
        {
            var request = await this._unitOfWork.GameRequest.GetGameRequestById(gameRequestId);
            if (request == null)
            {
                throw new Exception("No game request");
            }

            this._unitOfWork.GameRequest.Delete(request);
            await _unitOfWork.Save();
        }

        public async Task<List<GameRequest>> GetAllGameRequestByRecipientId(int recipientId)
        {
            try
            {
                return await _unitOfWork.GameRequest.GetAllGameRequestByRecipientId(recipientId);
            }
            catch
            {
                throw;
            }
        }
        public async Task DeleteGameRequests(int gameId)
        {
            try
            {
                var requests = await this._unitOfWork.GameRequest.GetGameRequests(gameId);
                if (requests!=null)
                {
                    foreach(GameRequest request in requests)
                    {
                        this._unitOfWork.GameRequest.Delete(request);
                    }
                    await _unitOfWork.Save();
                }
            }
            catch
            {
                throw;
            }
        }
    }
}
