import { useEffect } from "react";
import { User } from "../models/user.model";
import { Player } from "../models/player.model";
import Cookies from 'js-cookie'
import image from "./../assets/noProfilePicture.png"
import { dotPulse } from 'ldrs'

 dotPulse.register()



const GameLobby = ( props: {player: Player|null, invitedUsers:User[], acceptedUsers:User[], connection: signalR.HubConnection | null, setShowGame:(value: boolean)=> void}) => {
    
    // useEffect(()=> {
    //     if(props.connection){
    //         props.connection.on('CreatedPlayer', (player: Player) => {
    //             props.setRefetchFriends(!props.refetchFriends);
    //           });
    //     }
       
    // },[props.acceptedUsers])

    const handleOnClick = async () =>{
        console.log('start game');
        await fetch('https://localhost:44364' + `/GameRequest/DeleteGameRequests/${props.player?.gameId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + Cookies.get('jwt')
            },
            credentials: 'include'
        });

        props.connection?.invoke("StartGame", props.player?.gameId);

        props.setShowGame(true);
    }

    useEffect(() => {
        if(props.connection){
            props.connection.invoke('JoinGroup', 'game:' + props.player?.gameId);  
            console.log('uso u grupu')  
        }
    },[]);

    return(
        <div className="lobby">
            <div className="lobby-title-div">
                    <label className="lobby-title">Lobby</label>
            </div>
            {props.player?.host?
                <div className="lobby-host">
                    <div className="lobby-host-list">
                        <label className="players-list-title">Invited users</label>
                        {props.invitedUsers.length>0 && props.invitedUsers.map((user, id) => {
                                return (<div className="lobby-list-item" key={id}>
                                            <img className="lobby-profile-img" src={user.profilePicture ? user.profilePicture : image}/>
                                            <label className="lobby-username">{user.username}</label>
                                        </div>)
                        })}
                    </div>
                    <div className="lobby-host-list">
                        <label className="players-list-title">Accepted users</label>
                        {props.acceptedUsers.length>0 && props.acceptedUsers.map((user, id) => {
                                return (<div className="lobby-list-item" key={id}>
                                            <img className="lobby-profile-img" src={user.profilePicture ? user.profilePicture : image}/>
                                            <label className="lobby-username">{user.username}</label>
                                        </div>)
                        })}
                    </div>
                    <div className="lobby-start-game">
                        <button className="start-game" disabled={props.acceptedUsers.length === 0} onClick={handleOnClick}>Start game</button>
                    </div>
                </div>:
                <div className="lobby-waiting-to-start">
                    <label className="waiting-to-start-label">Waiting to start</label>
                    <div className="lobby-animation">
                        <l-dot-pulse size="40" speed="1.5" color="black"></l-dot-pulse>
                    </div>
                </div>
            }
        </div>
    );
}

export default GameLobby;