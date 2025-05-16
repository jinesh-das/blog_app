import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { IoMdSave } from 'react-icons/io'
import { TbPhotoEdit } from 'react-icons/tb'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { setUser } from '../slices/auth/authSlice'
const apiUrl = import.meta.env.VITE_API_URL;

const EditProfile = () => {
    const [updateData, setUpdateData] = useState({
        name: '',
        username: '',
        bio: '',
        profilePic: '',
    });

    const [previewImage, setPreviewImage] = useState('');

    const userData = useSelector((sate) => sate?.auth?.user);
    const dispatch = useDispatch();

    const handleEditProfile = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.patch(`${apiUrl}/edit-profile`, updateData,
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            dispatch(setUser(res.data.user));

            toast.success(res.data.message, {
                position: "top-right",
                autoClose: 2000,
                theme: "light",
            })
        } catch (error) {
            toast.error(error?.response?.data?.error, {
                position: "top-right",
                autoClose: 2000,
                theme: "light",
            })
        }
    }

    useEffect(() => {
        setUpdateData({
            name: userData?.name,
            username: userData?.username,
            bio: userData?.bio,
            profilePic: userData?.profilePic,
        })
    }, [])

    return (
        <div className=' w-full h-[90vh] px-40 mt-14'>
            <form onSubmit={handleEditProfile} className='w-full pt-10'>
                <div className='flex justify-between'>
                    <div className='text-3xl font-bold'>
                        <h2>Edit Profile</h2>
                    </div>
                    <div>
                        <button type='submit' className='flex items-center gap-2 bg-black text-white rounded-2xl px-4 py-2 text-base cursor-pointer'><IoMdSave className='text-xl' />Save</button>
                    </div>
                </div>
                <div className='flex gap-10 mt-5'>
                    <div className="w-full h-60 bg-cover bg-center relative bg-[url('https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1500&q=80')]" >
                        <TbPhotoEdit className='text-2xl absolute right-1 top-1 text-white cursor-pointer' />
                        <div className="absolute bottom-[-60px] left-10">
                            <img
                                src={previewImage
                                    ? previewImage
                                    : userData?.profilePic && typeof userData?.profilePic === "string" && userData?.profilePic !== "false"
                                        ? `${apiUrl}/${userData?.profilePic}`
                                        : `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(userData?.name || "User")}`}
                                alt="profile"
                                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                            />
                            <label for='image' className='w-10 h-10 rounded-full flex items-center justify-center absolute bottom-2 -right-1 cursor-pointer text-white bg-black'>
                                <TbPhotoEdit className='text-xl' />
                                <input className='hidden z-100' id='image' accept=".png, .jpg, .jpeg" type="file"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            setUpdateData((prev) => ({ ...prev, profilePic: file }));
                                            setPreviewImage(URL.createObjectURL(file));
                                        }
                                    }}
                                />
                            </label>
                        </div>
                    </div>
                </div>
                <div className='w-full mt-28 flex flex-col gap-5'>
                    <div className='text-2xl font-bold'>
                        <h3>Personal Info</h3>
                    </div>
                    <div className='w-full flex gap-10'>
                        <div className='w-full flex flex-col gap-2'>
                            <label className='text-lg font-semibold' htmlFor="name">Name</label>
                            <input onChange={(e) => setUpdateData({ ...updateData, name: e.target.value })} value={updateData?.name} className='w-full text-lg font-medium px-4 py-2 border-2 rounded-xl placeholder:text-base dark:border-white border-black focus:outline-none' type="text" id='name' placeholder='Name' />
                        </div>
                        <div className='w-full flex flex-col gap-2'>
                            <label className='text-lg font-semibold' htmlFor="username">Username</label>
                            <input onChange={(e) => setUpdateData({ ...updateData, username: e.target.value })} value={updateData.username} className='w-full text-lg font-medium px-4 py-2 border-2 rounded-xl placeholder:text-base dark:border-white border-black focus:outline-none' type="text" id='username' placeholder='Username' />
                        </div>
                        <div className='w-full flex flex-col gap-2'>
                            <label className='text-lg font-semibold' htmlFor="bio">Bio</label>
                            <input onChange={(e) => setUpdateData({ ...updateData, bio: e.target.value })} value={updateData.bio === true ? updateData.bio : ''} className='w-full text-lg font-medium px-4 py-2 border-2 rounded-xl placeholder:text-base dark:border-white border-black focus:outline-none' type="text" id='bio' placeholder='Bio' />
                        </div>
                    </div>

                </div>
            </form>
        </div>
    )
}

export default EditProfile