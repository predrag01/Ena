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
    public class GameService : IGameService
    {
        private readonly EnaContext _db;
        public UnitOfWork _unitOfWork { get; set; }

        public GameService(EnaContext db)
        {
            this._db = db;
            this._unitOfWork= new UnitOfWork(db);
        }

        public async Task CreateGame()
        {
            var game = new Game();
            await this._unitOfWork.Game.Add(game);
            await this._unitOfWork.Save();

        }
    }
}
