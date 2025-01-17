import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChatContext } from '../context/Context'
import { toast } from 'react-toastify'
import axios from "axios"
const CreateRoom = () => {

    const context = useContext(ChatContext)

    const [inputFile, setinputFile] = useState(null)
    const [selectedImage, setselectedImage] = useState(null)

    const handleChangeFile = (e) => {
        if (!e.target.files[0]) {
            return;
        }
        setinputFile(e.target.files[0])
        setselectedImage(URL.createObjectURL(e.target.files[0]))
    }

    const [createRoom, setcreateRoom] = useState()
    const [createRoomLoading, setcreateRoomLoading] = useState(false)

    const [createRoomInputs, setcreateRoomInputs] = useState({
        roomName: '',
        roomBio: ''
    })

    const handleChangeInput = (e) => {
        setcreateRoomInputs({
            ...createRoomInputs,
            [e.target.name]: e.target.value
        })
    }


    const checkInputs = () => {
        return Object.keys(createRoomInputs).every((key) => {
            return createRoomInputs[key].trim().length > 0;
        });
    };

    const createRoomBtn = async () => {
        setcreateRoomLoading(true)
        if (!checkInputs()) {
            setcreateRoomLoading(false)
            toast.error(`All files required`, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            setcreateRoomInputs({
                roomName: '',
                roomBio: ''
            })
            return
        }
        try {

            const fileUpload = new FormData()
            fileUpload.append("roomName", createRoomInputs.roomName)
            fileUpload.append("roomBio", createRoomInputs.roomBio)
            fileUpload.append("roomProfilePicture", inputFile)

            const res = await axios.post(`${context.REACT_APP_BACKEND_HOST}/room/createRoom`, fileUpload)
            console.log(res.data)
            setcreateRoomLoading(false)
            setcreateRoom(res.data)
            toast.success(`${res.data.message}`, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            setcreateRoomInputs({
                roomName: '',
                roomBio: ''
            })
            setselectedImage(null)
            setinputFile(null)
        } catch (error) {
            setcreateRoomLoading(false)
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
            setcreateRoomInputs({
                roomName: '',
                roomBio: ''
            })
            setselectedImage(null)
            setinputFile(null)
        }
    }

    if (createRoomLoading) {
        return (
            <div className='flex justify-center items-center w-full h-[100vh]' role="status ">
                <svg aria-hidden="true" className="w-[70px] h-[70px] text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                </svg>
            </div>
        )
    } else {
        return (
            <section className="bg-gray-50 dark:bg-gray-900 py-[60px]  w-full h-screen overflow-y-auto relative  top-0 left-0">
                <button className='cursor-pointer absolute top-[50px] right-[50px] text-[28px] text-red-800 hover:text-blue-600 font-semibold transition-all' onClick={context.showCreateRoomBtn} >
                    <i className="fa-solid fa-circle-xmark "></i>
                </button>
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto  lg:py-0">
                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                Create New Room
                            </h1>

                            <div className='flex justify-between ite-center'>
                                <div className=" flex items-center justify-center ">
                                    <label htmlFor="fileInput" className="relative rounded-full w-[100px] h-[100px] overflow-hidden  border-4 border-dashed border-gray-300 cursor-pointer">
                                        {selectedImage ? (
                                            <img src={selectedImage} alt="Selected" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center w-full h-full text-gray-400">
                                                <svg className="w-[30px] h-[30px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                                </svg>
                                                <span className='text-[11px] text-center'>choes room <br /> img</span>
                                            </div>
                                        )}
                                        <input
                                            id="fileInput"
                                            type="file"
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            accept="image/*"
                                            onChange={handleChangeFile}
                                        />
                                    </label>
                                </div>
                                <div>
                                    <label htmlFor="roomName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Room Name</label>
                                    <input value={createRoomInputs.roomName} onChange={handleChangeInput} type="text" name="roomName" id="roomName" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Name" required="" />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="roomBio" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Room Bio</label>
                                <input value={createRoomInputs.roomBio} onChange={handleChangeInput} type="text" name="roomBio" id="roomBio" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Full-Name" required="" />
                            </div>

                            <button onClick={createRoomBtn} type="submit" className="w-full text-white bg-blue-400 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Create New Room</button>
                        </div>
                    </div>
                </div>
            </section>
        )
    }

}

export default CreateRoom