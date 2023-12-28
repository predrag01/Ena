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
        IGameRepository Game { get; }
        IListOfCardsRepository ListOfCards { get; }
        IPlayerHandRepository PlayerHand { get; }
        IPlayerRepository Player { get; }
        ITurnRepository Turn { get; }
        IUserRepository User { get; }
        IRequestRepository Request { get; }
        IGameRequestRepository GameRequest { get; }
        IChatMessageRepository ChatMessage { get; }
        Task Save();
    }
}
