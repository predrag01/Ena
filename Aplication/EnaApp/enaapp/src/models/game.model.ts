import { Card } from "./card.model";
import { Player } from "./player.model";

export interface Game{
    id?: number;
    deck?:Card[];
    pile?:Card[];
    players?:Player[];
    turnDirection?:boolean;
    playerOnTurn?:Player;
}