using BLL.Services.IServices;
using DAL.DataContext;
using DAL.Models;
using DAL.UnitOfWork;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL.DTOs;
using BCrypt.Net;
using Microsoft.AspNetCore.Http.HttpResults;
using BLL.Helpers;

namespace BLL.Services
{
    public class UserService : IUserService
    {
        private readonly EnaContext _db;
        public UnitOfWork _unitOfWork { get; set; }

        private JwtService jwtService { get; set; }

        public IUserService _userService { get; set; }

        public UserService(EnaContext db)
        {
            this._db = db;
            this._unitOfWork= new UnitOfWork(db);
            jwtService = new JwtService();
        }

        public async Task<User> Register(UserDTO user)
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

                var userCreated = new User
                (
                    user.Name,
                    user.LastName, 
                    user.Username, 
                    user.Email, 
                    BCrypt.Net.BCrypt.HashPassword(user.Password), 
                    user.ProfilePicture, 
                    user.GamesWon, 
                    user.GamesLost
                );

                return await this._unitOfWork.User.Create(userCreated);
            }
            else
            {
                return null;
            }
        }

        public async Task<string> Login(string email,  string password)
        {
            var userFound = await this._unitOfWork.User.GetUserByEmail(email);

            if (userFound == null) throw new Exception("Invalid credential");

            if (!BCrypt.Net.BCrypt.Verify(password, userFound.Password)) throw new Exception("Invalid credential");

            var jwt = jwtService.Generate(userFound.Id);

            return jwt;
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

        public async Task<User> GetUser(string jwt)
        {
            var token = jwtService.Verify(jwt);

            int userId = int.Parse(token.Issuer);

            var user = await this._unitOfWork.User.GetUserById(userId);

            return user;
        }
    }
}
