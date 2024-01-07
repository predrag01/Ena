import { BrowserRouter, Route, Routes} from 'react-router-dom'
import './App.css'
import Nav from './components/Nav'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'

function App() {

  return (
    <div className="App">
      <BrowserRouter>
      <Nav/>

        <main className='main'>
          <Routes>
            <Route path='/' element={<Home />}/>
            <Route path='/Login' element={<Login />}/>
            <Route path='/Register' element={<Register />}/>
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App
