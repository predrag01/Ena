import { SyntheticEvent, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
    const [profilePicture, setProfilePictureFile] = useState<File | null>(null);
    const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatedPassword, setRepeatedPassword] = useState('');
    const [gamesWon] = useState(0);
    const [gamesLost] = useState(0);
    const [redirect, setRedirect] = useState(false);
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      setProfilePictureFile(file || null);

      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              setProfilePicturePreview(reader.result as string);
          };
          reader.readAsDataURL(file);
      } else {
          setProfilePicturePreview(null);
      }
    };

    const clearProfilePicture = () => {
      setProfilePictureFile(null);
      setProfilePicturePreview(null);
    };

    const submit = async (e: SyntheticEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('lastName', lastName);
        formData.append('username', username);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('repeatedPassword', repeatedPassword);
        formData.append('gamesWon', String(gamesWon));
        formData.append('gamesLost', String(gamesLost));
        if (profilePicture) {
            formData.append('profilePicture', profilePicture);
        }

        const response = await fetch('https://localhost:44364' + '/User/Register', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            setRedirect(true);
      };
    }

    if(redirect){
      navigate('/Login');
    };
    
    return (
      <div className="w-100 h-100 login-div">
        <div className="login-form">
          <form onSubmit={submit} className="form-signin">
              <h1 className="h3 mb-3 fw-normal">Registration</h1>
              <div className="profile-picture-container">
                  {profilePicturePreview ? (
                    <img src={profilePicturePreview} alt="Profile Preview" className="profile-preview" onClick={clearProfilePicture}/>) : 
                    (<>
                        <label htmlFor="profile-picture" className="profile-picture-label"><i className="bi bi-camera-fill"></i></label>
                        <input type="file" id="profile-picture" onChange={handleFileChange} accept="image/*" className="profile-picture-input" ref={fileInputRef}/>
                      </>
                    )
                  }
              </div>
              <div className="form-floating input-row">
                <input className="form-control" placeholder="Name" required onChange={e => setName(e.target.value)}/>
                <label >Name</label>
              </div>
              <div className="form-floating input-row">
                <input className="form-control" placeholder="Last Name" required onChange={e => setLastName(e.target.value)}/>
                <label >Last Name</label>
              </div>
              <div className="form-floating input-row">
                <input className="form-control" placeholder="Username" required onChange={e => setUserName(e.target.value)}/>
                <label >Username</label>
              </div>
              <div className="form-floating input-row">
                <input type="email" className="form-control" placeholder="name@example.com" required onChange={e => setEmail(e.target.value)}/>
                <label >Email</label>
              </div>
              <div className="form-floating input-row">
                <input type="password" className="form-control" placeholder="Password" required onChange={e => setPassword(e.target.value)}/>
                <label >Password</label>
              </div>
              <div className="form-floating input-row">
                <input type="password" className="form-control" placeholder="Repeated password" required onChange={e => setRepeatedPassword(e.target.value)}/>
                <label >Repeated password</label>
              </div>
              <Link className="nav-link login-label" to={"/Login"} >Already have an account?</Link>
              <button className="btn btn-primary w-100 py-2 mb-4" type="submit">Register</button>
          </form>
        </div>
      </div>
    );
};

export default Register;