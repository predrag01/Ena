using Azure.Core;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Models
{
    public class Request
    {
        [Key]
        public int Id { get; set; }
        public int SenderId { get; set; }
        public virtual User? Sender { get; set; }
        public int RecipientId { get; set; }
        public virtual User? Recipient { get; set; }
        public bool IsAccepted { get; set; }
        public DateTime Timestamp { get; set; }
        public Request(int senderId, int recipientId,bool isAccepted, DateTime timestamp) 
        {
            SenderId = senderId;
            RecipientId = recipientId;
            IsAccepted = isAccepted;
            Timestamp = timestamp;
        }
    }
}
