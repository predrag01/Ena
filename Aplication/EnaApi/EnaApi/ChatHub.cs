using Microsoft.AspNetCore.SignalR;

namespace EnaApi
{
    public class ChatHub : Hub
    {
        public async Task JoinChat(UserConnection connection)
        {
            await Clients.All.SendAsync("ReceiveMessage", "admin", $"{connection.Username} has joined!");
        }
        public async Task JoinChatroom(UserConnection connection)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, connection.Chatroom);
            await Clients.All.SendAsync("ReceiveMessage", "admin", $"{connection.Username} has joined ${connection.Chatroom}!");

        }
        public async Task SendMessage(string user, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }
    }
}
