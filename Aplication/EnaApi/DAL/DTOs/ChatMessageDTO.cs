
using DAL.Models;
using Microsoft.EntityFrameworkCore.Diagnostics;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.DTOs
{
    public class ChatMessageDTO
    {
        public int SenderId { get; set; }
        public int RecipientId { get; set; }
        public string Content { get; set; }
        public DateTime Timestamp { get; set; }

        public ChatMessageDTO(int SenderId, int RecipientId, string Content, DateTime Timestamp) 
        {
            this.SenderId = SenderId;
            this.RecipientId = RecipientId;
            this.Content = Content;
            this.Timestamp = Timestamp;
        }
    }
}
