using DAL.Utility;
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
        public CardValue Value{ get; set; }
        public CardColor Color { get; set; }
        public Card(CardValue Value, CardColor Color) {
            this.Value = Value;
            this.Color = Color;
        }

    }
}
