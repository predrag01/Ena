using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Repository.IRepository
{
    public interface IUserRepository:IRepository<User>
    {
        Task<User> GetUserByEmail(string email);
        Task<User> GetUserByUsername(string username);
    }
}
