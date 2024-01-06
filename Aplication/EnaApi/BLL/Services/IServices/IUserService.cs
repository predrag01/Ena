﻿using DAL.Models;
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
        Task<User> Register(UserDTO user);
        Task<string> Login(string email,  string password);
        Task UpdateProfile(UserUpdateDTO user);

        Task<User> GetUser(string jwt);
    }
}
