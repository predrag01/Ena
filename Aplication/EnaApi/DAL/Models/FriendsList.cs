using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Models
{
    public class FriendsList
    {
        [Key]
        public int Id { get; set; }
        [ForeignKey("User")]
        public int UserId { get; set; }
        [InverseProperty("InitiatorFriendsLists")]
        public User? User { get; set; }

        [ForeignKey("Friend")]
        public int FriendId { get; set; }
        [InverseProperty("FriendFriendsLists")]
        public User? Friend { get; set; }

    }
}
