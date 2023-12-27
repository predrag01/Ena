﻿using BLL.Services.IServices;
using DAL.DataContext;
using DAL.Models;
using DAL.UnitOfWork;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL.DTOs;

namespace BLL.Services
{
    public class UserService : IUserService
    {
        private readonly EnaContext _db;
        public UnitOfWork _unitOfWork { get; set; }

        public UserService(EnaContext db)
        {
            this._db = db;
            this._unitOfWork= new UnitOfWork(db);
        }

        public async Task Register(UserDTO user)
        {
            if(user != null)
            {
                var userFound = await this._unitOfWork.User.GetUserByEmail(user.Email);
                if (userFound != null)
                {
                    throw new Exception("User with this email already exists.");
                }

                userFound = await this._unitOfWork.User.GetUserByUsername(user.Username);
                if (userFound != null)
                {
                    throw new Exception("User with this username already exists.");
                }

                var userCreated = new User(user.Name, user.LastName, user.Username, user.Email, user.Password, user.ProfilePicture, user.GamesWon, user.GamesLost);

                await this._unitOfWork.User.Add(userCreated);
                await this._unitOfWork.Save();
            }
        }

        public IQueryable<User> Login(string email,  string password)
        {
            try
            {
                return this._unitOfWork.User.Find(x => x.Email == email && x.Password == password);
            }
            catch
            {
                throw;
            }
        }

        public async Task UpdateProfile(UserUpdateDTO user)
        {
            if(user != null)
            {
                var userFound = await this._unitOfWork.User.GetUserById(user.Id);
                userFound.Name = user.Name;
                userFound.LastName= user.LastName;
                userFound.Username= user.Username;
                userFound.Email= user.Email;
                userFound.Password= user.Password;
                userFound.ProfilePicture= user.ProfilePicture;
                userFound.GamesLost = user.GamesLost;
                userFound.GamesWon= user.GamesWon;
                this._unitOfWork.User.Update(userFound);
                await this._unitOfWork.Save();
            }
        }

    }
}
