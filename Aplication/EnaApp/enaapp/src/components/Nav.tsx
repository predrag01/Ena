import { useState } from "react";
import { Link } from "react-router-dom";
import { User } from "../models/user.model";


const Nav = (props: {username:string, setUsername: (username: string) => void}) => {

  const [find, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);

  const searching = props.username;

  const logout = async () => {
    await fetch('https://localhost:44364' + '/User/Logout', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include'
    });

    props.setUsername('');
  }

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
      setSearchResults(users);
    }
    console.log(users)
  }

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
      <ul className="navbar-nav me-auto mb-2 mb-md-0">
        <li className="nav-item active">
          <Link className="nav-link" to={"Login"} onClick={logout}>Logout</Link>
        </li>
      </ul>
    )
  }

  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-dark mb-4">
      <div className="container-fluid">
        <Link className="navbar-brand" to={"/"} >Ena</Link>
        <div className="collapse navbar-collapse" id="navbarCollapse">
          <form className="d-flex" role="search" onSubmit={search}>
            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" onChange={e => setSearch(e.target.value)}/>
            <button className="btn btn-outline-success" type="submit">Search</button>
          </form>
          <div className="result-box">
            {searchResults.map((user, index) => (
              <div key={index}>{user.UserName}</div>
            ))}
          </div>
        </div>
        <div className="d-flex">
            {menu}
        </div>
      </div>
    </nav>
  );
};

export default Nav;