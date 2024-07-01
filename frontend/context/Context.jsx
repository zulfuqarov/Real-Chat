import React, { useState, useEffect } from 'react'
import { createContext } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios'
// env start
const env = import.meta.env
const { REACT_APP_BACKEND_HOST } = env


export const ChatContext = createContext()

const Context = ({ children }) => {

    const navigate = useNavigate()
    const loaction = useLocation()

    const [userProfile, setuserProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const checkUser = async () => {
        try {
            const res = await axios.get(`${REACT_APP_BACKEND_HOST}/userAuth/checkUser`)
            console.log(res.data.user)
            setuserProfile(res.data.user)
            setLoading(false)
            if (loaction.pathname !== "/") {
                navigate("/")
            }
        } catch (error) {
            console.log(error)
            toast.error(`${error.response.data.message}`, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            setLoading(false)
            navigate("/Sign")
        }
    }

    useEffect(() => {
        checkUser()
    }, [])


    // All Chat Room Profile

    const [showCreateRoom, setshowCreateRoom] = useState(false)
    const [showAdminsRoom, setshowAdminsRoom] = useState(false)

    const showCreateRoomBtn = () => {
        setshowCreateRoom(!showCreateRoom)
        setshowAdminsRoom(false)
    }


    // Admins Room Profile
    const showAdminsRoomBtn = () => {
        setshowAdminsRoom(!showAdminsRoom)
        setshowCreateRoom(false)
    }


    const showProfile = ()=>{
        setshowCreateRoom(false)
        setshowAdminsRoom(false)
    }


    return (
        <ChatContext.Provider
            value={{
                REACT_APP_BACKEND_HOST,
                loading,
                checkUser,
                userProfile,
                // create room
                showCreateRoom,
                showCreateRoomBtn,
                // Admins Room
                showAdminsRoom,
                showProfile,
                showAdminsRoomBtn
            }}
        >
            {children}
        </ChatContext.Provider>
    )
}

export default Context