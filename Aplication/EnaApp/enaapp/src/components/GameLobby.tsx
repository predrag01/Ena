import { useState } from "react";
import { User } from "../models/user.model";

const GameLobby = ( props: {playerId: number}) => {
    const [invitedUsers, setInvitedUsers] = useState<User[]>([])
    const [acceptedUsers, setAcceptedUsers] = useState<User[]>([])

    return(
        <>
        <label>Loby</label>
        <label >{props.playerId}</label>
        </>
    );
}

export default GameLobby;