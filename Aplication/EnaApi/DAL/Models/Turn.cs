using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace DAL.Models
{
    public class Turn
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public int PlayerId { get; set; }
        public Player? Player { get; set; }
        [NotMapped]
        public Card? CardDrawn { get; set; }
        public string CardDrawnJson{
            get => JsonSerializer.Serialize(CardDrawn);
            set => CardDrawn = JsonSerializer.Deserialize<Card>(value);
        }
        [NotMapped]
        public Card? CardThrown { get; set; }
        public string CardThrownJson
        {
            get => JsonSerializer.Serialize(CardThrown);
            set => CardThrown = JsonSerializer.Deserialize<Card>(value);
        }
        public int NumberOfTurn { get; set; }

        public Turn(int playerId, int number, Card drawn=null, Card thrown=null)
        {
            this.PlayerId = playerId;
            this.CardDrawn= drawn;
            this.CardThrown = thrown;
            this.NumberOfTurn = number;
        }

        public Turn(int playerId, int number, string drawn = null, string thrown = null)
        {
            this.PlayerId = playerId;
            this.CardDrawnJson = drawn;
            this.CardThrownJson = thrown;
            this.NumberOfTurn = number;
        }
    }
}
