import { useEffect, useState } from "react";
import FrindsList from "../components/FriendsList";
import Cookies from 'js-cookie'
import GameLobby from "../components/GameLobby";
import { Player } from "../models/player.model";
import { User } from "../models/user.model";

const Home = (props: {username:string, userId: number, refetchFriends: boolean, connection: signalR.HubConnection | null, acceptedPlayer:User|null, showLobby:boolean, setShowLobby:(value:boolean)=> void}) => {

    
    const[gameId, setGameId] = useState<number>(-1);
    const[player, setPlayer] = useState<Player|null>(null);

    const [invitedUsers, setInvitedUsers] = useState<User[]>([])
    const [acceptedUsers, setAcceptedUsers] = useState<User[]>([])

    const addInvitedPlayer = (user:User|undefined) => {
        if(user)
        {
            const isUserInvited = invitedUsers.some((invitedUser) => invitedUser.id === user.id);
            if (!isUserInvited)
                setInvitedUsers((prevUsers) => [...prevUsers, user]);
        }
            
    }

    useEffect(()=>{
        console.log('aaa');
                
        if(props.acceptedPlayer!== null){
            console.log(props.acceptedPlayer);

            setAcceptedUsers((prevAcceptedUsers) => [...prevAcceptedUsers, props.acceptedPlayer!]);
            console.log(acceptedUsers);
            
        }
    },[props.acceptedPlayer])

    const handleCreateLobby = async () => {
        const response = await fetch('https://localhost:44364' + `/Game/CreateGame/${props.userId}`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + Cookies.get('jwt')
          },
          credentials: 'include'
      
        });

        if(response.ok){
            props.setShowLobby(true);
            const player: Player = await response.json();
            setPlayer(player);
            setGameId(player?.gameId);
        }

    };
    return (
        <div className="home-div">
            <div className="home">
                {!props.showLobby &&<button onClick={handleCreateLobby}>Create game</button>}
                {props.showLobby && <GameLobby player={player} invitedUsers={invitedUsers} acceptedUsers={acceptedUsers} connection={props.connection}/>}
            </div>            
            <div className="friends">
                <h3 className="friends-headline">Friends</h3>
                <FrindsList userId={props.userId} chat={false} refetchFriends={props.refetchFriends} connection={props.connection} gameId={gameId}  addInvitedPlayer={addInvitedPlayer}/>
            </div>
        </div>
    );
};

export default Home;