import { SyntheticEvent, useState } from "react";
import { useNavigate } from "react-router-dom";



const Register = () => {
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatedPassword, setRepeatedPassword] = useState('');
    const [profilePicture] = useState('');
    const [gamesWon] = useState(0);
    const [gamesLost] = useState(0);
    const [redirect, setRedirect] = useState(false);
    const navigate = useNavigate();

    const submit = async (e: SyntheticEvent) => {
        e.preventDefault();

        await fetch('https://localhost:44364' + '/User/Register', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                name,
                lastName,
                username,
                email,
                password,
                repeatedPassword,
                profilePicture,
                gamesWon,
                gamesLost
            })
        });

        setRedirect(true);
    };

    if(redirect){
      navigate('/Login');
    };
    
    return (
        <form onSubmit={submit} className="form-signin">
            <h1 className="h3 mb-3 fw-normal">Registration</h1>
            <div className="form-floating">
              <input className="form-control" placeholder="Name" required onChange={e => setName(e.target.value)}/>
              <label >Name</label>
            </div>
            <div className="form-floating">
              <input className="form-control" placeholder="Last Name" required onChange={e => setLastName(e.target.value)}/>
              <label >Last Name</label>
            </div>
            <div className="form-floating">
              <input className="form-control" placeholder="Username" required onChange={e => setUserName(e.target.value)}/>
              <label >Username</label>
            </div>
            <div className="form-floating">
              <input type="email" className="form-control" placeholder="name@example.com" required onChange={e => setEmail(e.target.value)}/>
              <label >Email</label>
            </div>
            <div className="form-floating">
              <input type="password" className="form-control" placeholder="Password" required onChange={e => setPassword(e.target.value)}/>
              <label >Password</label>
            </div>
            <div className="form-floating">
              <input type="password" className="form-control" placeholder="Repeated password" required onChange={e => setRepeatedPassword(e.target.value)}/>
              <label >Repeated password</label>
            </div>
            <button className="btn btn-primary w-100 py-2" type="submit">Register</button>
        </form>
    );
};

export default Register;