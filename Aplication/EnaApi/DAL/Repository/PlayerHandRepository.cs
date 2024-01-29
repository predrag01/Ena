using DAL.DataContext;
using DAL.Models;
using DAL.Repository.IRepository;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Repository
{
    public class PlayerHandRepository : Repository<PlayerHand>, IPlayerHandRepository
    {
        private EnaContext _db;
        public PlayerHandRepository(EnaContext db) : base(db)
        {
            _db = db;

        }
    }
}
