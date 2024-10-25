﻿using System;
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
        public List<Card> Deck { get; set; }
        [NotMapped]
        public List<Card> Pile { get; set; }
        [NotMapped]
        public List<Player>? Players { get; set; }
        [NotMapped]
        public bool TurnDirection { get; set; } = true;
        [NotMapped]
        public Player PlayerOnTurn { get; set; }
        public virtual ICollection<GameRequest> GameInvitations { get; set; }

    }
}
