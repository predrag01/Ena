﻿using DAL.DataContext;
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
    public class TurnRepository : Repository<Turn>, ITurnRepository
    {
        private EnaContext _db;
        public TurnRepository(EnaContext db) : base(db)
        {
            _db = db;

        }
    }
}
