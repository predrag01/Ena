﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Models
{
    public class Player
    {
        [Key]
        public int ID { get; set; }
        [Required]
        public int UserId { get; set; }
        public User? User { get; set; }
        [Required]
        public int GameId { get; set; }
        public Game? Game { get; set; }

        [ForeignKey(nameof(PlayerHandId))]
        public int PlayerHandId { get; set; }
        public PlayerHand? PlayerHand { get; set; }

    }
}
