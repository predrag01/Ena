using Microsoft.EntityFrameworkCore.Metadata.Internal;
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
    public class PlayerHand
    {
        [Key]
        public int ID { get; set; }
        //public List<Card> Cards { get; set; }
        [NotMapped]
        public List<Card> Cards { get; set; }

        public string CardsJson
        {
            get => JsonSerializer.Serialize(Cards);
            set => Cards = JsonSerializer.Deserialize<List<Card>>(value);
        }

        [ForeignKey(nameof(PlayerId))]
        public int PlayerId { get; set; }
        public Player? Player { get; set; }

    }
}
