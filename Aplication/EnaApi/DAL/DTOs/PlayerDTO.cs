
using DAL.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.DTOs
{
    public class PlayerDTO
    {
        public int UserId { get; set; }
        public int GameId { get; set; }
        public bool Host { get; set; }
    }
}
