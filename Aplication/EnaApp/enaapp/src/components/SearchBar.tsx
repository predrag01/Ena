import { useState } from "react";
import { User } from "../models/user.model";


const SearchBar = (props: {username:string, setResults: (users: User[]) => void}) => {

  const [find, setSearch] = useState('');

  const searching = props.username;

  const search = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    const response = await fetch(`https://localhost:44364/User/Search/${encodeURIComponent(find)}/${encodeURIComponent(searching)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'credentials': 'include'
            },
        });

    const users: User[] = await response.json();

    if(response.ok) {
      props.setResults(users);
    }
    //console.log(users)
  }

  return (
    <div >
        <form className="d-flex" role="search" onSubmit={search}>
            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" onChange={e => setSearch(e.target.value)}/>
            <button className="btn btn-outline-success" type="submit">Search</button>
        </form>
    </div>
  );
};

export default SearchBar;