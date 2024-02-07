import { Link } from "react-router-dom";
import Cookies from "js-cookie";

const DropDownMenu = (props: {userId:number, setUsername: (username: string) => void, setUserId: (userId: number) => void, closeMenu: (close: boolean) => void}) => {

    const logout = async () => {
          await fetch('https://localhost:44364' + '/User/Logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + Cookies.get('jwt')
            },
            credentials: 'include'
        });
    
        props.setUserId(-1);
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