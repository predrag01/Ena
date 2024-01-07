import { Link } from "react-router-dom";


const Nav = () => {
    return (
        <nav className="navbar navbar-expand-md navbar-dark bg-dark mb-4">
          <div className="container-fluid">
            <Link className="navbar-brand" to={"/"} >Ena</Link>
            <div className="collapse navbar-collapse" id="navbarCollapse">
              <form className="d-flex" role="search">
                <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search"/>
                <button className="btn btn-outline-success" type="submit">Search</button>
              </form>
            </div>
            <div className="d-flex">
                <ul className="navbar-nav me-auto mb-2 mb-md-0">
                  <li className="nav-item active">
                    <Link className="nav-link" to={"Login"} >Login</Link>
                  </li>
                  <li className="nav-item active">
                    <Link className="nav-link" to={"Register"}>Register</Link>
                  </li>
                </ul>
              </div>
          </div>
        </nav>
    );
};

export default Nav;