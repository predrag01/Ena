﻿using DAL.DataContext;
using DAL.Repository;
using DAL.Repository.IRepository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.UnitOfWork
{
    public class UnitOfWork:IUnitOfWork
    {
        private readonly EnaContext _context;

        public UnitOfWork(EnaContext context)
        {
            _context = context;
            Card = new CardRepository(_context);
            Game = new GameRepository(_context);
            ListOfCards = new ListOfCardsRepository(_context);
            PlayerHand = new PlayerHandRepository(_context);
            Player = new PlayerRepository(_context);
            Turn = new TurnRepository(_context);
            User = new UserRepository(_context);
        }

        public ICardRepository Card { get; private set; }

        public IGameRepository Game { get; private set; }

        public IListOfCardsRepository ListOfCards { get; private set; }

        public IPlayerHandRepository PlayerHand { get; private set; }

        public IPlayerRepository Player { get; private set; }

        public ITurnRepository Turn { get; private set; }

        public IUserRepository User { get; private set; }

        public async Task Complete()
        {
            await _context.SaveChangesAsync();
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}
