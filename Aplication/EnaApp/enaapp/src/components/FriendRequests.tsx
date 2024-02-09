import { FriendRequest } from "../models/friendRequest.model";
import image from "./../assets/noProfilePicture.png"

const FriendRequests = (props:{friendRequests: FriendRequest[], declineFriendRequest:(requestId: number)=> void, acceptFriendRequest:(requestId: number, sender: string)=> void }) => {

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
