import { useEffect, useState } from "react";
import FrindsList from "../components/FriendsList";
import Cookies from 'js-cookie'
import GameLobby from "../components/GameLobby";
import { Player } from "../models/player.model";
import { User } from "../models/user.model";
import GameComponent from "../components/Game";
import { Game } from "../models/game.model";

const Home = (props: {userId: number, refetchFriends: boolean, connection: signalR.HubConnection | null, acceptedPlayer:User|null, showLobby:boolean, setShowLobby:(value:boolean)=> void, ingame:boolean, setInGame:(value:boolean)=> void}) => {

    
    const[gameId, setGameId] = useState<number>(-1);
    const[player, setPlayer] = useState<Player|null>(null);
    const[game, setGame] = useState<Game>();

    const [invitedUsers, setInvitedUsers] = useState<User[]>([]);
    const [acceptedUsers, setAcceptedUsers] = useState<User[]>([]);

    const [showGame, setShowGame] = useState(false);

    const addInvitedPlayer = (user:User|undefined) => {
        if(user)
        {
            const isUserInvited = invitedUsers.some((invitedUser) => invitedUser.id === user.id);
            if (!isUserInvited)
                setInvitedUsers((prevUsers) => [...prevUsers, user]);
        }
    }

    useEffect(()=>{
        props.setShowLobby(false);
        const getPlayers= async ()=>{
            const response = await fetch('https://localhost:44364' + `/Player/GetAllPlayersByGameId/${gameId}`, {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + Cookies.get('jwt')
              },
              credentials: 'include'
          
            });
            var gamePom = game;
            var players:Player[] = await response.json();
            
            if(gamePom){
                gamePom.players=players;
                setGame(gamePom);
            }
        }
        getPlayers();
    },[showGame])

    useEffect(() => {
        if(player && !player?.host && props.showLobby){
            props.setInGame(true);
        }
    }, [props.showLobby, player])

    useEffect(() => {
        if(player && player?.host && props.showLobby){
            props.setInGame(true);
        }
    }, [showGame])

    useEffect(()=>{
                
        if(props.acceptedPlayer!== null){

            setAcceptedUsers((prevAcceptedUsers) => [...prevAcceptedUsers, props.acceptedPlayer!]);
            
        }
    },[props.acceptedPlayer])

    if(props.connection){
        props.connection.on('CreatedPlayer', (playerParam: Player) => {
            setPlayer(playerParam);
            setGameId(playerParam.gameId);
        });

        props.connection.on('GameStarted', () => {
            setShowGame(true);
            props.setShowLobby(false);
        });
    }

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
            player.game.playerOnTurn=player;
            player.game.players?.push(player);
            setGame(player.game);

        }

    };
    return (
        <div className="home-div">
            <div className="home">
                {(!props.showLobby && !showGame) &&<img onClick={handleCreateLobby} className="home-create-game-img" src="./../public/Buttons/Ena-Button.png" alt="Create Game" />}
                {props.showLobby && <GameLobby player={player} invitedUsers={invitedUsers} acceptedUsers={acceptedUsers} connection={props.connection} setShowGame={setShowGame}/>}
                {showGame && <GameComponent game={game} gameId={gameId} connection={props.connection} player={player} setShowGame={setShowGame} setShowLobby={props.setShowLobby} setInGame={props.setInGame}/>}
            </div>  
            {!props.ingame && <div className="friends">
                <h3 className="friends-headline">Friends</h3>
                <FrindsList userId={props.userId} chat={false} refetchFriends={props.refetchFriends} connection={props.connection} gameId={gameId}  addInvitedPlayer={addInvitedPlayer} />
            </div>}
        </div>
    );
};

export default Home;