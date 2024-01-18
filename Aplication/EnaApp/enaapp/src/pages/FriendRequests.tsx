import { useState, useEffect } from "react";
import { FriendRequest } from "../models/friendRequest.model";
import * as signalR from "@microsoft/signalr";
const FriendRequests = (props:{ username: String }) => {
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);


  useEffect(() => {
    const fetchFriendRequests = async () => {
      const response = await fetch('https://localhost:44364' + '/Request/GetAllFriendRequests?username=' + props.username, {
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include'
            });
      const data = await response.json();
      console.log(data);
      setFriendRequests(data);
      const newConnection = new signalR.HubConnectionBuilder()
			.withUrl('https://localhost:44364/chatHub') 
			.build();
	
		newConnection.on('FetchFriendRequests', (username: string) => {
			fetchFriendRequests();
		});

    // newConnection.start();
		newConnection.start()
			.then(() => {
				// Join a group using the usernames of the two users
				newConnection.invoke('JoinGroup', props.username);
				console.log('SignalR connection established');
			})
			.catch((error) => {
				console.error('Error establishing SignalR connection:', error);
			});
	
		setConnection(newConnection);
	
		return () => {
			if (newConnection) {
				// Leave the group when the component unmounts
				newConnection.invoke('LeaveGroup', props.username);
				// newConnection.invoke('LeaveGroup', friendUsername);
				newConnection.stop();
			}
		};
    };
    
    fetchFriendRequests();
  }, []);

  // useEffect(() => {
		
	// }, []);

  const acceptFriendRequest = async (requestId: number) => {
    if (connection) {
      try {
        // Invoke the 'SendMessageToUser' method on the server
        await connection.invoke('AcceptFriendRequest', requestId, props.username);
      } catch (error) {
        console.error('Error acceptiing friend request:', error);
      }
    }
  };

  const declineFriendRequest = async (requestId: number) => {
    if (connection) {
      try {
        // Invoke the 'SendMessageToUser' method on the server
        await connection.invoke('DeclineFriendRequest', requestId, props.username);
      } catch (error) {
        console.error('Error acceptiing friend request:', error);
      }
    }
  };

  return (
    <div className="friend-requests">
      <h3>Friend Requests</h3>
      {Array.isArray(friendRequests) && friendRequests.length > 0 ? (
        friendRequests.map((request) => (
          <div key={request.id} className="friend-request-item">
            <div className="friend-request-info">
              <p>{request.sender!.name}</p>
            </div>
            <div className="friend-request-actions">
              <button onClick={() => acceptFriendRequest(request.id!)}>Accept</button>
              <button onClick={() => declineFriendRequest(request.id!)}>Decline</button>
            </div>
          </div>
        ))
      ) : (
        <p>No friend requests</p>
      )}
    </div>
  );
};

export default FriendRequests;
