import { FriendList } from "../models/friendList.model";

const Friend = (props: {result: FriendList}) => {

  return (
    <div className="friend">
        {props.result.friend?.username}
    </div>
  );
};

export default Friend;