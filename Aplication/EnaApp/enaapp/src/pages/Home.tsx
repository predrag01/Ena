import { useState } from "react";
import FrindsList from "../components/FriendsList";
import Cookies from 'js-cookie'
import GameLobby from "../components/GameLobby";
import { Player } from "../models/player.model";

const Home = (props: {username:string, userId: number, refetchFriends: boolean, connection: signalR.HubConnection | null}) => {

    const[showLobby, setShowLobby] = useState(false);
    const[gameId, setGameId] = useState<number>(-1);
    const[player, setPlayer] = useState<Player|null>(null);

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
            setShowLobby(true);
            const player: Player = await response.json();
            setPlayer(player);
            setGameId(player?.gameId);
        }

    };
    return (
        <div className="home-div">
            <div className="home">
                <button onClick={handleCreateLobby}>Create game</button>
                {showLobby && <GameLobby player={player}/>}
            </div>            
            <div className="friends">
                <h3 className="friends-headline">Friends</h3>
                <FrindsList userId={props.userId} chat={false} refetchFriends={props.refetchFriends} connection={props.connection} gameId={gameId}/>
            </div>
        </div>
    );
};

export default Home;