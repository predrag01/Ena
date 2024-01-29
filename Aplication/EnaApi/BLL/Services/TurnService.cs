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
    public class TurnService : ITurnService
    {
        private readonly EnaContext _db;
        public IUnitOfWork _unitOfWork { get; set; }

        public TurnService(EnaContext db, IUnitOfWork unitOfWork)
        {
            this._db = db;
            this._unitOfWork = unitOfWork;
        }
        public async Task PlayMove(TurnDTO turn)
        {
            //var player = await this._unitOfWork.Player.GetPlayerById(turn.PlayerId);
            //if (player == null)
            //{
            //    throw new Exception("Player not exist!");
            //}

            var turnCreated = new Turn(turn.PlayerId, turn.NumberOfTurn, turn.CardDrawn, turn.CardThrown);
            this._unitOfWork.Turn.Add(turnCreated);
            await this._unitOfWork.Save();
        }
    }
}
