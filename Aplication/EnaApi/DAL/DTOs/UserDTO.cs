﻿
using DAL.Models;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.DTOs
{
    public class UserDTO
    {
        public string Name { get; set; }
        public string LastName { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string ProfilePicture { get; set; }
        public int GamesWon { get; set; }
        public int GamesLost { get; set; }
    }

    public class UserRegisterDTO
    {
        public string Name { get; set; }
        public string LastName { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string RepeatedPassword { get; set; }
        public IFormFile ProfilePicture { get; set; }
        public int GamesWon { get; set; }
        public int GamesLost { get; set; }
    }

    public class UserUpdateDTO
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Name { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public bool ChangePass { get; set; }
        public string? OldPass { get; set; }
        public string? NewPass { get; set; }
        public int GamesWon { get; set; }
        public int GamesLost { get; set; }
        public IFormFile? ProfilePicture { get; set; }
        public bool ChangeProfilePicture { get; set; }
    }

    public class UserLoginDTO
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
