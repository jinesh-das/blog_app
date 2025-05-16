import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { logout } from '../slices/auth/authSlice';
import axios from 'axios';
import { IoPersonOutline } from "react-icons/io5";
import { VscSettings } from "react-icons/vsc";
import { IoIosLogOut } from "react-icons/io";
import { Link } from 'react-router-dom';
const apiUrl = import.meta.env.VITE_API_URL;

const ProfilePopUp = ({ setShowPopup }) => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state?.auth?.user);
    
    
    
    const handleLogOut = async () => {
        try {
            const res = await axios.get(`${apiUrl}/logout`, { withCredentials: true });
            toast.success(res.data.message, {
                position: "top-right",
                autoClose: 2000,
                 hideProgressBar: false, 
                 closeOnClick: false, 
                 draggable: true, 
                 theme: "light",
            });
            setShowPopup(false);

            dispatch(logout());
        } catch (error) {
            console.log(error);

        }
    }

    const handlePopUp = () => {
        setShowPopup(false);
    }




    return (
        <div className='w-[15%] h-[16vh] bg-white absolute top-16 right-5 flex flex-col justify-start rounded-lg shadow-xl z-50'>
            <Link onClick={handlePopUp} to={`/@${user?.username}`} className='text-black hover:text-white hover:bg-black  py-2 rounded-lg cursor-pointer flex gap-3 items-center text-base p-2  transition-all'><IoPersonOutline className='text-xl' /><span>Profile</span></Link>
            <Link onClick={handlePopUp} to={'/profile/edit'}  className='text-black hover:text-white hover:bg-black  py-2 rounded-lg cursor-pointer flex gap-3 items-center text-base p-2 transition-all '><VscSettings className='text-xl' /> <span>Settings</span></Link>
            <div onClick={handleLogOut} className='text-black hover:text-white hover:bg-black  py-2 rounded-lg cursor-pointer flex gap-3 items-center text-base p-2 transition-all '><IoIosLogOut className='text-xl' />
            <span>Log out</span></div>

        </div>
    )
}

export default ProfilePopUp