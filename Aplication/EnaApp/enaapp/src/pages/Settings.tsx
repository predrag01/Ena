import { useEffect, useRef, useState } from "react"
import { User } from "../models/user.model"

const Settings = ( props: {setUsername: (username: string) => void, setProfilePic: (profilePic: string) => void} ) => {

    const [user, setUser] = useState<User>();
    const [changePassword, setChangePassword] = useState(false);
    const [changeProfilePicture, setChangeProfilePicture] = useState(false);
    const [username, setUsername] = useState('')
    const [name, setName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [oldPass, setOldPass] = useState('')
    const [newPass, setNewPass] = useState('')
    const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);
    const [profilePicture, setProfilePictureFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
   
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('https://localhost:44364/User/GetUser', {
                headers: {'Content-Type': 'application/json'},
                credentials: 'include',
                mode: 'cors'
            });

            const content: User = await response.json();         
            setUser(content);
            setName(content.name || '');
            setLastName(content.lastName || '');
            setUsername(content.username || '');
            setEmail(content.email || '');
            if (content.profilePicture) {
                setProfilePicturePreview(content.profilePicture);
            }
        };

        fetchData(); 

    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setProfilePictureFile(file || null);
  
        if (file) {
            setChangeProfilePicture(true);
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePicturePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setProfilePicturePreview(null);
            setChangeProfilePicture(false);
        }
      };
  
      const clearProfilePicture = () => {
        setProfilePictureFile(null);
        setProfilePicturePreview(null);
        setChangeProfilePicture(true);
      }

    const handleCheckBox = () => {
        setChangePassword(!changePassword)
    }

    const update = async () => {

        if (!user || !user.id) {
            return;
        }

        const formData = new FormData();

        formData.append('id', user.id.toString());
        formData.append('username', username);
        formData.append('name', name);
        formData.append('lastName', lastName);
        formData.append('email', email);
        formData.append('changePass', changePassword.toString());
        formData.append('changeProfilePicture', changeProfilePicture.toString());
        formData.append('oldPass', oldPass);
        formData.append('newPass', newPass);
        formData.append('gamesLost', user?.gamesLost?.toString() || '');
        formData.append('gamesWon', user?.gamesWon?.toString() || '');
        formData.append('profilePicture', profilePicture || '');

        const response = await fetch('https://localhost:44364/User/UpdateProfile', {
            method: 'PUT',
            body: formData,
            credentials: 'include',
        });
        
        if(response.ok){
            props.setUsername(username);

            if (changeProfilePicture) {
                props.setProfilePic(profilePicturePreview || '');
            }
        }
    }

    return(
        <div className="settings-main">
            <div className="settings-content">
                <div className="settings-title-div">
                    <label className="setting-title">Profile settings</label>
                </div>
                <div className="settings-row">
                    <div className="profile-picture-container">
                        {profilePicturePreview ? (
                            <img src={profilePicturePreview} alt="Profile Preview" className="profile-preview" onClick={clearProfilePicture}/>) : 
                            (<>
                                <label htmlFor="profile-picture" className="profile-picture-label"><i className="bi bi-camera-fill"></i></label>
                                <input type="file" id="profile-picture" onChange={handleFileChange} accept="image/*" className="profile-picture-input" ref={fileInputRef}/>
                            </>)
                        }
                    </div>
                    <div className="settings-username">
                        <label className="settings-label">Username: </label>
                        <input type="text" className="form-control " placeholder="Username" required value={username} onChange={(e) => setUsername(e.target.value)}/>
                    </div>
                </div>
                <div className="settings-row row-name-lastname">
                    <div className="settings-name">
                        <label className="settings-label">Name:</label>
                        <input type="text" className="form-control input-name-lastname" placeholder="Name" required value={name} onChange={(e) => setName(e.target.value)}/>
                    </div>
                    <div className="settings-lastname">
                        <label className="settings-label">Last name: </label>
                        <input type="text" className="form-control input-name-lastname" placeholder="Last name" required value={lastName} onChange={(e) => setLastName(e.target.value)}/>
                    </div>
                </div>
                <div className="settings-row">
                    <label className="settings-label">Email: </label>
                    <input type="text" className="form-control settings-email" placeholder="name@example.com" required value={email} onChange={(e) => setEmail(e.target.value)}/>
                </div>
                <div className="settings-row">
                    <input type="checkbox" value="checkBoxValue" onChange={handleCheckBox}/>
                    <label className="settings-checkBox-lab">Change password</label>
                </div>
                <div className="settings-row">
                    <input type="password" className="form-control settings-input" placeholder="Old password" disabled={!changePassword} value={oldPass} onChange={(e) => setOldPass(e.target.value)}/>
                    <input type="password" className="form-control settings-input" placeholder="New password" disabled={!changePassword} value={newPass} onChange={(e) => setNewPass(e.target.value)}/>
                </div>
                <div className="settings-save">
                    <button className="btn btn-primary" onClick={update}>Save</button>
                </div>
            </div>
        </div>
    )
}

export default Settings