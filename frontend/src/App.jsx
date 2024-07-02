import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "../page/Home"
import Context from "../context/Context"
import "./index.css"
import Sign from "../page/Sign"
import Register from "../page/Register"
import { ToastContainer } from 'react-toastify';
import axios from "axios"
import JoinRoom from "../components/JoinRoom"
import ChatRoom from "../components/ChatRoom"
import Profile from "../components/Profile"
function App() {

  axios.defaults.withCredentials = true;


  return (

    <BrowserRouter>
      <Context>
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Home />} >
            <Route index={true} element={<JoinRoom />} />
            <Route path="Profile" element={<Profile />} />
            <Route path="ChatRoom/:roomName" element={<ChatRoom />} />
          </Route>
          <Route path="/Sign" element={<Sign />} />
          <Route path="/Register" element={<Register />} />
        </Routes>
      </Context>
    </BrowserRouter>

  )
}

export default App
