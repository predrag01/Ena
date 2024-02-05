import { useState } from "react";
import { User } from "../models/user.model";

const GameLobby = () => {
    const [invitedUsers, setInvitedUsers] = useState<User[]>([])
    const [acceptedUsers, setAcceptedUsers] = useState<User[]>([])

    return(
        <>
        
        </>
    );
}

export default GameLobby;