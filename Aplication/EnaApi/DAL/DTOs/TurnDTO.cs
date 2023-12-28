
using DAL.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace DAL.DTOs
{
    public class TurnDTO
    {
        public int PlayerId { get; set; }
        public Card? CardDrawn { get; set; }

        public Card? CardThrown { get; set; }
        public int NumberOfTurn { get; set; }
    }
}
