import { FriendList } from "../models/friendList.model";
import image from "./../assets/noProfilePicture.png"
import { User } from "../models/user.model";

const ChatItem = (props: {result: FriendList, setUser: (user: User) => void}) => {
  
  return (
    <div className="friend chat-item" onClick={() => props.setUser(props.result.friend || {})}>
        <img className="friend-profile-image" src={props.result.friend?.profilePicture ? ('./../public/' + props.result.friend?.profilePicture) : image } alt={props.result.friend?.username} />
        <div className="friend-username-counts">
          <div className="friend-username-div">
            <label className="friend-username">{props.result.friend?.username}</label>
          </div>
        </div>
    </div>
  );
};

export default ChatItem;