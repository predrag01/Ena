import { useState } from "react";
import SearchBar from "../components/SearchBar";
import SearchResultList from "../components/SearchResultList";
import { User } from "../models/user.model";

const Home = (props: {username:string}) => {
    const [searchResults, setSearchResults] = useState<User[]>([]);
    return (
        <div>
            {props.username ? 'Hi ' + props.username : 'You are not loged in'}
            <SearchBar username = {props.username} setResults={setSearchResults}/>
            <SearchResultList results={searchResults}/>
        </div>
    );
};

export default Home;