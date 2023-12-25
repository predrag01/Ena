using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Models
{
    public class PlayerHand
    {
        [Key]
        public int ID { get; set; }
        public ListOfCards? Cards { get; set; }
        [Required]
        public int PlayerId { get; set; }
        public Player? Player { get; set; }
    }
}
