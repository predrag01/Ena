import { BrowserRouter, Route, Routes} from 'react-router-dom'
import './App.css'
import Nav from './components/Nav'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import { useEffect, useState } from 'react'

function App() {
  const [username, setUserName] = useState('');
  const [userId, setUserId] = useState(-1);
  

    useEffect(() => {
        (
            async () => {
                const respone = await fetch('https://localhost:44364' + '/User/GetUser', {
                    headers: {'Content-Type': 'application/json'},
                    credentials: 'include',
                    mode: 'cors'
                });
    
                const content = await respone.json();
    
                setUserName(content.username)
                setUserId(content.id)
            }
        )();
    });

  return (
    <div className="App">
      <BrowserRouter>
      <Nav username={username} setUsername={setUserName}/>

        <main className='main'>
          <Routes>
            <Route path='/' element={<Home username={username} userId={userId}/>} />
            <Route path='/Login' element={<Login setUsername={setUserName}/>}/>
            <Route path='/Register' element={<Register />}/>
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App
