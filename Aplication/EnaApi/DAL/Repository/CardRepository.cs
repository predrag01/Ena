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
    public class CardRepository : Repository<Card>, ICardRepository
    {
        private readonly EnaContext _db;
        public CardRepository(EnaContext db) : base(db)
        {
            _db = db;

        }
    }
}
