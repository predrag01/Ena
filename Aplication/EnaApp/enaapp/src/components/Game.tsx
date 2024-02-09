import { useEffect, useState } from "react";
import { Game } from "../models/game.model";
import { Card } from "../models/card.model";
import { Player } from "../models/player.model";
import Cookies from 'js-cookie';
import { Store } from 'react-notifications-component';
import image from "./../assets/noProfilePicture.png"

const GameComponent = (props:{game:Game|undefined, gameId:number, connection: signalR.HubConnection | null, player:Player|null, setShowGame:(value: boolean) => void, setInGame:(value: boolean)=> void, setShowLobby:(value: boolean) => void}) => {

    const[pile, setPile] = useState<Card>();
    const[hand, setHand] = useState<Card[]>();

    const [players, setPlayers] = useState<Player[]>([]);
    const [playersList, setPlayersList] = useState<Player[]>([]);
    const [winner, setWinner] = useState<boolean>();
    const [myTurn, setMyturn] = useState(false);
    const [drawCard, setDrawCard] = useState(true);
    const [turnDirection, setTurnDirection] = useState(true);

    const [pickColor, setPickColor] = useState(false);

    const [showLabel, setShowLabel] = useState(false);

    const [turnId, setTurnId] = useState<number>(-1);


    useEffect(()=>{
        const getPlayers= async ()=>{
            const response = await fetch('https://localhost:44364' + `/Player/GetAllPlayersByGameId/${props.gameId}`, {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + Cookies.get('jwt')
              },
              credentials: 'include'
          
            });
            var players:Player[] = await response.json();
            setPlayers(players);
            setPlayersList(players);
            var hostPlayer:Player | undefined = players.find((f)=>f.host===true)
            if(hostPlayer)
                setTurnId(hostPlayer.id);
        }
        getPlayers();
    },[])


    const lose = async () => {
        await fetch('https://localhost:44364' + `/USer/Lose/${props.player?.userId}`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + Cookies.get('jwt')
              },
              credentials: 'include'
        });
    } 
    useEffect(()=>{
        if(props.connection){
            if(props.game!==undefined && props.player?.host){
                setMyturn(true);
                if(props.game.pile!==undefined){
                    props.connection.invoke('SendPile', props.gameId, props.game.pile[0]);
                    setPile(props.game.pile[0]);
                }
                
                players?.forEach(element => {
                    var list:Card[]= props.game!.deck!.splice(0, 7);
                    if(!element.host){
                        props.connection!.invoke('SendHand', props.gameId, element.id, list);
                    }
                    else
                        setHand(list);
                });

                props.connection.on('ReceiveDrawCardRequest', (playerId:number) => {
                    props.connection?.invoke('SendDrawCard',props.gameId, playerId, props.game?.deck?.pop());
                });

                props.connection.on('ReceiveNext', (id:number)=>{
                    const targetPlayerIndex = players.findIndex(player => player.id === id)
                    const nextPlayerIndex = (targetPlayerIndex + 1) % players.length;
                    const nextPlayer: Player = players[nextPlayerIndex];
                    props.connection?.invoke('SendTurn', props.gameId,  nextPlayer.id);
                });
            }

            props.connection.on('ReceivePile', (card: Card) => {
                setPile(card);
            });
            
            props.connection.on('ReceiveHand', (id:number, cards: Card[]) => {
                if(id===props.player?.id)
                    setHand(cards);
            });

            props.connection.on('ReceivePlus', (id:number, cards: Card[]) => {
                if(id===props.player?.id)
                    setHand(prevList => [...(prevList ?? []), ...cards]);
            });
    
            props.connection.on('ReceiveDrawCard', (id:number, card: Card) => {
                if(props.player?.id===id){
                    setHand(prevHand => [...prevHand ?? [], card]);
                }
            });

            props.connection.on('ReceiveTurn', (id: number) => {
                setTurnId(id);
                if(id === props.player?.id){
                    setMyturn(true);
                    setDrawCard(true);
                }
            });

            props.connection.on('ColorChanged', (color: string) => {
                Store.addNotification({
                    title: "Changed color!",
                    message: `New card color is ${color}`,
                    type: "default",
                    insert: "top",
                    container: "top-center",
                    animationIn: ["animate__animated", "animate__fadeIn"],
                    animationOut: ["animate__animated", "animate__fadeOut"],
                    dismiss: {
                      duration: 1500,
                      onScreen: false
                    }
                  });
            });

            props.connection.on('ReceiveEna', (playerId: number) => {
                Store.addNotification({
                    title: "Uno!",
                    message: `Player ${players.find((player) => player.id === playerId)?.gameId} has ENA!`,
                    type: "default",
                    insert: "top",
                    container: "top-center",
                    animationIn: ["animate__animated", "animate__fadeIn"],
                    animationOut: ["animate__animated", "animate__fadeOut"],
                    dismiss: {
                      duration: 1500,
                      onScreen: false
                    }
                  });
            });

            props.connection.on('ReceiveWinner', (playerId: number) => {
                if(props.player?.id !== playerId){
                    lose();
                }
                else{
                    setWinner(true);
                }
                setShowLabel(true);
                setTimeout(() =>{ 
                    props.setShowGame(false);
                    props.setShowLobby(false);
                    props.setInGame(false);
                }, 5000)
                
                
            });
        }
        return () => {
            props.connection?.off('ReceiveDrawCardRequest');
            props.connection?.off('ReceiveDrawCard');
            props.connection?.off('ReceiveTurn');
            props.connection?.off('ReceivePile');
            props.connection?.off('ReceiveHand');
            props.connection?.off('ReceiveNext');
            props.connection?.off('ReceivePlus');
            props.connection?.off('ReceiveEna');
            props.connection?.off('ReceiveWinner');
            props.connection?.off('ColorChanged');
        };
    },[playersList]);

    useEffect(()=>{
        props.connection?.on('ReceivePlayedCard', (id:number, card: Card, direction: boolean) => {  
            setPile(card);

            if(turnDirection !== direction)
            {
                setTurnDirection(direction);
            }
            
            if(props.player?.host){

                if(players.length === 2)
                {
                    var targetPlayerIndex = players.findIndex(player => player.id === id);
                    var nextPlayerIndex = (targetPlayerIndex + ((card.value === "Skip" || card.value === "Reverse") ? 2 : 1)) % players.length;
                    const nextPlayer: Player = players[nextPlayerIndex];

                    if(card.value === "Draw Two"){
                        var list:Card[]= props.game!.deck!.splice(0, 2);
                        if(!nextPlayer.host){
                            props.connection!.invoke('SendPlus', props.gameId, nextPlayer.id, list);
                        }
                        else{
                            setHand(prevList => [...(prevList ?? []), ...list]);
                        }
                    }
    
                    if(card.value === "Draw Four"){
                        var list:Card[]= props.game!.deck!.splice(0, 4);
                        if(!nextPlayer.host){
                            props.connection!.invoke('SendPlus', props.gameId, nextPlayer.id, list);
                        }
                        else{
                            setHand(prevList => [...(prevList ?? []), ...list]);
                        }
                    }
                    
                    if(card.value === "Wild"){
                        props.connection?.invoke('ChangeColor', props.gameId,  card.color);
                    }
                    props.connection?.invoke('SendTurn', props.gameId,  nextPlayer.id);
                }else{
                    if(direction){
                        var targetPlayerIndex = players.findIndex(player => player.id === id);
                        var nextPlayerIndex = (targetPlayerIndex + ((card.value === "Skip") ? 2 : 1)) % players.length;
                        const nextPlayer: Player = players[nextPlayerIndex];
    
                        if(card.value === "Draw Two"){
                            var list:Card[]= props.game!.deck!.splice(0, 2);
                            if(!nextPlayer.host){
                                props.connection!.invoke('SendPlus', props.gameId, nextPlayer.id, list);
                            }
                            else{
                                setHand(prevList => [...(prevList ?? []), ...list]);
                            }
                        }
        
                        if(card.value === "Draw Four"){
                            var list:Card[]= props.game!.deck!.splice(0, 4);
                            if(!nextPlayer.host){
                                props.connection!.invoke('SendPlus', props.gameId, nextPlayer.id, list);
                            }
                            else{
                                setHand(prevList => [...(prevList ?? []), ...list]);
                            }
                        }
                        
                        if(card.value === "Wild"){
                            props.connection?.invoke('ChangeColor', props.gameId,  card.color);
                        }
                        props.connection?.invoke('SendTurn', props.gameId,  nextPlayer.id);
                    }
                    else{
                        var targetPlayerIndex = players.findIndex(player => player.id === id);
                        var nextPlayerIndex = (targetPlayerIndex - ((card.value === "Skip") ? 2 : 1) + players.length) % players.length;
                        const nextPlayer: Player = players[nextPlayerIndex];
    
                        if(card.value === "Draw Two"){
                            var list:Card[]= props.game!.deck!.splice(0, 2);
                            if(!nextPlayer.host){
                                props.connection!.invoke('SendPlus', props.gameId, nextPlayer.id, list);
                            }
                            else{
                                setHand(prevList => [...(prevList ?? []), ...list]);
                            }
                        }   
    
                        if(card.value === "Draw Four"){
                            var list:Card[]= props.game!.deck!.splice(0, 4);
                            if(!nextPlayer.host){
                                props.connection!.invoke('SendPlus', props.gameId, nextPlayer.id, list);
                            }
                            else{
                                setHand(prevList => [...(prevList ?? []), ...list]);
                            }
                        }
                        
                        if(card.value === "Wild"){
                            props.connection?.invoke('ChangeColor', props.gameId,  card.color);
                        }
                        props.connection?.invoke('SendTurn', props.gameId,  nextPlayer.id);
                    }
                }
            }
        });
        return () => {
            props.connection?.off('ReceivePlayedCard');
        };
    },[playersList])

    useEffect(()=>{
        if(hand?.length === 1){
            props.connection?.invoke('SendEna', props.gameId, props.player?.id);
        }
        if(hand?.length === 0){
            props.connection?.invoke('SendWinner', props.gameId, props.player?.id);
        }
    },[hand])

    const handleDrawCard = () => {
        if(drawCard && myTurn){
            if(props.connection){
                props.connection.invoke('DrawCard', props.gameId, props.player?.id);
            }
            setDrawCard(false);
        }
    } 

    const handleNext = () => {
        if(myTurn&&!drawCard){

            setMyturn(false);
            props.connection?.invoke('Next', props.gameId, props.player?.id);
            setDrawCard(true);
        }
    }

    const handlePlayCard = (card:Card) => {
        if(props.connection && myTurn){
            if(card.value==='Wild'){
                setPickColor(true);

            }
            else if(pile?.color === card.color || pile?.value === card.value || card.color === "Black" || pile?.color === "Black")
            {
                setPickColor(false);
                setDrawCard(true)
                setPile(card);
                var direction: boolean = card.value === "Wild" ? !turnDirection : turnDirection; 
                props.connection.invoke('PlayCard', props.gameId, props.player?.id, card, direction);
                setTurnDirection(!turnDirection);
                var handPom = hand?.filter((c) => c !== card);
                setHand(handPom);
                if(props.player?.host){
                    if(players.length === 2)
                    {
                        var targetPlayerIndex = players.findIndex(player => player.id === props.player?.id);
                        var nextPlayerIndex = (targetPlayerIndex + ((card.value === "Skip" || card.value === "Reverse") ? 2 : 1)) % players.length;
                        const nextPlayer: Player = players[nextPlayerIndex];
                        
                        if(card.value === "Wild"){
                            props.connection?.invoke('ChangeColor', props.gameId,  card.color);
                        }
                        props.connection?.invoke('SendTurn', props.gameId,  nextPlayer.id);
                    } else{
                        if(direction)
                        {
                            var targetPlayerIndex = players.findIndex(player => player.id === props.player?.id);
                            var nextPlayerIndex = (targetPlayerIndex + ((card.value === "Skip") ? 2 : 1)) % players.length;
                            const nextPlayer: Player = players[nextPlayerIndex];
                            props.connection?.invoke('SendTurn', props.gameId,  nextPlayer.id);
                        }
                        else{
                            var targetPlayerIndex = players.findIndex(player => player.id === props.player?.id);
                            var nextPlayerIndex = (targetPlayerIndex - ((card.value === "Skip") ? 2 : 1) + players.length) % players.length;
                            const nextPlayer: Player = players[nextPlayerIndex];
                            props.connection?.invoke('SendTurn', props.gameId,  nextPlayer.id);
                        }
                    }
                }
                setMyturn(false);
            }
        }
    }

    const handleWildCard = (value:string)=>{
        var card:Card = {
            value:'Wild',
            color:value,
        }        

        props.connection?.invoke('PlayCard', props.gameId, props.player?.id, card, turnDirection);
        var handPom = hand?.filter((c) => c.value !== 'Wild');
        setHand(handPom);
        setPickColor(false);
    }

    return (
        <div className="game">
            {showLabel && (
                <div className="fullscreen-label">
                {winner?
                    <img src="./../public/Titles/Victory.png" alt="victory" />
                    :
                    <img src="./../public/Titles/Defeat.png" alt="victory" />
                }
                </div>
            )}
            <div className="game-pile">
                <div className="col-4">
                    <div className="d-flex flex-column ms-5 game-players-list">
                        {players.map((player, id)=> {
                            return <div className="d-flex flex-row justify-content-between w-100 mb-3" key={id}>
                            <div className="d-flex flex-row align-items-center w-100">
                                <div className="d-flex flex-row">
                                    <img className="friend-profile-image" src={player.user?.profilePicture ? ('./../public/' + player.user?.profilePicture) : image } alt={player.user?.username} />
                                    <div className="friend-username-div d-flex flex-row justify-content-evenly align-items-center ms-3">
                                        <div>
                                            <label className="friend-username game-username-label">{player.user?.username}</label>
                                            {player.host && <label className="host-label ms-2">host</label>}
                                        </div>
                                    </div>
                                </div>
                                <div className="ms-auto"> 
                                    {player.id === turnId && <i className="bi bi-caret-left-fill"></i>}
                                </div>
                            </div>
                        </div>
                        })}
                    </div>
                </div>
                <div className="col-4 game-deck" >
                    <div className="game-deck-background">
                        <img className="game-card m-5" src={"UnoCards/" + (pile?.value==='Wild'?'Black':pile?.color) + " " + pile?.value + ".png"}/>
                    </div>
                </div>
                <div className="col-4">
                    <img className="draw-deck" src="./../public/Backgrounds/Ena-Card-Back-Deck.png" alt="Draw Card" onClick={handleDrawCard}/>
                    <button className="game-draw-card" onClick={handleNext} disabled={!myTurn&&!drawCard}>{'Next'}</button>
                    {pickColor&&
                        <div className="d-flex justify-content-between p-3">
                            <button onClick={()=>handleWildCard('Red')} className="btn btn-danger" style={{ width: '25%'}}></button>
                            <button onClick={()=>handleWildCard('Green')} className="btn btn-success" style={{ width: '25%'}}></button>
                            <button onClick={()=>handleWildCard('Blue')} className="btn btn-primary" style={{ width: '25%'}}></button>
                            <button onClick={()=>handleWildCard('Yellow')} className="btn btn-warning" style={{ width: '25%'}}></button>
                        </div>
                    }
                </div>
            </div>
            <div className="game-hand">
                {hand?.map((card, id) => {
                    const xOffset = (id - (hand.length - 1) / 2) * 20;
                    const yOffset = Math.abs(id - (hand.length - 1) / 2) * 10;
                    const rotation = (id - (hand.length - 1) / 2) * 5;

                    const additionalYOffset = id === 0 || id === Math.floor(hand.length / 2) || id === hand.length - 1 ? 10 : 0;

                    return (
                        <div style={{
                            transform: `translateX(${xOffset}px) translateY(${yOffset + additionalYOffset}px) rotate(${rotation}deg)`,
                            zIndex: id,
                        }}>
                            <img
                                key={id}
                                onClick={() => handlePlayCard(card)}
                                className="game-hand-card"
                                src={"UnoCards/" + card.color + " " + card?.value + ".png"}
                                
                            />
                        </div>
                    );
                })}
            </div>          
        </div>
    );
};

export default GameComponent;