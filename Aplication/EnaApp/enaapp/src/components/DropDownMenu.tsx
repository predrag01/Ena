import { Link } from "react-router-dom";

const DropDownMenu = (props: {userId:number, setUsername: (username: string) => void, setUserId: (userId: number) => void, closeMenu: (close: boolean) => void}) => {

    const logout = async () => {
          await fetch('https://localhost:44364' + '/User/Logout', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include'
        });
    
        props.setUserId(-1);
        console.log("logout")
    };

    const closeMenu =() =>
    {
        props.closeMenu(false)
    };

    return (
        <div className="drop-down-menu" onClick={closeMenu}>
            <Link to={`/Settings`}>Settings</Link>
            <Link to={"/Login"} onClick={logout}>Logout</Link>
        </div>
    );
};

export default DropDownMenu;