using DAL.Repository.IRepository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.UnitOfWork
{
    public interface IUnitOfWork : IDisposable
    {
        ICardRepository Card { get; }
        IChatMessageRepository ChatMessage { get; }
        IFriendsListRepository FriendsList { get; }
        IGameRepository Game { get; }
        IGameRequestRepository GameRequest { get; }
        IListOfCardsRepository ListOfCards { get; }
        IPlayerHandRepository PlayerHand { get; }
        IPlayerRepository Player { get; }
        IRequestRepository Request { get; }
        ITurnRepository Turn { get; }
        IUserRepository User { get; }
        IWinnerRepository Winner { get; }
        Task Save();
    }
}
