import { useEffect, useState } from "react";
import { Game } from "../models/game.model";
import { Card } from "../models/card.model";
import { Player } from "../models/player.model";
import Cookies from 'js-cookie'

const GameComponent = (props:{game:Game|undefined, gameId:number, connection: signalR.HubConnection | null, player:Player|null}) => {

    const[pile, setPile] = useState<Card>();
    const[hand, setHand] = useState<Card[]>();

    const [players, setPlayers] = useState<Player[]>([]);

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
        if(props.connection){
            if(props.game!==undefined && props.game.pile!==undefined){
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
                    setHand(cards);
            });
    
            props.connection.on('ReceivePlayedCard', (id:number, card: Card) => {  
                console.log(id);
                setPile(card);
            });
    
            props.connection.on('ReceiveDrawCard', (id:number, card: Card) => {
                if(props.player?.id===id){
                    console.log(id);
                    setHand(prevHand => [...prevHand ?? [], card]);
                    //setMessages(prevMessages => [...prevMessages, message]);
                }
            });
        }
        return () => {
            // Cleanup the event subscriptions when the component unmounts
            props.connection?.off('ReceiveDrawCardRequest');
            props.connection?.off('ReceiveDrawCard');
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
        if(props.connection){
            setPile(card);
            props.connection.invoke('PlayCard', props.gameId, props.player?.id, card);
            var handPom = hand?.filter((c) => c !== card);;
            setHand(handPom);
        }
    }

    return (
        <div>
            Game Component {props.gameId}
            {/* {props.game?.deck?.map((item)=>(
                <label>{item.value}/{item.color}</label>
            ))} */}
            {props.game?.players?.map((player,id)=>(
                <label key={id} >{player.userId}</label>
            ))}
            <div>
            Pile:{pile?.color}/{pile?.value}
            </div>
            <div className="d-flex flex-column">
                {hand?.map((card,id)=>(
                    <div key={id} onClick={()=>handlePlayCard(card)}>{card?.color}/{card?.value}</div>
                ))}
            </div>
            <div>
                <button onClick={handleDrawCard}>Draw Card</button>
            </div>
            
        </div>
    );
};

export default GameComponent;