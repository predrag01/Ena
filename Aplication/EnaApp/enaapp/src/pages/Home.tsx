import FrindsList from "../components/FriendsList";

const Home = (props: {username:string, userId: number}) => {
    return (
        <div className="home-div">
            <div className="home">
                {props.username ? 'Hi ' + props.username : 'You are not loged in' }
            </div>
            <div className="friends">
                <h3 className="friends-headline">Friends</h3>
                <FrindsList userId={props.userId} chat={false}/>
            </div>
        </div>
    );
};

export default Home;