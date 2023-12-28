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
        public int UserId { get; set; }
        public virtual User? User { get; set; }

        public int FriendId { get; set; }
        public virtual User? Friend { get; set; }
        public FriendsList(int userId, int friendId)
        {
            UserId = userId;
            FriendId = friendId;
        }
    }
}
