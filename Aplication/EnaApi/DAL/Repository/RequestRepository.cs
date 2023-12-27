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
    public class RequestRepository : Repository<Request>, IRequestRepository
    {
        private EnaContext _db;
        public RequestRepository(EnaContext db) : base(db)
        {
            _db = db;

        }
        public async Task<Request> GetRequestBySenderAndRecipient(int SenderId, int RecipientId)
        {
            var request = await _db.Requests.Where(x => x.SenderId == SenderId && x.RecipientId == RecipientId).FirstOrDefaultAsync();
            return request; 
        }
    }
}