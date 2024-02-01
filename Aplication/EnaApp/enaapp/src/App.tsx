import { BrowserRouter, Route, Routes} from 'react-router-dom'
import './App.css'
import Nav from './components/Nav'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import { useEffect, useState } from 'react'
import Chat from './pages/Chat'
import FriendRequests from './pages/FriendRequests'
import Settings from './pages/Settings'

function App() {
  const [profileImg, setProfileImg] = useState('');
  const [username, setUserName] = useState('');
  const [userId, setUserId] = useState(-1);
  const [gamesWon, setGamesWon] = useState(0);
  const [gamesLost, setGamesLost] = useState(0);
  

    useEffect(() => {
        (
            async () => {
                const respone = await fetch('https://localhost:44364' + '/User/GetUser', {
                    headers: {'Content-Type': 'application/json'},
                    credentials: 'include',
                    mode: 'cors'
                });
    
                const content = await respone.json();         
                
                setProfileImg(content.profilePicture);
                setUserName(content.username);
                setUserId(content.id);
                setGamesWon(content.gamesWon);
                setGamesLost(content.gamesLost);
            }
        )();
    });

  return (
    <div className="App">
      <BrowserRouter>
        <Nav username={username} setUsername={setUserName} userId={userId} setUserId={setUserId} profileImg={profileImg} gamesLost={gamesLost} gamesWon={gamesWon}/>

        <main className='main'>
          <Routes>
            <Route path='/' element={<Home username={username} userId={userId}/>} />
            <Route path='/Login' element={<Login setUsername={setUserName}/>}/>
            <Route path='/Register' element={<Register />}/>
            <Route path='/Chat' element={<Chat />}/>
            <Route path='/FriendRequests' element={<FriendRequests username={username} />}/>
            <Route path='/Settings' element={<Settings setUsername={setUserName} setProfilePic={setProfileImg}/>}/>
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App
