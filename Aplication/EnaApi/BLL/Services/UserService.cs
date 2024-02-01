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
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;
using System.IO;

namespace BLL.Services
{
    public class UserService : IUserService
    {
        private readonly EnaContext _db;
        public IUnitOfWork _unitOfWork { get; set; }

        private JwtService jwtService { get; set; }

        public IUserService _userService { get; set; }

        public UserService(EnaContext db, IUnitOfWork unitOfWork)
        {
            this._db = db;
            this._unitOfWork = unitOfWork;
            jwtService = new JwtService();
        }

        public async Task<User> Register(UserRegisterDTO user)
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

                if (user.Password != user.RepeatedPassword)
                {
                    throw new Exception("Password missmatch");
                }

                var userCreated = new User
                (
                    user.Name,
                    user.LastName, 
                    user.Username, 
                    user.Email, 
                    BCrypt.Net.BCrypt.HashPassword(user.Password),
                    "",
                    user.GamesWon, 
                    user.GamesLost
                );

                if (user.ProfilePicture != null && user.ProfilePicture.Length > 0)
                {
                    string fileName = Guid.NewGuid().ToString();
                    var uploads = Path.Combine("C:\\VII semestar\\Arhitektura i projektovanje softvera\\Ena\\Aplication\\EnaApp\\enaapp\\public", @"ProfilePictures");
                    var extension = Path.GetExtension(user.ProfilePicture.FileName);

                    using (var fileStream = new FileStream(Path.Combine(uploads, fileName + extension), FileMode.Create))
                    {
                        await user.ProfilePicture.CopyToAsync(fileStream);
                    }

                    using (var image = Image.Load(Path.Combine(uploads, fileName + extension)))
                    {
                        image.Mutate(x => x
                            .Resize(new ResizeOptions
                            {
                                Size = new Size(120, 120),
                                Mode = ResizeMode.Crop
                            }));

                        image.Save(Path.Combine(uploads, fileName + extension));
                    }

                    userCreated.ProfilePicture = @"ProfilePictures\" + fileName + extension;
                }

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
                userFound.GamesLost = user.GamesLost;
                userFound.GamesWon= user.GamesWon;

                if (user.ChangePass)
                {
                    if (BCrypt.Net.BCrypt.Verify(user.OldPass, userFound.Password))
                    {
                        userFound.Password = BCrypt.Net.BCrypt.HashPassword(user.NewPass);
                    }
                }

                if (user.ChangeProfilePicture)
                {
                    if (!string.IsNullOrEmpty(userFound.ProfilePicture))
                    {
                        string filePath = Path.Combine("C:\\VII semestar\\Arhitektura i projektovanje softvera\\Ena\\Aplication\\EnaApp\\enaapp\\public", userFound.ProfilePicture);

                        if (File.Exists(filePath))
                        {
                            File.Delete(filePath);
                        }

                        userFound.ProfilePicture = "";
                    }

                    if (user.ProfilePicture != null && user.ProfilePicture.Length > 0)
                    {
                        string fileName = Guid.NewGuid().ToString();
                        var uploads = Path.Combine("C:\\VII semestar\\Arhitektura i projektovanje softvera\\Ena\\Aplication\\EnaApp\\enaapp\\public", @"ProfilePictures");
                        var extension = Path.GetExtension(user.ProfilePicture.FileName);

                        using (var fileStream = new FileStream(Path.Combine(uploads, fileName + extension), FileMode.Create))
                        {
                            await user.ProfilePicture.CopyToAsync(fileStream);
                        }

                        using (var image = Image.Load(Path.Combine(uploads, fileName + extension)))
                        {
                            image.Mutate(x => x
                                .Resize(new ResizeOptions
                                {
                                    Size = new Size(120, 120),
                                    Mode = ResizeMode.Crop
                                }));

                            image.Save(Path.Combine(uploads, fileName + extension));
                        }

                        userFound.ProfilePicture = @"ProfilePictures\" + fileName + extension;
                    }
                }

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

        public async Task<IQueryable<User>> Search(string username, string ownerUsername)
        {
            if (username == null)
            {
                throw new Exception("Type usernama for searching!");
            }

            if (ownerUsername == null)
            {
                throw new Exception("Missing username who searching!");
            }

            var users = await this._unitOfWork.User.GetUsersByUsername(username, ownerUsername);
            return users;
        }

        public async Task<User> GetUserByUsername(string username)
        {
            if (username != null)
            {
                var user = await this._unitOfWork.User.GetUserByUsername(username);
                return user;
            }
            throw new ArgumentNullException(nameof(username), "Username cannot be null.");
        }

        public async Task<User> GetUserByUserId(int userId)
        {
            var user = await this._unitOfWork.User.GetUserById(userId);
            return user;
        }

    }
}
