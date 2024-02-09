import { SyntheticEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = (props: {setUsername: (username: string) => void}) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    const navigate = useNavigate();

    const submit = async (e: SyntheticEvent) => {
        e.preventDefault();

        const response = await fetch('https://localhost:44364' + '/User/Login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
            body: JSON.stringify({
                email,
                password
            }), 
            mode:"cors"
        });

        const content = await response.json();
        
        props.setUsername(content.message);
        setRedirect(true);
    };

    if(redirect){
      navigate('/');
    };
    
    return (
        <div className="w-100 h-100 login-div">
            <div className="login-form">
                <form className="login " onSubmit={submit}>
                    <h1 className="h3 mb-3 fw-normal">Log in</h1>
                    <div className="form-floating input-row">
                        <input type="email" className="form-control" placeholder="name@example.com" required onChange={e => setEmail(e.target.value)}/>
                        <label >Email address</label>
                    </div>
                    <div className="form-floating text-start input-row">
                        <input type="password" className="form-control" placeholder="Password" required onChange={e => setPassword(e.target.value)}/>
                        <label >Password</label>
                    </div>
                    <Link className="nav-link login-label" to={"/Register"}>Don't have an account?</Link>
                    <button className="btn btn-primary w-100 py-2" type="submit">Sign in</button>
                </form>

            </div>

        </div>
    );
};

export default Login;