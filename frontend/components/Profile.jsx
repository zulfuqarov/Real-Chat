import React from 'react'
import CreateRoom from './CreateRoom'
import { useContext } from 'react'
import { ChatContext } from '../context/Context'
import AdminsRoom from './AdminsRoom'
const ChatWindow = () => {

    const context = useContext(ChatContext)


    if (context.showCreateRoom) {
        return (
            <div className="flex-1 ">
                <CreateRoom />
            </div>
        )
    }
    if (context.showAdminsRoom) {
        return (
            <div className="flex-1 ">
                <AdminsRoom />
            </div>
        )
    }

    return (
        <h1>Profile</h1>
    )
}

export default ChatWindow