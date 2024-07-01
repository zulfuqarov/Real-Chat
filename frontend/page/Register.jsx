import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useContext } from 'react'
import { ChatContext } from '../context/Context'
import { useNavigate } from 'react-router-dom'
import axios from "axios"

const Register = () => {

    const context = useContext(ChatContext)
    const navigate = useNavigate()

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const [loading, setloading] = useState(false)
    const [inputFile, setinputFile] = useState(null)
    const [selectedImage, setselectedImage] = useState(null)

    const [inputs, setinputs] = useState({
        fullName: "",
        userName: "",
        bio: "",
        email: "",
        password: "",
    })

    const handleChangeInputs = (e) => {
        setinputs({
            ...inputs,
            [e.target.name]: e.target.value,
        })
    }

    const checkInputsLength = () => {
        return Object.keys(inputs).every((key) => inputs[key].length > 0)
    }

    const handleChangeFile = (e) => {
        if (!e.target.files[0]) {
            return;
        }
        setinputFile(e.target.files[0])
        setselectedImage(URL.createObjectURL(e.target.files[0]))
    }

    const register = async () => {
        setloading(true)
        if (checkInputsLength()) {
            if (!emailRegex.test(inputs.email)) {
                setloading(false)
                toast.error("Invalid email", {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                return;
            }
            if (!passwordRegex.test(inputs.password)) {
                setloading(false)

                toast.error("Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                return;
            }
            if (inputs.fullName.length < 4) {
                setloading(false)

                toast.error("Full name must be at least 4 characters long", {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                return;
            }
            if (inputs.userName.length < 4) {
                setloading(false)

                toast.error("Name must be at least 4 characters long", {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                return;
            }
            if (!inputs.bio.length > 10) {
                setloading(false)

                toast.error("Bio must be at least 10 characters long", {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                return;
            }

            const fileUpload = new FormData()

            fileUpload.append("userName", inputs.userName)
            fileUpload.append("fullName", inputs.fullName)
            fileUpload.append("bio", inputs.bio)
            fileUpload.append("email", inputs.email)
            fileUpload.append("password", inputs.password)
            fileUpload.append("profilePicture", inputFile)

            try {
                const res = await axios.post(`${context.REACT_APP_BACKEND_HOST}/userAuth/Register`, fileUpload)
                console.log(res.data)
                setloading(false)
                toast.success(`${res.data.msg}`, {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                if (res.status === 200) {
                    navigate("/Sign")
                }
            } catch (error) {
                setloading(false)
                console.log(error)
                toast.error(`${error.response.data.msg}`, {
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
        else {
            setloading(false)

            toast.error("All fields are required", {
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
            <section className="bg-gray-50 dark:bg-gray-900 py-[60px] h-full">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto  lg:py-0">
                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                Create and account
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
                                                <span className='text-[11px] text-center'>choes profile <br /> img</span>
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
                                    <label htmlFor="userName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your Name</label>
                                    <input onChange={handleChangeInputs} type="text" name="userName" id="userName" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Name" required="" />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="fullName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Full-Name</label>
                                <input onChange={handleChangeInputs} type="text" name="fullName" id="fullName" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Full-Name" required="" />
                            </div>
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                                <input onChange={handleChangeInputs} type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required="" />
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                <input onChange={handleChangeInputs} type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
                            </div>
                            <div>

                                <label htmlFor="bio" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your bio</label>
                                <textarea onChange={handleChangeInputs} name='bio' id="bio" rows="4" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Write your bio..."></textarea>

                            </div>


                            <button onClick={register} type="submit" className="w-full text-white bg-blue-400 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Create an account</button>
                            <p className="text-sm font-light text-red-500 dark:text-red-400">
                                Already have an account? <Link to="/Sign" className="font-medium text-blue-600 hover:underline dark:text-blue-500">Login here</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}

export default Register