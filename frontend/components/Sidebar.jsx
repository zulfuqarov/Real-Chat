import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChatContext } from '../context/Context'
import axios from 'axios'
import { toast } from 'react-toastify'


const Sidebar = () => {

    const context = useContext(ChatContext)
    const navigate = useNavigate()

    const [settingsBar, setsettingsBar] = useState(false)

    const showSettings = () => {
        setsettingsBar(!settingsBar)
    }

    const logout = async () => {
        try {
            const res = await axios.post(`${context.REACT_APP_BACKEND_HOST}/userAuth/Logout`)
            toast.success(`${res.data.message}`, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            })
            window.location.reload();
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
        }
    }


    // All Chat room 
    const [allChatRoom, setallChatRoom] = useState([])

    const allChat = async () => {
        try {
            const res = await axios.get(`${context.REACT_APP_BACKEND_HOST}/room/roomAll`)
            console.log(res.data)
            setallChatRoom(res.data.reverse())
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        allChat()
    }, [])

    const RefreshAllChat = () => {
        allChat()
    }

    return (
        <div className="w-1/4 bg-white border-r border-gray-300 relative">
            {/* header */}
            <header className="p-4 border-b border-gray-300 flex justify-between items-center bg-indigo-600 text-white">
                <h1 className="text-2xl font-semibold">Chat Web</h1>
                <button onClick={RefreshAllChat}>
                    <i className="fa-solid fa-arrows-rotate"></i>
                </button>
                <Link to="/Profile" onClick={showSettings} className="text-sm font-semibold text-white hover:text-gray-900 text-[22px] transition-all"><i className="fa-solid fa-gear"></i></Link>
            </header>
            {
                settingsBar ? <div className='overflow-y-auto h-full w-full p-3 mb-9 pb-20 absolute bg-gray-900 text-white'>
                    <ul className='space-y-4'>
                        <li className=''>
                            <button onClick={logout} className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out'>Logout</button>
                        </li>
                        <li className=''>
                            <Link to='/Profile' onClick={context.showProfile} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out'>Profile</Link>
                        </li>
                        <li className=''>
                            <button onClick={context.showCreateRoomBtn} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out'>Create Room <i className="fa-solid fa-plus"></i></button>
                        </li>
                        <li className=''>
                            <button onClick={context.showAdminsRoomBtn} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out'>Your Created Rooms <i className="fa-solid fa-house"></i></button>
                        </li>
                    </ul>
                </div> : ''
            }


            {/* group  */}
            <div className="overflow-y-auto h-screen p-3 mb-9 pb-20">
                {
                    allChatRoom &&
                    allChatRoom.map((oneMap, index) => (
                        <Link to={`/chatRoom/${oneMap.roomName}`} key={index} className="flex items-center mb-4 cursor-pointer hover:bg-gray-100 p-2 rounded-md">
                            <div className="w-12 h-12 bg-gray-300 rounded-full mr-3">
                                <img src={`${oneMap.roomImage}`} alt="User Avatar" className="w-12 h-12 rounded-full object-cover" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-lg font-semibold">{oneMap.roomName}</h2>
                                <p className="text-gray-600">{oneMap.roomBio}</p>
                            </div>
                        </Link>
                    ))
                }
            </div>
        </div>
    )
}

export default Sidebar