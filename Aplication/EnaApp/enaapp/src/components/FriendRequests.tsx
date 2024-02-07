import { useState, useEffect } from "react";
import { FriendRequest } from "../models/friendRequest.model";
import * as signalR from "@microsoft/signalr";
import image from "./../assets/noProfilePicture.png"

const FriendRequests = (props:{ username: String, friendRequests: FriendRequest[], connection: signalR.HubConnection | null, declineFriendRequest:(requestId: number)=> void, acceptFriendRequest:(requestId: number, sender: string)=> void }) => {

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

  const handleAcceptClick = (requestId : number, sender: string) => {
    props.acceptFriendRequest(requestId, sender)
  }

  const handleDeclineClick = (requestId : number) => {
    props.declineFriendRequest(requestId)
  }

  return (
    <div className="friends-request">
      {(Array.isArray(props.friendRequests) && props.friendRequests.length > 0) ? (
        props.friendRequests.map((request) => (
          <div key={request.id} className="friends-request-item">
            <img className="request-img" src={request.sender?.profilePicture ? request.sender?.profilePicture : image}/>
              <div className="request-info">
                <label className="request-username">{request.sender?.username}</label>
                <label className="request-label">sent</label>
                <label className="request-label">you</label>
                <label className="request-label">a</label>
                <label className="request-label">friend</label>
                <label className="request-label">request.</label>
              </div>
              <div className="request-accept-decline">
                <label className="reuqest-button" onClick={() => handleAcceptClick(request.id!, request.sender?.username!)}><i className="bi bi-check2"></i></label>
                <label className="reuqest-button" onClick={() => handleDeclineClick(request.id!)}><i className="bi bi-x"></i></label>
              </div>
          </div>
        ))
      ) : (
        <p className="black">No friend requests</p>
      )}
    </div>
  );
};

export default FriendRequests;
