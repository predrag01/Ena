
const Login = () => {
    return (
        <form>
            <h1 className="h3 mb-3 fw-normal">Please log in</h1>
            <div className="form-floating">
                <input type="email" className="form-control" placeholder="name@example.com" required/>
                <label >Email address</label>
            </div>
            <div className="form-floating text-start mb-3">
                <input type="password" className="form-control" placeholder="Password" required/>
                <label >Password</label>
            </div>
            <button className="btn btn-primary w-100 py-2" type="submit">Sign in</button>
        </form>
    );
};

export default Login;