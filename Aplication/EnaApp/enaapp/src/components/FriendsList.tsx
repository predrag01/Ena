import { useEffect, useState } from "react";
import { FriendList } from "../models/friendList.model";
import Friend from "./Friend";

const FrindsList = (props: {userId: number}) => {
    const[frinedsList, setFriendsList] = useState<FriendList[]>([])

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('https://localhost:44364' + '/Friends/GetAllFriends/' + props.userId, {
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include'
            });
    
            if (!response.ok) {
              console.error('Failed to fetch friends list');
              return;
            }
    
            const content: FriendList[] = await response.json();
            setFriendsList(content);
            console.log(content)
        };
    
        fetchData();
      }, [props.userId]);
    
    return (
        <div className="friend-list">
            
            {frinedsList.map((friend, id) => {
                return <Friend result={friend} key={id}/>
            })}
        </div>
    );
};

export default FrindsList;