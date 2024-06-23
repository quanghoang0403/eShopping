//using Microsoft.AspNetCore.SignalR;
//using System;
//using System.Collections.Generic;
//using System.Threading.Tasks;

//namespace eShopping.Services.Hubs
//{
//    public class OrderSessionHub : Hub
//    {
//        private readonly IDictionary<string, UserConnectionModel> _connections;

//        public OrderSessionHub(IDictionary<string, UserConnectionModel> connections)
//        {
//            _connections = connections;
//        }
//        public override Task OnDisconnectedAsync(Exception exception)
//        {
//            if (_connections.TryGetValue(Context.ConnectionId, out UserConnectionModel userConnection))
//            {
//                _connections.Remove(Context.ConnectionId);
//            }

//            return base.OnDisconnectedAsync(exception);
//        }

//        public async Task JoinRoom(UserConnectionModel userConnection)
//        {
//            await Groups.AddToGroupAsync(Context.ConnectionId, $"{userConnection.BranchId}");
//        }
//    }
//}
