import { useState, useEffect } from "react";
import { FriendRequest } from "../models/friendRequest.model";
const FriendRequests = (props:{ username: String }) => {
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);

  useEffect(() => {
    const fetchFriendRequests = async () => {
      const response = await fetch('https://localhost:44364' + '/Request/GetAllFriendRequests?username=' + props.username, {
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include'
            });
      const data = await response.json();
      console.log(data);
      
      setFriendRequests(data);
    };

    fetchFriendRequests();
  }, []);

  const handleAccept = (requestId: number) => {
    // Handle accepting friend request logic
    console.log(`Accepting friend request with ID: ${requestId}`);
  };

  const handleDecline = (requestId: number) => {
    // Handle declining friend request logic
    console.log(`Declining friend request with ID: ${requestId}`);
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
              <button onClick={() => handleAccept(request.id!)}>Accept</button>
              <button onClick={() => handleDecline(request.id!)}>Decline</button>
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
