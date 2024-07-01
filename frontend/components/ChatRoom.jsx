import React, { useState, useEffect, useRef, useContext } from 'react'
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';
import { ChatContext } from '../context/Context';
import { useLocation, useParams } from 'react-router-dom';
import axios from "axios"
const ChatRoom = () => {

    const context = useContext(ChatContext)

    const location = useLocation()
    const { roomName } = useParams()

    const [socket, setsocket] = useState(null)
    const messagesEndRef = useRef(null);

    const [sendingUserMessage, setsendingUserMessage] = useState([])

    const [roomData, setroomData] = useState(null)
    const [roomMessage, setroomMessage] = useState()
    const [enteredRoom, setenteredRoom] = useState(null)

    const [loading, setloading] = useState(null)

    const getRomm = async () => {
        setloading(true)
        try {
            const res = await axios.get(`${context.REACT_APP_BACKEND_HOST}/room/roomCheckUser/${roomName}`)
            setroomData(res.data.room)
            console.log(res.data)
            setenteredRoom(true)
            toast.success(res.data.message)
            const socket = io.connect('http://localhost:2222');
            setsocket(socket)

            socket.emit("joinRoom", res.data.room.roomName, context.userProfile.fullName)

            const resMessage = await axios.get(`${context.REACT_APP_BACKEND_HOST}/room/roomMessage/${res.data.room._id}`)
            setroomMessage(resMessage.data.roomMessage)
            setloading(false)
        } catch (error) {
            console.log(error.response.data.message)
            toast.error(error.response.data.message)
            setenteredRoom(false)
            setloading(false)

        }
    }


    useEffect(() => {
        getRomm()
    }, [location.pathname])

    useEffect(() => {
        if (socket) {
            socket.on("sendMessage", (data) => {
                setsendingUserMessage(prevMessages => [
                    ...prevMessages,
                    {
                        message: data.message,
                        sender: data.userData,
                        date: new Date()
                    }
                ])
                console.log(data)
            })
        }
        return () => {
            if (socket) {
                socket.off("sendMessage")
            }
        }
    }, [socket])

    const [messageInput, setmessageInput] = useState('')
    const handleChangeInput = (e) => {
        setmessageInput(e.target.value)
    }

    const sendMessage = async () => {
        if (socket) {
            if (messageInput.trim() !== '') {
                socket.emit('acceptMessage', roomData.roomName, {
                    message: messageInput,
                    userData: context.userProfile
                })
                setmessageInput('')
                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

                const res = await axios.post(`${context.REACT_APP_BACKEND_HOST}/room/roomMessage/${roomData._id}`, {
                    content: messageInput
                })
            } else {
                toast.error('Please enter a message')
            }
        }
    }

    const enterRoom = async () => {
        try {
            const res = await axios.put(`${context.REACT_APP_BACKEND_HOST}/room/roomEnter/${roomName}`)
            console.log(res.data.message)
            getRomm()
        } catch (error) {
            console.log(error)
            toast.error(`${error.response.data.message}`)
        }
    }

    const leavRoom = async () => {
        try {
            const res = await axios.put(`${context.REACT_APP_BACKEND_HOST}/room/roomLeav/${roomName}`)
            console.log(res.data.message)
            getRomm()
        } catch (error) {
            console.log(error)
            toast.error(`${error.response.data.message}`)
        }
    }

    if (loading) {
        return (
            <div className='flex justify-center items-center w-full h-[100vh]' role="status ">
                <svg aria-hidden="true" className="w-[70px] h-[70px] text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                </svg>
            </div>
        )
    }
    else {
        return (
            <div className="flex-1 ">
                <div>
                    <header className="bg-white p-4 text-gray-700">
                        <h1 className="text-2xl font-semibold">{roomName}</h1>
                        {
                            enteredRoom ? <button onClick={leavRoom}>leav room</button> : <button onClick={enterRoom}>enter</button>
                        }
                    </header>
                    {
                        enteredRoom ? <div className="h-screen overflow-y-auto p-4 pb-36 ">



                            {
                                roomMessage &&
                                roomMessage.map((oneMap, index) => (
                                    <div key={index} className={`flex ${oneMap.senderId._id === context.userProfile._id ? 'justify-end' : ''}  mb-4 cursor-pointer`}>
                                        {
                                            oneMap.senderId._id !== context.userProfile._id ?
                                                <div className="w-9 h-9 rounded-full flex items-center justify-center mr-2">
                                                    <img src={oneMap.senderId.profilePicture} alt="User Avatar" className="w-8 h-8 rounded-full" />
                                                </div> : ''
                                        }
                                        <div className="flex max-w-96 bg-indigo-500 text-white rounded-lg p-3 gap-3">
                                            <p>{oneMap.content}</p>
                                        </div>
                                        {
                                            oneMap.senderId._id === context.userProfile._id ?
                                                <div className="w-9 h-9 rounded-full flex items-center justify-center ml-2">
                                                    <img src={oneMap.senderId.profilePicture} alt="My Avatar" className="w-8 h-8 rounded-full" />
                                                </div> : ''
                                        }
                                    </div>
                                ))
                            }


                            {
                                sendingUserMessage &&
                                sendingUserMessage.sort((a, b) => new Date(a.date) - new Date(b.date)).map((oneMap, index) => (
                                    <div key={index} className={`flex ${oneMap.sender._id === context.userProfile._id ? 'justify-end' : ''}  mb-4 cursor-pointer`}>
                                        {
                                            oneMap.sender._id !== context.userProfile._id ?
                                                <div className="w-9 h-9 rounded-full flex items-center justify-center mr-2">
                                                    <img src={oneMap.sender.profilePicture} alt="User Avatar" className="w-8 h-8 rounded-full" />
                                                </div> : ''
                                        }
                                        <div className="flex max-w-96 bg-indigo-500 text-white rounded-lg p-3 gap-3">
                                            <p>{oneMap.message}</p>
                                        </div>
                                        {
                                            oneMap.sender._id === context.userProfile._id ?
                                                <div className="w-9 h-9 rounded-full flex items-center justify-center ml-2">
                                                    <img src={oneMap.sender.profilePicture} alt="My Avatar" className="w-8 h-8 rounded-full" />
                                                </div> : ''
                                        }
                                    </div>
                                ))
                            }

                            <div ref={messagesEndRef}></div>

                            <footer className="bg-white border-t border-gray-300 p-4 fixed bottom-0 w-3/4">
                                <div className="flex items-center">
                                    <input onChange={handleChangeInput} value={messageInput} type="text" placeholder="Type a message..." className="w-full p-2 rounded-md border border-gray-400 focus:outline-none focus:border-blue-500" />
                                    <button onClick={sendMessage} className="bg-indigo-500 text-white px-4 py-2 rounded-md ml-2">Send</button>
                                </div>
                            </footer>
                        </div> : ''
                    }

                </div>
            </div >
        )
    }
}

export default ChatRoom