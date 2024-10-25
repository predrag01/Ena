﻿using BLL.Services;
using BLL.Services.IServices;
using DAL.DataContext;
using DAL.DTOs;
using DAL.Models;
using DAL.UnitOfWork;
using Microsoft.AspNetCore.SignalR;

namespace EnaApi
{
    public class ChatHub : Hub
    {
        public IChatMessageService _messageService { get; set; }
        public IUserService _userService { get; set; }
        public IWinnerService _winnerService { get; set; }
        public IRequestService _requestService { get; set; }
        public IGameRequestService _gameRequestService { get; set; }
        public IFriendsListService _friendsListService { get; set; }
        public IUnitOfWork _unitOfWork { get; set; }
        public ChatHub(EnaContext db, IChatMessageService messageService, IUserService userService, IWinnerService winnerService, IRequestService requestService, IGameRequestService gameRequestService, IFriendsListService friendsListService, IUnitOfWork unitOfWork)
        {
            _messageService = messageService;
            _userService = userService;
            _winnerService = winnerService;
            _requestService = requestService;
            _gameRequestService = gameRequestService;
            _friendsListService = friendsListService;
            this._unitOfWork = unitOfWork;
        }
        //public async Task JoinChat(UserConnection connection)
        //{
        //    await Clients.All.SendAsync("ReceiveMessage", "admin", $"{connection.Username} has joined!");
        //}
        //public async Task JoinChatroom(UserConnection connection)
        //{
        //    await Groups.AddToGroupAsync(Context.ConnectionId, connection.Chatroom);
        //    await Clients.All.SendAsync("ReceiveMessage", "admin", $"{connection.Username} has joined ${connection.Chatroom}!");

        //}
        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }

        public async Task NewMessage(long username, string message)
        {
            await Clients.All.SendAsync("messageReceived", username, message);
        }
        public async Task SendConnectionId(string connectionId)
        {
            await Clients.All.SendAsync("setClientMessage", "A connection with ID '" + connectionId + "' has just connected");
        }

        public async Task JoinGroup(string groupName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
        }

        public async Task LeaveGroup(string groupName)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
        }

        public async Task SendMessageToGroup(string groupName, string message)
        {
            await Clients.Group(groupName).SendAsync("ReceiveMessage", Context.User.Identity.Name, message);
        }
        public async Task SendMessageToUser(string recipient, string sender, ChatMessage message)
        {
            var friend1 = await this._userService.GetUserByUsername(sender);
            var friend2 = await this._userService.GetUserByUsername(recipient);

            ChatMessageDTO messagedto = new(friend1.Id, friend2.Id, message.Content, DateTime.Now);
            await this._messageService.SendMessage(messagedto);
            await Clients.Group(recipient).SendAsync("ReceiveMessage", sender, message);
        }
        public async Task SendFriendRequest(string username, string friendUsername)
        {
            var friend1 = await this._userService.GetUserByUsername(username);
            var friend2 = await this._userService.GetUserByUsername(friendUsername);
            if (friend1 != null && friend2 != null)
            {

                RequestDTO request = new RequestDTO
                {
                    SenderId = friend1.Id,
                    RecipientId = friend2.Id,
                    IsAccepted = false,
                    Timestamp = DateTime.Now
                };
                await this._requestService.SendFriendRequest(request);
                await Clients.Group(friendUsername).SendAsync("FriendRequestSent", username);
            }
        }
        public async Task AcceptFriendRequest(int requestId, string username, string sender)
        {
            await this._requestService.AcceptFriendRequest(requestId);
            await this._friendsListService.CreateFriendship(requestId);
            await Clients.Group(username).SendAsync("FetchFriendRequests", sender);
            await Clients.Group(sender).SendAsync("FriendRequestAccepted", username);
            await Clients.Group(username).SendAsync("RefetchFriends", sender);
            await Clients.Group(sender).SendAsync("RefetchFriends", username);
        }
        public async Task DeclineFriendRequest(int requestId, string username)
        {
            var request = await this._unitOfWork.Request.GetRequestById(requestId);
            if (request == null)
            {
                throw new Exception("No such friend request");
            }
            _unitOfWork.Request.Delete(request);
            await Clients.Group(username).SendAsync("FetchFriendRequests", Context.User.Identity.Name);
        }
        public async Task SendGameInviteToUser(string username, string friendname, GameRequestDTO gameRequest)
        {
            GameRequest gamereq = await this._gameRequestService.SendGameRequest(gameRequest);
            if (gamereq != null)
            {
                await Clients.Group(friendname).SendAsync("ReceiveGameInvite", username, gamereq);
            }
        }

        public async Task AcceptGameInviteToUser(User user, string friendname, int gameRequestId)
        {
            await Clients.Group(friendname).SendAsync("GameInviteAccepted", user);

            Player playerParam = await this._gameRequestService.AcceptGameRequset(gameRequestId);

            await Clients.Group(user.Username).SendAsync("CreatedPlayer", playerParam);
        }
        public async Task DeclineGameInviteToUser(int gameRequestId)
        {

            await this._gameRequestService.DeclineGameRequset(gameRequestId);
        }

        public async Task StartGame(int gameId)
        {
            await Clients.Group("game:" + gameId).SendAsync("GameStarted");
        }
        public async Task SendPile(int gameId, Card card)
        {
            await Clients.Group("game:" + gameId).SendAsync("ReceivePile", card);
        }
        public async Task SendHand(int gameId, int playerId, List<Card> cards)
        {
            await Clients.Group("game:" + gameId).SendAsync("ReceiveHand", playerId, cards);
        }
        public async Task PlayCard(int gameId, int playerId, Card card, bool direction)
        {
            await Clients.Group("game:" + gameId).SendAsync("ReceivePlayedCard", playerId, card, direction);
        }
        public async Task DrawCard(int gameId, int playerId)
        {
            await Clients.Group("game:" + gameId).SendAsync("ReceiveDrawCardRequest", playerId);
        }
        public async Task SendDrawCard(int gameId, int playerId, Card card)
        {
            await Clients.Group("game:" + gameId).SendAsync("ReceiveDrawCard", playerId, card);
        }
        public async Task SendTurn(int gameId, int playerId)
        {
            await Clients.Group("game:" + gameId).SendAsync("ReceiveTurn", playerId);
        }
        public async Task SendPlus(int gameId, int playerId, List<Card> cards)
        {
            await Clients.Group("game:" + gameId).SendAsync("ReceivePlus", playerId, cards);
        }
        public async Task Next(int gameId, int playerId)
        {
            await Clients.Group("game:" + gameId).SendAsync("ReceiveNext", playerId);
        }

        public async Task ChangeColor(int gameId, string color)
        {
            await Clients.Group("game:" + gameId).SendAsync("ColorChanged", color);
        }

        public async Task SendEna(int gameId, int playerId)
        {
            await Clients.Group("game:" + gameId).SendAsync("ReceiveEna", playerId);
        }

        public async Task SendWinner(int gameId, int playerId)
        {
            await Clients.Group("game:" + gameId).SendAsync("ReceiveWinner", playerId);
            await this._winnerService.CreateWinner(playerId);
        }
    }
}
