import { Game } from "./game.model";
import { User } from "./user.model";

export interface Player{
    id?:number;
    userId?: number;
    user?: User;
    gameId: number;
    game: Game;
    host?: boolean;
}