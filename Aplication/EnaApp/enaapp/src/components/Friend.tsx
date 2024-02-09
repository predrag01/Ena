import { FriendList } from "../models/friendList.model";
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import image from "./../assets/noProfilePicture.png"
import Cookies from "js-cookie";
import { GameRequestDTO } from "../models/gameRequest.model";
import { User } from "../models/user.model";

const Friend = (props: {result: FriendList, connection:signalR.HubConnection|null, gameId: number, addInvitedPlayer:(user:User|undefined)=> void}) => {
  const [username, setUserName] = useState('');
  useEffect(() => {
    (
        async () => {
            const respone = await fetch('https://localhost:44364' + '/User/GetUser', {
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + Cookies.get('jwt')
                },
                credentials: 'include',
                mode: 'cors'
            });

            const content = await respone.json();

            setUserName(content.username)
        }
    )();
  });

  const handleInviteClick =  () => {
    if (props.connection) {
      try {

        var req: GameRequestDTO = {
          senderId: props.result.userId,
          recipientId: props.result.friendId,
          gameId:props.gameId
        };

         props.connection.invoke('SendGameInviteToUser', props.result.user?.username, props.result.friend?.username, req);
         props.addInvitedPlayer(props.result?.friend);
      } catch (error) {
        console.error('Error sending friend request:', error);
      }
    }
  }

  return (
    <div className="friend">
        <img className="friend-profile-image" src={props.result.friend?.profilePicture ? ('./../public/' + props.result.friend?.profilePicture) : image } alt={props.result.friend?.username} />
        <div className="friend-username-counts">
          <div className="friend-username-div">
            <label className="friend-username">{props.result.friend?.username}</label>
          </div>
          <div className="friend-counts">
            <i className="bi bi-trophy-fill friend-wons-lost"></i>
            <label className="friend-list-gamesWonLost"> {props.result.friend?.gamesWon}</label>
            <i className="bi bi-bandaid-fill friend-wons-lost"></i>
            <label className="friend-list-gamesWonLost"> {props.result.friend?.gamesLost}</label>
          </div>
        </div>
        <Link to={`/chat?username=${username}&friendUsername=${props.result.friend?.username}`}><i className="friend-message-game-icon bi bi-chat-left-fill"></i></Link>
        {(props.gameId > 0 ? true : false) && <label onClick={handleInviteClick}><i className="friend-message-game-icon bi bi-controller"></i></label>}
    </div>
  );
};

export default Friend;