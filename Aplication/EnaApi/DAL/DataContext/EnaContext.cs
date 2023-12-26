
using DAL.Models;
using Microsoft.EntityFrameworkCore;

namespace DAL.DataContext
{
    public class EnaContext : DbContext
    {
        public EnaContext(DbContextOptions<EnaContext> options): base(options) { }

        public DbSet<User>? Users{ get; set; }
        public DbSet<Player>? Players { get; set; }
        public DbSet<Game>? Games { get; set; }
        public DbSet<PlayerHand>? PlayerHands { get; set; }
        public DbSet<Turn>? Turns { get; set; }

    }
}
