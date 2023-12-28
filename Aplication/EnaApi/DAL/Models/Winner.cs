using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Models
{
    public class Winner
    {
        [Key]
        public int ID { get; set; }
        [Required]
        public int PlayerId { get; set; }
        public Player? Player{ get; set; }
        //[Required]
        //public int GameId { get; set; }
        //public Game? Game { get; set; }

        public Winner(int playerId)
        {
            this.PlayerId = playerId;
        }
    }
}
