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
        Task Register(UserDTO user);
        IQueryable<User> Login(string email,  string password);
    }
}