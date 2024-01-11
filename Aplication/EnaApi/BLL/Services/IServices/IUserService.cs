using DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL.DTOs;

namespace BLL.Services.IServices
{
    public interface IUserService
    {
        Task<User> Register(UserRegisterDTO user);
        Task<string> Login(string email,  string password);
        Task UpdateProfile(UserUpdateDTO user);

        Task<User> GetUser(string jwt);
        Task<User> GetUserByUsername(string username);
        Task<IQueryable<User>> Search(string username, string ownerUsername);
    }
}
