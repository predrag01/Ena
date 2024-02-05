import { User } from "./user.model";

export interface GameRequest{
    id?: number;
    sender?: User;
    senderId?: number;
    recipient: User;
    recipientId?: number;
    gameId?: number;
    isAccepted?: boolean;
    timestamp?: Date;
}

export interface GameRequestDTO{
    senderId?: number;
    recipientId?: number;
    gameId?: number;
    isAccepted?: boolean;
    timestamp?: Date;
}