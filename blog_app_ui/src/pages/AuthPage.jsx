import axios from 'axios'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { setUser } from '../slices/auth/authSlice'
import { HiOutlineMail } from "react-icons/hi";
import { TbLockPassword } from "react-icons/tb";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import { FaRegUser } from "react-icons/fa";
const apiUrl = import.meta.env.VITE_API_URL;
    
const AuthPage = ({ type }) => {
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    })
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.post(`${apiUrl}/${type}`, formData,
                { withCredentials: true });
            if (type === 'login') dispatch(setUser(res?.data?.user));
            toast.success(res?.data?.message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",

            });

            navigate("/");

        } catch (err) {
            console.log(err);
            toast.error(err?.response?.data?.error, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",

            });
        }
    }

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    }


    return (
        <div className='w-full  h-screen  flex justify-center items-center'>
            <form onSubmit={(e) => handleSubmit(e)} className='w-1/3  flex flex-col gap-10 border-[1px] border-black rounded-2xl px-18 py-9'>
                <div>
                    <h2 className='text-3xl font-bold text-center'>{type === "signup" ? "Sign up" : "Log in"}</h2>
                </div>
                <div className='flex flex-col gap-5 '>
                    {type === "signup" && <div className='flex flex-col gap2'>
                        <label className='text-lg' htmlFor="">Name</label>

                        <div className='relative'>
                            <FaRegUser className='absolute top-3 left-3 text-xl dark:text-black' />
                            <input onChange={(e) => setFormData({ ...formData, name: e.target.value })} className='w-full text-lg font-medium p-2 focus:outline-0 border-2 border-black rounded-xl pl-12 bg-amber-100 dark:text-black' type="text" />
                        </div>
                    </div>}
                    <div className='flex flex-col gap2'>
                        <label className='text-lg' htmlFor="">Email</label>
                        <div className='relative '>
                            <HiOutlineMail className='absolute top-3 left-3 text-2xl dark:text-black'/>
                            <input onChange={(e) => setFormData({ ...formData, email: e.target.value })} className='w-full text-lg font-medium p-2 focus:outline-0 border-2 border-black rounded-xl pl-12 bg-amber-100 dark:text-black' type="email" />
                        </div>
                    </div>
                    <div className='flex flex-col gap2'>
                        <label className='text-lg' htmlFor="">Password</label>
                        <div className='relative'>
                            <TbLockPassword className='absolute top-3 left-3 text-2xl dark:text-black'/>
                            <input onChange={(e) => setFormData({ ...formData, password: e.target.value })} className='w-full text-lg font-medium p-2 focus:outline-0 border-2 border-black rounded-xl pl-12 bg-amber-100 dark:text-black' type={showPassword ? "text" : "password"} />
                            {showPassword?<LuEye onClick={handleTogglePassword} className='absolute top-3 right-3 text-2xl cursor-pointer dark:text-black'/>
                            :<LuEyeClosed onClick={handleTogglePassword} className='absolute top-3 right-3 text-2xl cursor-pointer dark:text-black'/>}
                        </div>
                    </div>

                </div>
                <div className='flex flex-col gap-5 w-full items-center justify-center'>
                    <button type='submit' className='w-full py-3 cursor-pointer  bg-black text-white text-xl rounded-3xl'>{type === 'signup' ? 'Sign up' : 'Log in'}</button>
                    <div className='w-full flex  items-start pl-5'>
                        {type === 'signup' ? <p className='text-base'>Already have an account? <Link to={'/login'} className='font-semibold' >Log in</Link></p>
                            : <p className='text-base'>Don't have an account? <Link to={'/signup'} className='font-semibold' >Sign up</Link></p>}
                    </div>
                </div>
            </form>


        </div>
    )
}

export default AuthPage