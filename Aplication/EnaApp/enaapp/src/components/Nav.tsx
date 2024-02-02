import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { User } from "../models/user.model";
import SearchBar from "./SearchBar";
import SearchResultList from "./SearchResultList";
import image from "./../assets/noProfilePicture.png"
import DropDownMenu from "./DropDownMenu";
import FriendRequests from "./FriendRequests";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faUserPlus } from '@fortawesome/free-solid-svg-icons'

const Nav = (props: {gamesWon: number, gamesLost: number,userId: number, username:string, profileImg:string, setUsername: (username: string) => void, setUserId: (userId: number) => void}) => {

  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [showMenu, setShowMenu] = useState(false);
  const [showFriendrequest, setShowFriendrequest] = useState(false);
  const [friendRequest, setFriendrequest] = useState(false);
  const [messages, setMessages] = useState(false);
  const [gameRequest, setMGameRequest] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const searchResultsRef = useRef<HTMLDivElement>(null);

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

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const showHideMenu = () => {
    setShowMenu(!showMenu);
  };

  const showHideFriendRequest = () => {
    setShowFriendrequest(!showFriendrequest);
  };
  
  let menu;

  if(props.username === undefined){
    menu = (
      <ul className="navbar-nav me-auto mb-2 mb-md-0">
        <li className="nav-item active">
          <Link className="nav-link" to={"Login"} >Login</Link>
        </li>
        <li className="nav-item active">
          <Link className="nav-link" to={"Register"}>Register</Link>
        </li>
      </ul>
    )
  } else {
    menu = (
      <div className="nav-menu" ref={menuRef}>
        <div className="icons">
          <Link className="nav-icons game-request-icon" to={""} >
            {gameRequest ? 
              (<div>
                <i className="bi bi-controller"></i>
              </div>) : 
              (<div>
                <i className="bi bi-controller"></i>
              </div>)}
          </Link>
          <label className="nav-icons friend-request-icon" onClick={showHideFriendRequest}>
            {friendRequest ? 
              (<div>
                <i className="bi bi-person-plus-fill"></i>
              </div>) : 
              (<div>
                <i className="bi bi-person"></i>
              </div>
            )}
            {showFriendrequest && <FriendRequests username={props.username}/>}
          </label>
          <Link className="nav-icons message-icon" to={""} >
            {messages ? 
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
          {showMenu && <DropDownMenu setUsername={props.setUsername} userId={props.userId} setUserId={props.setUserId} closeMenu={setShowMenu}/>}
          <label className="nav-username">{props.username}</label>
          <img className="nav-profile-image" src={props.profileImg ? ('./../public/' + props.profileImg) : image } alt={props.username} />
        </div>  
      </div>
    )
  }

  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-dark mb-4">
      <div className="container-fluid">
        <Link className="navbar-brand" to={"/"} >Ena</Link>
        <div className="collapse navbar-collapse" id="navbarCollapse">
          <SearchBar username = {props.username} setResults={setSearchResults}/>
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