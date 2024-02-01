import { User } from "../models/user.model";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { faUserCheck } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from "react";
import * as signalR from '@microsoft/signalr';
import image from "./../assets/noProfilePicture.png"

const SearchResult = (props: {username: string; result: User}) => {

  const [isIconClicked, setIconClicked] = useState(false);

  const [isFriendshipTrue, setIsFriendshipTrue] = useState(true);
  const [isFriendRequestedTrue, setIsFriendRequestedTrue] = useState(false);

  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);

  (async () => {

    const response = await fetch(`https://localhost:44364/Request/CheckIfFriendRequestSent/${encodeURIComponent(props.username!)}/${encodeURIComponent(props.result.username!)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'credentials': 'include'
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch friends list');
      return;
    }
    const isFriendReq = await response.json();
    // console.log(props.result.username+" is friendreq "+isFriendReq);
    setIsFriendRequestedTrue(isFriendReq);

    const response2 = await fetch(`https://localhost:44364/Friends/CheckIfFriends/${encodeURIComponent(props.username!)}/${encodeURIComponent(props.result.username!)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'credentials': 'include'
      },
    });

    if (!response2.ok) {
      console.error('Failed to fetch friends list');
      return;
    }
    const isFriend = await response2.json();
    // console.log(props.result.username+" is friends "+isFriend);
    setIsFriendshipTrue(isFriend);

  })();

  const handleIconClick = () => {
    if(!isIconClicked){
      sendFriendRequestSignalR();
      setIconClicked(true);
    }

  };
  // async function sendFriendRequest(){
  //   const response2 = await fetch(`https://localhost:44364/Request/SendFriendRequest/${encodeURIComponent(props.result.username!)}/${encodeURIComponent(props.username!)}`, {
  //           method: 'POST',
  //           headers: {
  //             'Content-Type': 'application/json',
  //             'credentials': 'include'
  //           },
  //         });
  //         if (!response2.ok) {
  //           console.error('Failed to send friend request');
  //           return;
  //         }
  //         const isFriend = await response2.json();
  //         console.log(isFriend);
  // }

  useEffect(() => {
		const newConnection = new signalR.HubConnectionBuilder()
			.withUrl('https://localhost:44364/chatHub') 
			.build();
	
		// newConnection.on('ReceiveMessage', (username: string, message: string) => {
		// 	setMessages(prevMessages => [...prevMessages, `${username}: ${message}`]);
		// });
	
		newConnection.start()
			.then(() => {
				// Join a group using the usernames of the two users
				newConnection.invoke('JoinGroup', props.result.username);
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
				newConnection.invoke('LeaveGroup', props.result.username);
				newConnection.invoke('LeaveGroup', props.username);
				newConnection.stop();
			}
		};
	}, []);

const sendFriendRequestSignalR = async () => {
  if (connection) {
    try {
      // Invoke the 'SendMessageToUser' method on the server
      await connection.invoke('SendFriendRequest', props.username, props.result.username);
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  }
};

  
  

  return (
    <div className="signle-search-result">
      <img className="result-profile-image" src={props.result.profilePicture ? ('./../public/' + props.result.profilePicture) : image } alt={props.username} />
      <label className="result-username">{props.result.username}</label>
      <div className="result-icon">
        <label className="result-icon-icon" onClick={handleIconClick}>
          {!isFriendshipTrue&& ((isIconClicked || isFriendRequestedTrue) ? (<i className="bi bi-person-plus-fill"></i>) : (<i className="bi bi-person-check-fill"></i>))}
        </label>
      </div>
    </div>
  );
};

export default SearchResult;