﻿
using DAL.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.DTOs
{
    public class RequestDTO
    {
        public int SenderId { get; set; }
        public int RecipientId { get; set; }
        public bool IsAccepted { get; set; }
        public DateTime Timestamp { get; set; }
    }
}
