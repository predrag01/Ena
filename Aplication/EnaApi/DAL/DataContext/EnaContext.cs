
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
        public DbSet<Winner>? Winners { get; set; }
        public DbSet<FriendsList>? FriendsLists { get; set; }
        public DbSet<ChatMessage> Messages{ get; set; }
        public DbSet<Request>? Requests { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<FriendsList>()
                .HasOne(fl => fl.User)
                .WithMany(u => u.InitiatorFriendsLists)
                .HasForeignKey(fl => fl.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<FriendsList>()
                .HasOne(fl => fl.Friend)
                .WithMany(u => u.FriendFriendsLists)
                .HasForeignKey(fl => fl.FriendId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ChatMessage>()
                .HasOne(fl => fl.Sender)
                .WithMany(u => u.SenderLists)
                .HasForeignKey(fl => fl.SenderId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ChatMessage>()
                .HasOne(fl => fl.Recipient)
                .WithMany(u => u.RecipientLists)
                .HasForeignKey(fl => fl.RecipientId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Request>()
                .HasOne(fl => fl.Sender)
                .WithMany(u => u.SenderRequests)
                .HasForeignKey(fl => fl.SenderId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Request>()
                .HasOne(fl => fl.Recipient)
                .WithMany(u => u.RecipientRequests)
                .HasForeignKey(fl => fl.RecipientId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
