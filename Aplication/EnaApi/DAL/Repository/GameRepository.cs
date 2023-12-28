using DAL.DataContext;
using DAL.Models;
using DAL.Repository.IRepository;
using DAL.UnitOfWork;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Repository
{
    public class GameRepository : Repository<Game>, IGameRepository
    {
        private readonly EnaContext _db;
        public GameRepository(EnaContext db) : base(db)
        {
            this._db = db;
        }

    }
}
