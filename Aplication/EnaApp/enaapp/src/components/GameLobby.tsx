import { useState } from "react";
import { User } from "../models/user.model";
import { Player } from "../models/player.model";

const GameLobby = ( props: {player: Player|null}) => {
    const [invitedUsers, setInvitedUsers] = useState<User[]>([])
    const [acceptedUsers, setAcceptedUsers] = useState<User[]>([])



    return(
        <>
        <label>Lobby</label>
        <label >{props.player?.id}</label>
        </>
    );
}

export default GameLobby;