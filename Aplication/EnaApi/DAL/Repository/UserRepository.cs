using DAL.DataContext;
using DAL.Models;
using DAL.Repository.IRepository;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Repository
{
    public class UserRepository : Repository<User>, IUserRepository
    {
        //public UserRepository(DbContext context) : base(context)
        //{
        //}

        //public EnaContext? _db
        //{
        //    get { return context as EnaContext;}
        //}

        private EnaContext _db;
        public UserRepository(EnaContext db) : base(db)
        {
            _db = db;
        }

        public async Task<User> GetUserByEmail(string email)
        {
            var user = await this._db.Users.Where(x=>x.Email == email).FirstOrDefaultAsync();
            return user;
        }

        public async Task<User> GetUserByUsername(string username)    
        {
            var user = await this._db.Users.Where(x => x.Username == username).FirstOrDefaultAsync();
            return user;
        }

        public async Task<IQueryable<User>> GetUsersByUsername(string username, string ownerUsername)
        {
            var users = this._db.Users.Where(x => x.Username.Contains(username));

            users = users.Where(u => u.Username != ownerUsername);

            return users;
        }

        public async Task<User> UpdateUser(User user)
        {
            this._db.Users.Update(user);
            return user;
        }

        public async Task<User> GetUserById(int id)
        {
            var user = await _db.Users.Where(x => x.Id == id).FirstOrDefaultAsync();
            return user;
        }

        public async Task<User> Create(User user)
        {
            _db.Users.Add(user);
            user.Id = _db.SaveChanges();
            return user;
        }
    }
}
