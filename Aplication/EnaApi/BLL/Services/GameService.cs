using BLL.Services.IServices;
using DAL.DataContext;
using DAL.Models;
using DAL.UnitOfWork;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL.DTOs;
using Microsoft.AspNetCore.Http.HttpResults;
using DAL.Utility;

namespace BLL.Services
{
    public class GameService : IGameService
    {
        private readonly EnaContext _db;
        public IUnitOfWork _unitOfWork { get; set; }

        public GameService(EnaContext db, IUnitOfWork unitOfWork)
        {
            this._db = db;
            this._unitOfWork = unitOfWork;
        }

        public async Task<Game> CreateGame()
        {
            var game = new Game();
            List<Card> unoDeck = GenerateUnshuffledUnoDeck();
            ShuffleDeck(unoDeck);
            game.Deck = unoDeck;
            game.Pile = new List<Card> { game.Deck.First() };
            game.Deck.RemoveAt(0);
            await this._unitOfWork.Game.Add(game);
            await this._unitOfWork.Save();

            return game;
        }
        public static List<Card> GenerateUnshuffledUnoDeck()
        {
            List<Card> unoDeck = new();

            foreach (string color in new[] { CardColor.red, CardColor.blue, CardColor.green, CardColor.yellow })
            {
                unoDeck.Add(new Card($"Number 0", color));
                for (int number = 1; number <= 9; number++)
                {
                    unoDeck.Add(new Card($"Number {number}", color));
                    unoDeck.Add(new Card($"Number {number}", color));
                }
            }

            foreach (string color in new[] { CardColor.red, CardColor.blue, CardColor.green, CardColor.yellow })
            {
                unoDeck.Add(new Card(CardValue.skip, color));
                unoDeck.Add(new Card(CardValue.skip, color));
                unoDeck.Add(new Card(CardValue.reverse, color));
                unoDeck.Add(new Card(CardValue.reverse, color));
                unoDeck.Add(new Card(CardValue.draw_two, color));
                unoDeck.Add(new Card(CardValue.draw_two, color));
            }

            for (int i = 0; i < 4; i++)
            {
                unoDeck.Add(new Card(CardValue.wild, CardColor.black));
                unoDeck.Add(new Card(CardValue.draw_four, CardColor.black));
            }

            return unoDeck;
        }
        public static void ShuffleDeck(List<Card> deck)
        {
            Random random = new();

            for (int i = deck.Count - 1; i > 0; i--)
            {
                int j = random.Next(0, i + 1);
                (deck[j], deck[i]) = (deck[i], deck[j]);
            }
        }
    }
}
