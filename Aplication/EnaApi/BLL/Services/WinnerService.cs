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
    public class WinnerService : IWinnerService
    {
        private readonly EnaContext _db;
        public IUnitOfWork _unitOfWork { get; set; }
        public IUserService _userService { get; set; }

        public WinnerService(EnaContext db, IUserService userService, IUnitOfWork unitOfWork)
        {
            this._db = db;
            this._unitOfWork = unitOfWork;
            this._userService = userService;
        }

        public async Task CreateWinner(int playerId)
        {
            var player = await this._unitOfWork.Player.GetPlayerById(playerId);
            if(player == null)
            {
                throw new Exception("Player not exist!");
            }

            await this._userService.IncrementWins(player.UserId);

            var winner = new Winner(playerId);
            this._unitOfWork.Winner.Add(winner);
            await this._unitOfWork.Save();
        }
    }
}
