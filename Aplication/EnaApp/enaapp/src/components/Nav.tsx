import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { User } from "../models/user.model";
import SearchBar from "./SearchBar";
import SearchResultList from "./SearchResultList";
import image from "./../assets/noProfilePicture.png"
import DropDownMenu from "./DropDownMenu";
import FriendRequests from "./FriendRequests";
import { FriendRequest } from "../models/friendRequest.model";
import * as signalR from "@microsoft/signalr";
import Cookies from "js-cookie";
import { Store } from 'react-notifications-component';
import { Message } from "../models/message.model";
import { GameRequest } from "../models/gameRequest.model";
import GameRequests from "./GameRequests";

const Nav = (props: {gamesWon: number, gamesLost: number,userId: number, username:string, profileImg:string, setUsername: (username: string) => void, setUserId: (userId: number) => void, setRefetchFriends:(value: boolean) => void, refetchFriends: boolean, showMessages: boolean, setConnection:(connection:signalR.HubConnection | null) => void, addAcceptedPlayer:(user:User)=>void, setShowLobby:(value:boolean)=> void}) => {

  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [showMenu, setShowMenu] = useState(false);
  const [showFriendrequest, setShowFriendrequest] = useState(false);
  const [friendRequest, setFriendrequest] = useState(false);
  const [messages, setMessages] = useState(false);
  const [showGameRequest, setShowGameRequests] = useState(false);
  const [gameRequests, setGameRequests] = useState<GameRequest[]>([])
   
  const menuRef = useRef<HTMLDivElement>(null);
  const searchResultsRef = useRef<HTMLDivElement>(null);
  const gameRequestRef = useRef<HTMLLabelElement>(null);
  const friendRequestRef = useRef<HTMLLabelElement>(null);

  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);

  useEffect(()=>{
    if(props.showMessages===false)
      setMessages(props.showMessages);
  },[props.showMessages]);

  const isAuthenticated = Cookies.get('jwt') !== undefined;

  const fetchGameRequests = async () => {
    const response = await fetch('https://localhost:44364' + `/GameRequest/GetAllGameRequestByRecipientId/${props.userId}`, {
                headers: { 
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + Cookies.get('jwt')
                },
                credentials: 'include'
    });

    if(response.ok){
      var req: GameRequest[] = await response.json();
      setGameRequests(req);
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }

      if (searchResultsRef.current && !searchResultsRef.current.contains(event.target as Node)) {
        setSearchResults([]);
      }
    };

    document.addEventListener("click", handleClickOutside);

    const fetchFriendRequests = async () => {
      if(props.username){
        const response = await fetch('https://localhost:44364' + '/Request/GetAllFriendRequests?username=' + props.username, {
                headers: { 
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + Cookies.get('jwt')
                },
                credentials: 'include'
        });
        
        const data: FriendRequest[] = await response.json();

        var list: FriendRequest[] = [];

        data.forEach(element => {
          list.push(element);
        });
                
        setFriendRequests(list);

        if (list.length > 0) {
          setFriendrequest(true);
        } else {
          setFriendrequest(false);
        }
        

        const newConnection = new signalR.HubConnectionBuilder().withUrl('https://localhost:44364/chatHub').build();
    
        newConnection.on('ReceiveGameInvite', (username: string, friendname: string, gameRequest: GameRequest) => {
          
          fetchGameRequests();

          Store.addNotification({
            title: "New Game Request!",
            message: `${username} sent you a game request`,
            type: "danger",
            insert: "bottom",
            container: "bottom-right",
            animationIn: ["animate__animated", "animate__fadeIn"],
            animationOut: ["animate__animated", "animate__fadeOut"],
            dismiss: {
              duration: 5000,
              onScreen: false
            }
          });
        });

        newConnection.on('FetchFriendRequests', (username: string) => {
          fetchFriendRequests();
        });

        newConnection.on('FriendRequestSent', (username: string) => {
          setFriendrequest(true);

          fetchFriendRequests();
          
          Store.addNotification({
            title: "New Friend Request!",
            message: `${username} sent you a friend request`,
            type: "default",
            insert: "bottom",
            container: "bottom-right",
            animationIn: ["animate__animated", "animate__fadeIn"],
            animationOut: ["animate__animated", "animate__fadeOut"],
            dismiss: {
              duration: 5000,
              onScreen: false
            }
          });
        });

        newConnection.on('RefetchFriends', (username: string) => {
          props.setRefetchFriends(!props.refetchFriends);
        });

        newConnection.on('GameInviteAccepted', (user: User) => {
          
          props.addAcceptedPlayer(user);
        });

        newConnection.on('ReceiveMessage', (username: string, message: Message) => {
          if(props.showMessages)
            setMessages(true);

          Store.addNotification({
            title: `${username} sent you a message!`,
            message: message.content,
            type: "success",
            insert: "bottom",
            container: "bottom-right",
            animationIn: ["animate__animated", "animate__fadeIn"],
            animationOut: ["animate__animated", "animate__fadeOut"],
            dismiss: {
              duration: 5000,
              onScreen: false
            }
          });
        });

        newConnection.on('FriendRequestAccepted', (username: string) => {
          Store.addNotification({
            title: `${username} accepted your friend request!`,
            type: "default",
            insert: "bottom",
            container: "bottom-right",
            animationIn: ["animate__animated", "animate__fadeIn"],
            animationOut: ["animate__animated", "animate__fadeOut"],
            dismiss: {
              duration: 5000,
              onScreen: false
            }
          });
        });

        if(connection === null){
          newConnection.start().then(() => {
            newConnection.invoke('JoinGroup', props.username);
          }).catch((error) => {
            console.error('Error establishing SignalR connection:', error);
          });
          setConnection(newConnection);
        }
      
        return () => {
          if (newConnection) {
            newConnection.invoke('LeaveGroup', props.username);
            newConnection.stop();

            document.removeEventListener("click", handleClickOutside);
          }
          document.removeEventListener("click", handleClickOutside);
        };
      };
    }

    if(props.username !== "success" && props.username !== undefined && props.username !== ''){ 
      fetchFriendRequests();
      fetchGameRequests();
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };

  }, [props.username]);

  useEffect(() => {
    props.setConnection(connection)
  },[connection]);

  const acceptFriendRequest = async (requestId: number, sender: string) => {
    if (connection) {
      try {
        await connection.invoke('AcceptFriendRequest', requestId, props.username, sender);
        setFriendrequest(false);
      } catch (error) {
        console.error('Error acceptiing friend request:', error);
      }
    }
  };

  const declineFriendRequest = async (requestId: number) => { 
    if (connection) {
      try {
        await connection.invoke('DeclineFriendRequest', requestId, props.username);
        setFriendrequest(false);
      } catch (error) {
        console.error('Error acceptiing friend request:', error);
      }
    }
  };

  const acceptGameRequest = async (request:GameRequest) => {
    if (connection) {
      try {
        await connection.invoke('AcceptGameInviteToUser', request.recipient, request.sender?.username, request.id);
        props.setShowLobby(true);
        fetchGameRequests();
      } catch (error) {
        console.error('Error accepting game request:', error);
      }
    }
  };

  const declineGameRequest = async (requestId: number) => { 
    if (connection) {
      try {
        await connection.invoke('DeclineGameInviteToUser', requestId);
        fetchGameRequests();
      } catch (error) {
        console.error('Error acceptiing game request:', error);
      }
    }
  };

  const showHideMenu = () => {
    setShowMenu(!showMenu);
  };

  const showHideFriendRequest = () => {
    setShowFriendrequest(!showFriendrequest);
  };

  const showHideGameRequests = () => {
    
    setShowGameRequests(!showGameRequest);
  };
  
  let menu;

  if(props.username === undefined){
    menu = (
      <ul className="navbar-nav me-auto mb-2 mb-md-0">
        <li className="nav-item active">
          <Link className="nav-link " to={"Login"} ><img className="my-nav-link" src="./../public/Titles/Login.png" alt="Login" /></Link>
        </li>
        <li className="nav-item active">
          <Link className="nav-link " to={"Register"}><img className="my-nav-link" src="./../public/Titles/Register.png" alt="Register" /></Link>
        </li>
      </ul>
    )
  } else {
    menu = (
      <div className="nav-menu" ref={menuRef}>
        <div className="icons">
          <label className="nav-icons game-request-icon" onClick={showHideGameRequests} ref={gameRequestRef}>
            <i className="bi bi-controller"></i>
            {showGameRequest && <GameRequests gameRequests={gameRequests} acceptGameRequest={acceptGameRequest} declineGameRequest={declineGameRequest} />}
          </label>
          <label className="nav-icons friend-request-icon" onClick={showHideFriendRequest} ref={friendRequestRef}>
            {friendRequest ? 
              (<div>
                <i className="bi bi-person-fill"></i>
              </div>) : 
              (<div>
                <i className="bi bi-person"></i>
              </div>
            )}
            {showFriendrequest && <FriendRequests friendRequests={friendRequests} acceptFriendRequest={acceptFriendRequest} declineFriendRequest={declineFriendRequest}/>}
          </label>
          <Link className="nav-icons message-icon" to={`/chat?username=${props.username}&friendUsername=${props.username}`} >
            {messages && props.showMessages ? 
              (<div>
                <i className="bi bi-chat-left-fill"></i>
              </div>) : 
              (<div>
                <i className="bi bi-chat-left"></i>
              </div>)}
          </Link>
        </div>
        <div className="nav-counter">
          <i className="bi bi-trophy nav-wons"></i>
          <label className="gamesWonLost"> {props.gamesWon}</label>
        </div>
        <div className="nav-counter">
          <i className="bi bi-bandaid nav-wons"></i>
          <label className="gamesWonLost"> {props.gamesLost}</label>
        </div>
        <div className="nav-username-img" onClick={showHideMenu}>
          {showMenu && <DropDownMenu setUserId={props.setUserId} closeMenu={setShowMenu}/>}
          <label className="nav-username">{props.username}</label>
          <img className="nav-profile-image" src={props.profileImg ? ('./../public/' + props.profileImg) : image } alt={props.username} />
        </div>  
      </div>
    )
  }

  return (
    <nav className="navbar navbar-expand-md navbar-dark my-nav mb-4">
      <div className="container-fluid">
        <Link className="navbar-brand" to={"/"} ><img src="./../public/Buttons/Title.png" alt="" /></Link>
        <div className="collapse navbar-collapse" id="navbarCollapse">
          {isAuthenticated&&
            <SearchBar username = {props.username} setResults={setSearchResults}/>
          
          }
          {searchResults.length > 0 && (
            <div ref={searchResultsRef}>
              <SearchResultList username={props.username} results={searchResults}  />
            </div>
          )}
        </div>
        <div className="d-flex">
            {menu}
        </div>
      </div>
      
    </nav>
  );
};

export default Nav;