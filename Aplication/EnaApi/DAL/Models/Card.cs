
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Models
{
    public class Card
    {
        [Key]
        public int ID { get; set; }
        public string Value{ get; set; }
        public string Color { get; set; }
        public Card(string Value, string Color) {
            this.Value = Value;
            this.Color = Color;
        }
        public Card()
        {
            this.Color = null;
            this.Value = null;
        }

    }
}
