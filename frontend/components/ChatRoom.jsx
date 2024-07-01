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
    const [enteredRoom,setenteredRoom] = useState(null)
    const getRomm = async () => {
        try {
            const res = await axios.get(`${context.REACT_APP_BACKEND_HOST}/room/roomCheckUser/${roomName}`)
            setroomData(res.data.room)
            console.log(res.data.message)
            setenteredRoom(true)
            toast.success(res.data.message)
            const socket = io.connect('http://localhost:2222');
            setsocket(socket)

            socket.emit("joinRoom", res.data.roomName, context.userProfile.fullName)

            const resMessage = await axios.get(`${context.REACT_APP_BACKEND_HOST}/room/roomMessage/${res.data._id}`)
            setroomMessage(resMessage.data.roomMessage)
        } catch (error) {
            console.log(error.response.data.message)
            toast.error(error.response.data.message)
            setenteredRoom(false)
        }
    }


    // const checkRoomUser = async () => {
    //     try {
    //         const res = await axios.get(`${context.REACT_APP_BACKEND_HOST}/room/roomCheckUser/${roomName}`)
    //         console.log(res.data.message)
    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

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



    return (
        <div className="flex-1 ">
            <div>
                <header className="bg-white p-4 text-gray-700">
                    <h1 className="text-2xl font-semibold">Alice</h1>
                </header>
                <div className="h-screen overflow-y-auto p-4 pb-36 ">

                    {
                        roomMessage &&
                        roomMessage.map((oneMap, index) => (
                            <div key={index} className={`flex ${oneMap.senderId._id === context.userProfile._id ? 'justify-end' : ''}  mb-4 cursor-pointer`}>
                                {
                                    oneMap.senderId._id !== context.userProfile._id ?
                                        <div className="w-9 h-9 rounded-full flex items-center justify-center mr-2">
                                            <img src="https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato" alt="User Avatar" className="w-8 h-8 rounded-full" />
                                        </div> : ''
                                }
                                <div className="flex max-w-96 bg-indigo-500 text-white rounded-lg p-3 gap-3">
                                    <p>{oneMap.content}</p>
                                </div>
                                {
                                    oneMap.senderId._id === context.userProfile._id ?
                                        <div className="w-9 h-9 rounded-full flex items-center justify-center ml-2">
                                            <img src="https://placehold.co/200x/b7a8ff/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato" alt="My Avatar" className="w-8 h-8 rounded-full" />
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
                </div>
            </div>
        </div >
    )
}

export default ChatRoom