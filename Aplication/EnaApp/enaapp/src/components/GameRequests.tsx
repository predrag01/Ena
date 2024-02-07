import { GameRequest } from "../models/gameRequest.model";
import image from "./../assets/noProfilePicture.png"

const GameRequests = (props: {gameRequests: GameRequest[], declineGameRequest:(requestId: number)=> void, acceptGameRequest:(request:GameRequest)=> void}) => {

    const handleAcceptClick = (request:GameRequest) => {
        props.acceptGameRequest(request); 
      }
    
      const handleDeclineClick = (requestId : number) => {
        props.declineGameRequest(requestId)
      }
    
      return (
        <div className="friends-request">
          {(Array.isArray(props.gameRequests) && props.gameRequests.length > 0) ? (
            props.gameRequests.map((request) => (
              <div key={request.id} className="friends-request-item">
                <div className="d-flex flex-column">
                  <div className="d-flex flex-row">
                    <img className="request-img" src={request.sender?.profilePicture ? request.sender?.profilePicture : image}/>
                    <div className="request-info">
                      <label className="request-username">{request.sender?.username}</label>
                      <label className="request-label">sent</label>
                      <label className="request-label">you</label>
                      <label className="request-label">a</label>
                      <label className="request-label">game</label>
                      <label className="request-label">request.</label>
                    </div>
                  </div>
                  <div>
                    {/* <label className="d-flex flex-row">{request.timestamp ? request.timestamp.getDate() + " " + request.timestamp.getTime() : ""}</label> */}
                  </div>
                </div>
                <div className="request-accept-decline">
                  <label className="reuqest-button" onClick={() => handleAcceptClick(request)}><i className="bi bi-check2"></i></label>
                  <label className="reuqest-button" onClick={() => handleDeclineClick(request.id!)}><i className="bi bi-x"></i></label>
                </div>
              </div>
            ))
          ) : (
            <p className="black">No game requests</p>
          )}
        </div>
      );
};

export default GameRequests;