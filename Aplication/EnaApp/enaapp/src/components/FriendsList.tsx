import { useEffect, useState } from "react";
import { FriendList } from "../models/friendList.model";
import Friend from "./Friend";
import ChatItem from "./ChatItem";
import { User } from "../models/user.model";
import Cookies from "js-cookie";

const FrindsList = (props: {userId: number, chat: boolean, setUser?: (user: User) => void, refetchFriends:boolean, connection:signalR.HubConnection|null}) => {
    const[frinedsList, setFriendsList] = useState<FriendList[]>([])

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('https://localhost:44364' + '/Friends/GetAllFriends/' + props.userId, {
              headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + Cookies.get('jwt') 
            },
              credentials: 'include'
            });
    
            if (!response.ok) {
              console.error('Failed to fetch friends list');
              return;
            }
    
            const content: FriendList[] = await response.json();
            setFriendsList(content);
        };
    
        fetchData();
      }, [props.userId, props.refetchFriends]);
    
    return (
        <div className="friend-list">
            
            {frinedsList.map((friend, id) => {
                return (props.chat ? <ChatItem result={friend} key={id} setUser={props.setUser || (() => {})}/> : <Friend result={friend} key={id} connection={props.connection}/>)
            })}
        </div>
    );
};

export default FrindsList;