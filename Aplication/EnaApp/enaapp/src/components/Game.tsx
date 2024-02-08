import { useEffect, useState } from "react";
import { Game } from "../models/game.model";
import { Card } from "../models/card.model";
import { Player } from "../models/player.model";
import Cookies from 'js-cookie';
import { Store } from 'react-notifications-component';

const GameComponent = (props:{game:Game|undefined, gameId:number, connection: signalR.HubConnection | null, player:Player|null}) => {

    const[pile, setPile] = useState<Card>();
    const[hand, setHand] = useState<Card[]>();

    const [players, setPlayers] = useState<Player[]>([]);
    const [playersList, setPlayersList] = useState<Player[]>([]);
    const [winner, setWinner] = useState<Player>();
    const [myTurn, setMyturn] = useState(false);
    const [drawCard, setDrawCard] = useState(true);
    const [turnDirection, setTurnDirection] = useState(true)

    const [pickColor, setPickColor] = useState(false);


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
            console.log(players);
            setPlayers(players);
            setPlayersList(players);
        }
        getPlayers();
    },[])

    useEffect(()=>{
        console.log("doso sam u game")
        if(props.connection){
            if(props.game!==undefined && props.player?.host){
                setMyturn(true);
                console.log(props.game);
                if(props.game.pile!==undefined){
                    console.log(props.game)
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
                    console.log("ReceiveDrawCardRequest");
                    console.log('draw card req');
                    
                    props.connection?.invoke('SendDrawCard',props.gameId, playerId, props.game?.deck?.pop());
                });

                props.connection.on('ReceiveNext', (id:number)=>{
                    console.log("ReceiveNext");
                    const targetPlayerIndex = players.findIndex(player => player.id === id)
                    const nextPlayerIndex = (targetPlayerIndex + 1) % players.length;
                    const nextPlayer: Player = players[nextPlayerIndex];
                    props.connection?.invoke('SendTurn', props.gameId,  nextPlayer.id);
                });
            }

            props.connection.on('ReceivePile', (card: Card) => {
                console.log("ReceivePile");
                setPile(card);
            });
            
            props.connection.on('ReceiveHand', (id:number, cards: Card[]) => {
                console.log("ReceiveHand");
                if(id===props.player?.id)
                    setHand(cards);
            });

            props.connection.on('ReceivePlus', (id:number, cards: Card[]) => {
                console.log("ReceivePlus");
                if(id===props.player?.id)
                    setHand(prevList => [...(prevList ?? []), ...cards]);
            });
    
            props.connection.on('ReceiveDrawCard', (id:number, card: Card) => {
                console.log("ReceiveDrawCard");
                if(props.player?.id===id){
                    console.log(id);
                    setHand(prevHand => [...prevHand ?? [], card]);
                    //setMessages(prevMessages => [...prevMessages, message]);
                }
            });

            props.connection.on('ReceiveTurn', (id: number) => {
                console.log("ReceiveTurn");
                if(id === props.player?.id){
                    console.log('b');
                    setMyturn(true);
                    setDrawCard(true);

                    Store.addNotification({
                        title: "Your turn!",
                        type: "default",
                        insert: "top",
                        container: "top-center",
                        animationIn: ["animate__animated", "animate__fadeIn"],
                        animationOut: ["animate__animated", "animate__fadeOut"],
                        dismiss: {
                          duration: 3000,
                          onScreen: false
                        }
                      });
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
                      duration: 3000,
                      onScreen: false
                    }
                  });
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
        };
    },[playersList]);

    useEffect(()=>{
        props.connection?.on('ReceivePlayedCard', (id:number, card: Card) => {  
            console.log("ReceivePlayedCard");
            console.log(card);
            setPile(card);
            
            console.log(props.player?.host);
            if(props.player?.host){

                if(card.value === "Reverse"){
                    console.log('reverse');
                    
                    console.log(players);
                    const reversedPlayers = [...players].reverse();
                    console.log(reversedPlayers);
                    setPlayers(reversedPlayers);
                    console.log(players);
                }
                var targetPlayerIndex = players.findIndex(player => player.id === id);
                var nextPlayerIndex = (targetPlayerIndex + ((card.value === "Skip") ? 2 : 1)) % players.length;
                if(!turnDirection){
                    nextPlayerIndex = (targetPlayerIndex - ((card.value === "Skip") ? 2 : 1) + players.length) % players.length;
                }
                console.log(players);
                const nextPlayer: Player = players[nextPlayerIndex];
                console.log(nextPlayer);

                if(card.value === "Draw Two"){
                    var list:Card[]= props.game!.deck!.splice(0, 2);
                    console.log(list);
                    if(!nextPlayer.host){
                        props.connection!.invoke('SendPlus', props.gameId, nextPlayer.id, list);
                    }
                    else{
                        setHand(prevList => [...(prevList ?? []), ...list]);
                    }
                }

                if(card.value === "Draw Four"){
                    var list:Card[]= props.game!.deck!.splice(0, 4);
                    console.log(list);
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
        });
        return () => {
            props.connection?.off('ReceivePlayedCard');
        };
    },[playersList])

    useEffect(()=>{
        setTurnDirection(!turnDirection);
    },[players])

    const handleDrawCard = () => {
        if(drawCard){
            if(props.connection){
                console.log('handle draw card');
                
                props.connection.invoke('DrawCard', props.gameId, props.player?.id);
            }
            setDrawCard(false);
        }
        else{
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
                setPile(card);
                props.connection.invoke('PlayCard', props.gameId, props.player?.id, card);
                var handPom = hand?.filter((c) => c !== card);
                setHand(handPom);
                if(props.player?.host){
                    const targetPlayerIndex = players.findIndex(player => player.id === props.player?.id);
                    const nextPlayerIndex = (targetPlayerIndex + 1) % players.length;

                    const nextPlayer: Player = players[nextPlayerIndex];
                    props.connection?.invoke('SendTurn', props.gameId,  nextPlayer.id);
                    console.log('a');
                    
                }
                setMyturn(false);
            }
        }
    }

    const handleWildCard = (value:string)=>{
        console.log(value);
        var card:Card = {
            value:'Wild',
            color:value,
        }        

        props.connection?.invoke('PlayCard', props.gameId, props.player?.id, card);
        var handPom = hand?.filter((c) => c.value !== 'Wild');
        setHand(handPom);
        setPickColor(false);
    }

    return (
        <div className="game">
            {/* Game Component {props.gameId} */}
            {/* {props.game?.deck?.map((item)=>(
                <label>{item.value}/{item.color}</label>
            ))} */}
            {/* {props.game?.players?.map((player,id)=>(
                <label key={id} >{player.userId}</label>
            ))} */}
            <div className="game-pile">
                <div className="col-4">
                </div>
                <div className="col-4">
                    <img className="game-card" src={"UnoCards/" + (pile?.value==='Wild'?'Black':pile?.color) + " " + pile?.value + ".png"}/>
                    {/* <img className="game-card" src={"UnoCards/" + pile?.color + " " + pile?.value + ".png"}/> */}
                </div>
                <div className="col-4">
                    {/* <button className="game-next" onClick={handleNext} disabled={!myTurn}>Draw Card</button> */}
                    <button className="game-draw-card" onClick={handleDrawCard} disabled={!myTurn}>{drawCard ?'Draw Card':'Next'}</button>
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
                {hand?.map((card,id)=>(
                    <img  key={id} onClick={()=>handlePlayCard(card)} className="game-hand-card" src={"UnoCards/" + card.color + " " + card?.value + ".png"}/>
                ))}
            </div>            
        </div>
    );
};

export default GameComponent;