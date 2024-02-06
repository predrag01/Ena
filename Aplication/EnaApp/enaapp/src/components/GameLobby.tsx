import { useEffect, useState } from "react";
import { User } from "../models/user.model";
import { Player } from "../models/player.model";
import Cookies from 'js-cookie'
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
        <>
        {props.player?.host?
            <>
                <label>Lobby</label>
                <label >{props.player?.id}</label>
                <h3>Invited users users</h3>
                {props.invitedUsers.length>0 && props.invitedUsers.map((user, id) => {
                        return (user.username)
                    })}
                <h3>Accepted users</h3>
                {props.acceptedUsers.length>0 && props.acceptedUsers.map((user, id) => {
                        return (user.username)
                    })}
                <button className="start-game" disabled={props.acceptedUsers.length === 0} onClick={handleOnClick}>
                    Start game
                </button>
                
            </>:
            <>
                <label>Waiting to start </label>
                <label>{props.player?.gameId}</label>
            </>
        }
        </>
    );
}

export default GameLobby;