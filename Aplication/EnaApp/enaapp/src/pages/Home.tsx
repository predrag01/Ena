

const Home = (props: {username:string}) => {
    return (
        <div>
            {props.username ? 'Hi ' + props.username : 'You are not loged in'}
        </div>
    );
};

export default Home;