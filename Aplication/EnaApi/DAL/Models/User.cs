using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }
        [Required]
        public string LastName { get; set; }
        [Required]
        public string Username { get; set; }
        [Required]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
        public virtual ICollection<FriendsList> InitiatorFriendsLists { get; set; }

        public virtual ICollection<FriendsList> FriendFriendsLists { get; set; }
        public virtual ICollection<ChatMessage> SenderLists { get; set; }
        public virtual ICollection<ChatMessage> RecipientLists { get; set; }
        public virtual ICollection<Request> SenderRequests { get; set; }
        public virtual ICollection<Request> RecipientRequests { get; set; }
        public virtual ICollection<GameRequest> SenderGameInvitations { get; set; }
        public virtual ICollection<GameRequest> RecipientGameInvitations { get; set; }
        public string ProfilePicture { get; set; }
        public int GamesWon { get; set; }
        public int GamesLost { get; set; }

        public User(string name, string lastName, string username, string email, string password, string profilePicture, int gamesWon, int gamesLost
            )
        {
            Name = name;
            LastName = lastName;
            Username = username;
            Email = email;
            Password = password;
            ProfilePicture = profilePicture;
            GamesWon = gamesWon;
            GamesLost = gamesLost;
        }
    }
}
