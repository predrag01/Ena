import { FriendList } from "../models/friendList.model";
// import ChatComponent from "./ChatComponent";
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

const Friend = (props: {result: FriendList}) => {
  const [username, setUserName] = useState('');
  useEffect(() => {
    (
        async () => {
            const respone = await fetch('https://localhost:44364' + '/User/GetUser', {
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
                mode: 'cors'
            });

            const content = await respone.json();

            setUserName(content.username)
        }
    )();
});

  return (
    <div className="friend">
        {/* {props.result.friend?.username} */}
        {/* <ChatComponent username={username} friendUsername={props.result.friend?.username!}/> */}
        <Link to={`/chat?username=${username}&friendUsername=${props.result.friend?.username}`}>
        {props.result.friend?.username}
        </Link>
    </div>
  );
};

export default Friend;