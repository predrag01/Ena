import FrindsList from "../components/FriendsList";
import Cookies from 'js-cookie'
const handleCreateLobby = async () => {
    await fetch('https://localhost:44364' + '/Game/CreateGame', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + Cookies.get('jwt')
      },
      credentials: 'include'
  });

  props.setUserId(-1);
  console.log("logout")
};

const Home = (props: {username:string, userId: number, refetchFriends: boolean, connection: signalR.HubConnection | null}) => {
    return (
        <div className="home-div">
            <div className="home">
                <button onClick={handleCreateLobby}>Create game</button>

            </div>
            
            <div className="friends">
                <h3 className="friends-headline">Friends</h3>
                <FrindsList userId={props.userId} chat={false} refetchFriends={props.refetchFriends} connection={props.connection}/>
            </div>
        </div>
    );
};

export default Home;