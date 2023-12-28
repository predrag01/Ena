﻿using BLL.Services.IServices;
using DAL.DataContext;
using DAL.Models;
using DAL.UnitOfWork;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL.DTOs;

namespace BLL.Services
{
    public class PlayerService : IPlayerService
    {
        private readonly EnaContext _db;
        public UnitOfWork _unitOfWork { get; set; }

        public PlayerService(EnaContext db)
        {
            this._db = db;
            this._unitOfWork= new UnitOfWork(db);
        }

        public async Task CreatePlayer(int userId, int gameId, bool host = false)
        {
            var player = await this._unitOfWork.Player.GetPlayerByIdInGameById(userId, gameId);
            if (player != null)
            {
                throw new Exception("Already player created!");
            }

            var playerCreated = new Player(userId, gameId, host);
            this._unitOfWork.Player.Add(playerCreated);
            await _unitOfWork.Save();
        }

    }
}