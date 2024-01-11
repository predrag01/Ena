import { User } from "../models/user.model";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserPlus } from '@fortawesome/free-solid-svg-icons'
import { faUserCheck } from '@fortawesome/free-solid-svg-icons'
import { useState } from "react";

const SearchResult = (props: {username: string; result: User}) => {

  const [isIconClicked, setIconClicked] = useState(false);

  const [isFriendshipTrue, setIsFriendshipTrue] = useState(false);

  const handleIconClick = () => {
    if(!isIconClicked){
      sendFriendRequest();
      setIconClicked(true);
    }

  };
  async function sendFriendRequest(){
    const response2 = await fetch(`https://localhost:44364/Request/SendFriendRequest/${encodeURIComponent(props.result.username!)}/${encodeURIComponent(props.username!)}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'credentials': 'include'
            },
          });
          if (!response2.ok) {
            console.error('Failed to send friend request');
            return;
          }
          const isFriend = await response2.json();
          console.log(isFriend);
  }

  (async () => {

    const response = await fetch(`https://localhost:44364/Friends/CheckIfFriends/${encodeURIComponent(props.result.username!)}/${encodeURIComponent(props.username!)}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'credentials': 'include'
          },
        });

        if (!response.ok) {
          console.error('Failed to fetch friends list');
          return;
        }
        const isFriend = await response.json();
        console.log(isFriend);
        setIsFriendshipTrue(isFriend);
  })();
  

  return (
    <>
    <div>{props.result.username} 
    &nbsp;
    <span onClick={handleIconClick}>

      <FontAwesomeIcon icon={isIconClicked || isFriendshipTrue ? faUserCheck : faUserPlus} />
    </span>
    </div>
    </>
  );
};

export default SearchResult;