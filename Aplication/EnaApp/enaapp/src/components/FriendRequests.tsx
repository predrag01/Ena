import { useState, useEffect } from "react";
import { FriendRequest } from "../models/friendRequest.model";
import * as signalR from "@microsoft/signalr";
const FriendRequests = (props:{ username: String, friendRequests: FriendRequest[], connection: signalR.HubConnection | null, declineFriendRequest:(requestId: number)=> void, acceptFriendRequest:(requestId: number)=> void }) => {

  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
  // const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);


  // useEffect(() => {
  //   const fetchFriendRequests = async () => {
  //     const response = await fetch('https://localhost:44364' + '/Request/GetAllFriendRequests?username=' + props.username, {
  //             headers: { 'Content-Type': 'application/json' },
  //             credentials: 'include'
  //           });
  //     const data = await response.json();
  //     console.log(data);
  //     setFriendRequests(data);
  //     const newConnection = new signalR.HubConnectionBuilder()
	// 		.withUrl('https://localhost:44364/chatHub') 
	// 		.build();
	
	// 	newConnection.on('FetchFriendRequests', (username: string) => {
	// 		fetchFriendRequests();
	// 	});

  //   // newConnection.start();
	// 	newConnection.start()
	// 		.then(() => {
	// 			// Join a group using the usernames of the two users
	// 			newConnection.invoke('JoinGroup', props.username);
	// 			console.log('SignalR connection established');
	// 		})
	// 		.catch((error) => {
	// 			console.error('Error establishing SignalR connection:', error);
	// 		});
	
	// 	setConnection(newConnection);
	
	// 	return () => {
	// 		if (newConnection) {
	// 			// Leave the group when the component unmounts
	// 			newConnection.invoke('LeaveGroup', props.username);
	// 			// newConnection.invoke('LeaveGroup', friendUsername);
	// 			newConnection.stop();
	// 		}
	// 	};
  //   };
    
  //   fetchFriendRequests();
  // }, []);

  // useEffect(() => {
		
	// }, []);

  // const acceptFriendRequest = async (requestId: number) => {
  //   if (props.connection) {
  //     try {
  //       // Invoke the 'SendMessageToUser' method on the server
  //       await props.connection.invoke('AcceptFriendRequest', requestId, props.username);
  //     } catch (error) {
  //       console.error('Error acceptiing friend request:', error);
  //     }
  //   }
  // };

  // const declineFriendRequest = async (requestId: number) => {
  //   if (props.connection) {
  //     try {
  //       // Invoke the 'SendMessageToUser' method on the server
  //       await props.connection.invoke('DeclineFriendRequest', requestId, props.username);
  //     } catch (error) {
  //       console.error('Error acceptiing friend request:', error);
  //     }
  //   }
  // };

  const handleAcceptClick = (requestId : number) => {
    props.acceptFriendRequest(requestId)
  }

  const handleDeclineClick = (requestId : number) => {
    props.declineFriendRequest(requestId)
  }

  return (
    <div className="friends-request">
      <h3>Friend Requests</h3>
      {(Array.isArray(props.friendRequests) && props.friendRequests.length > 0) ? (
        props.friendRequests.map((request) => (
          <div key={request.id} className="friends-request-item">
            {request.sender?.username}
            <label>Sented you a friend request.</label>
            <label onClick={() => handleAcceptClick(request.id!)}><i className="bi bi-check2"></i></label>
            <label onClick={() => handleDeclineClick(request.id!)}><i className="bi bi-x"></i></label>
          </div>
        ))
      ) : (
        <p className="black">No friend requests</p>
      )}
    </div>
  );
};

export default FriendRequests;
