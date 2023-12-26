using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace DAL.Models
{
    public class Game
    {
        [Key]
        public int Id { get; set; }
        [NotMapped]
        public ListOfCards Deck { get; set; }
        [NotMapped]
        public ListOfCards Pile { get; set; }
        public List<Player>? Players { get; set; }
        [ForeignKey("Winner")]
        public int? WinnerId { get; set; }

        public Player Winner { get; set; }

        [NotMapped]
        public bool TurnDirection { get; set; }
        [NotMapped]
        public Player PlayerOnTurn { get; set; }

    }
}
