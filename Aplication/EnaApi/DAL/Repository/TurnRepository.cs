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
    internal class TurnRepository : Repository<Turn>, ITurnRepository
    {
        public TurnRepository(DbContext context) : base(context)
        {
        }
    }
}
