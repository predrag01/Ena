import { GameRequest } from "../models/gameRequest.model";

const GameRequests = (props: {gameRequests: GameRequest[], declineGameRequest:(requestId: number)=> void, acceptGameRequest:(requestId: number, sender: string)=> void}) => {

    const handleAcceptClick = (requestId : number, sender: string) => {
        props.acceptGameRequest(requestId, sender)
      }
    
      const handleDeclineClick = (requestId : number) => {
        props.declineGameRequest(requestId)
      }
    
      return (
        <div className="friends-request">
          <h3>Friend Requests</h3>
          {(Array.isArray(props.gameRequests) && props.gameRequests.length > 0) ? (
            props.gameRequests.map((request) => (
              <div key={request.id} className="friends-request-item">
                {request.sender?.username}&nbsp;
                <label>sent you a game request.</label>
                <label onClick={() => handleAcceptClick(request.id!, request.sender?.username!)}><i className="bi bi-check2"></i></label>
                <label onClick={() => handleDeclineClick(request.id!)}><i className="bi bi-x"></i></label>
              </div>
            ))
          ) : (
            <p className="black">No game requests</p>
          )}
        </div>
      );
};

export default GameRequests;