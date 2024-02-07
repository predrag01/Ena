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
    const [winner, setWinner] = useState<Player>();
    const [myTurn, setMyturn] = useState(false);


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
        }
        getPlayers();
    },[])

    useEffect(()=>{
        console.log("doso sam u game")
        if(props.connection){
            if(props.game!==undefined && props.game.pile!==undefined){
                setMyturn(true)
                console.log(props.game);
                props.connection.invoke('SendPile', props.gameId, props.game.pile[0]);
                setPile(props.game.pile[0]);
                players?.forEach(element => {
                    var list:Card[]= props.game!.deck!.splice(0, 7);
                    if(!element.host){
                        props.connection!.invoke('SendHand', props.gameId, element.id, list);
                    }
                    else
                        setHand(list);
                });
                props.connection.on('ReceiveDrawCardRequest', (playerId:number) => {
                    console.log('draw card req');
                    
                    props.connection?.invoke('SendDrawCard',props.gameId, playerId, props.game?.deck?.pop());
                });
            }
            props.connection.on('ReceivePile', (card: Card) => {
                setPile(card);
            });
            
            props.connection.on('ReceiveHand', (id:number, cards: Card[]) => {
                if(id===props.player?.id)
                    setHand(prevList => [...(prevList ?? []), ...cards]);
            });
    
            props.connection.on('ReceivePlayedCard', (id:number, card: Card) => {  
                console.log(id);
                setPile(card);
                
                if(props.game?.pile!==undefined){

                    if(card.value === "Reverse"){
                        setPlayers([...players].reverse());
                    }
                    const targetPlayerIndex = players.findIndex(player => player.id === id)
                    const nextPlayerIndex = (targetPlayerIndex + ((card.value === "Skip") ? 2 : 1)) % players.length;
                    const nextPlayer: Player = players[nextPlayerIndex];

                    if(card.value === "Draw Two"){
                        var list:Card[]= props.game!.deck!.splice(0, 2);
                        if(!nextPlayer.host){
                            props.connection!.invoke('SendHand', props.gameId, nextPlayer.id, list);
                        }
                        else{
                            setHand(prevList => [...(prevList ?? []), ...list]);
                        }
                    }

                    if(card.value === "Draw Four"){
                        var list:Card[]= props.game!.deck!.splice(0, 4);
                        if(!nextPlayer.host){
                            props.connection!.invoke('SendHand', props.gameId, nextPlayer.id, list);
                        }
                        else{
                            setHand(prevList => [...(prevList ?? []), ...list]);
                        }
                    }
                    
                    // if(card.value === "Wild"){
                    //     var list:Card[]= props.game!.deck!.splice(0, 4);
                    //     if(!nextPlayer.host){
                    //         props.connection!.invoke('SendHand', props.gameId, nextPlayer.id, list);
                    //     }
                    //     else{
                    //         setHand(prevList => [...(prevList ?? []), ...list]);
                    //     }
                    // }
                    props.connection?.invoke('SendTurn', props.gameId,  nextPlayer.id);
                }
            });
    
            props.connection.on('ReceiveDrawCard', (id:number, card: Card) => {
                if(props.player?.id===id){
                    console.log(id);
                    setHand(prevHand => [...prevHand ?? [], card]);
                    //setMessages(prevMessages => [...prevMessages, message]);
                }
            });

            props.connection.on('ReceiveTurn', (id: number) => {
                if(id === props.player?.id){
                    setMyturn(true);

                    Store.addNotification({
                        title: "Yotu turn!",
                        type: "default",
                        insert: "top",
                        container: "top-center",
                        animationIn: ["animate__animated", "animate__fadeIn"],
                        animationOut: ["animate__animated", "animate__fadeOut"],
                        dismiss: {
                          duration: 5000,
                          onScreen: false
                        }
                      });
                }
            });


        }
        return () => {
            // Cleanup the event subscriptions when the component unmounts
            props.connection?.off('ReceiveDrawCardRequest');
            props.connection?.off('ReceiveDrawCard');
            props.connection?.off('ReceiveTurn');
            // other event unsubscriptions...
        };
    },[players]);

    
    // useEffect(()=>{

    // })
    // if(props.connection){
    //     if(props.game!==undefined){
    //         props.connection.on('ReceiveDrawCardRequest', (playerId:number) => {
    //             console.log('draw card req');
                
    //             props.connection?.invoke('SendDrawCard',props.gameId, playerId, props.game?.deck?.pop());
    //         });
    //     }
    //     props.connection.on('ReceivePile', (card: Card) => {
    //         setPile(card);
    //     });
        
    //     props.connection.on('ReceiveHand', (id:number, cards: Card[]) => {
    //         if(id===props.player?.id)
    //             setHand(cards);
    //     });

    //     props.connection.on('ReceivePlayedCard', (id:number, card: Card) => {  
    //         console.log(id);
    //         setPile(card);
    //     });

    //     props.connection.on('ReceiveDrawCard', (id:number, card: Card) => {
    //         if(props.player?.id===id){
    //             console.log(id);
    //             setHand(prevHand => [...prevHand ?? [], card]);
    //             //setMessages(prevMessages => [...prevMessages, message]);
    //         }
    //     });
    //     // props.connection.on('GameStarted', () => {
    //     //     setShowGame(true);
    //     //     props.setShowLobby(false);
    //     // });
    // }

    const handleDrawCard = () => {
        if(props.connection){
            console.log('handle draw card');
            
            props.connection.invoke('DrawCard', props.gameId, props.player?.id);
        }
    }
    

    const handlePlayCard = (card:Card) => {
        if(props.connection && myTurn){
            if(pile?.color === card.color || pile?.value === card.value || card.color === "Black" || pile?.color === "Black")
            {
                setPile(card);
                props.connection.invoke('PlayCard', props.gameId, props.player?.id, card);
                var handPom = hand?.filter((c) => c !== card);;
                setHand(handPom);
                if(props.game?.pile!==undefined){
                    const targetPlayerIndex = players.findIndex(player => player.id === props.player?.id);
                    const nextPlayerIndex = (targetPlayerIndex + 1) % players.length;

                    const nextPlayer: Player = players[nextPlayerIndex];
                    props.connection?.invoke('SendTurn', props.gameId,  nextPlayer.id);
                }
                setMyturn(false);
            }
        }
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
                    <img className="game-card" src={"UnoCards/" + pile?.color + " " + pile?.value + ".png"}/>
                </div>
                <div className="col-4">
                    <button className="game-draw-card" onClick={handleDrawCard}>Draw Card</button>
                </div>
            </div>
            <div className="game-hand">
                {hand?.map((card,id)=>(
                    <img  key={id} onClick={()=>handlePlayCard(card)} className="game-hand-card" src={"UnoCards/" + card?.color + " " + card?.value + ".png"}/>
                ))}
            </div>            
        </div>
    );
};

export default GameComponent;