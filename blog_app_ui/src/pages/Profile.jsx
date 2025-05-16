import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link, useLocation, useParams } from 'react-router-dom';
import LikedBlogs from '../components/LikedBlogs';
import SavedBlogs from '../components/SavedBlogs';
import ProfileBlogs from '../components/ProfileBlogs';
const apiUrl = import.meta.env.VITE_API_URL;

const Profile = () => {
  const [user, setUser] = useState(null);
  const { username } = useParams();
  const loggedInUser = useSelector((state => state?.auth?.user?._id));
  const location = useLocation();



  const getUser = async () => {
    try {
      const res = await axios.get(`${apiUrl}/user/${username.replace('@', '')}`, { withCredentials: true });
      setUser(res?.data?.user);


    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
  }, [username]);


  return (
    <div className="min-h-screen   font-sans px-30">
      {/* Banner */}
      <div className="w-full h-60 bg-cover bg-center relative bg-[url('https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1500&q=80')]" >
        <div className="absolute bottom-[-9rem] left-10">
          <img
            src={ user?.profilePic && typeof user?.profilePic === "string" && user?.profilePic !== "false"
                ? `${apiUrl}/${user?.profilePic}`
                : `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(user?.name || "User")}`}
            alt="profile"
            className="w-48 h-48 rounded-4xl object-cover border-[10px] dark:border-[#111827]  border-[#F7F4ED]"
          />
        </div>
      </div>

      {/* Profile Info */}
      <div className="max-w-6xl mx-auto px-6 mt-4 ml-60">
        <div className="flex flex-col md:flex-row md:items-center justify-between pr-16 ">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold">{user?.name}</h1>
            <p className="text-gray-500  text-sm">{user?.username}</p>
            <p className=" text-gray-600 font-semibold max-w-2xl">{user?.bio===true?user?.bio:""}</p> 
            <button className="px-6 mt-2 py-2    font-medium rounded-full bg-black dark:bg-white dark:text-black  text-white  cursor-pointer">
              {loggedInUser === user?._id ? <Link to={'/profile/edit'} >Edit Profile</Link> : <span>Follow</span>}
            </button>
          </div>
          <div className="flex  gap-8 mt-4 text-sm text-gray-500">
            <span className='cursor-pointer text-base flex flex-col items-center gap-1'>
              <span className='text-sm'>Posts</span>
              <span className="font-semibold text-black dark:text-white  text-2xl ">
                {user?.blogs?.length || 0}</span>
            </span>
            <span className='cursor-pointer text-base flex flex-col gap-1 items-center'>
              <span className='text-sm'>followers</span>
              <span className="font-semibold text-black dark:text-white text-2xl  ">{user?.followers?.length || 0}</span> </span>
            <span className='cursor-pointer text-base flex flex-col gap-1 items-center'>
              <span className='text-sm'>following</span>
              <span className="font-semibold text-black dark:text-white text-2xl ">{user?.following?.length || 0}</span> </span>
          </div>


        </div>
      </div>

      <div className='mt-20 px-10   '>
        <div className='flex gap-20 font-medium text-lg border-b-2 border-b-gray-300 relative'>
          <Link to={`/${username}`} className={`${location.pathname === `/${username}` ? "border-b-2 border-b-black" : ""} dark:border-b-blue-900 duration-75 transition-all absolute -top-7 left-1`}>
            <h2 className='cursor-pointer '>Blogs</h2>
          </Link>
          {loggedInUser === user?._id && <Link to={`/${username}/liked-blogs`} className={`${location.pathname === `/${username}/liked-blogs` ? "border-b-2 border-b-black" : ""} dark:border-b-blue-900 duration-75 transition-all absolute -top-7 left-26`}>
            <h2 className='cursor-pointer '>Liked</h2>
          </Link>}
          {loggedInUser === user?._id &&
          <Link to={`/${username}/saved-blogs`} className={`${location.pathname === `/${username}/saved-blogs` ? "border-b-2 border-b-black" : ""} dark:border-b-blue-900 duration-75 transition-all absolute -top-7 left-50`}>
            <h2 className='cursor-pointer  '>Saved</h2>
          </Link>}
        </div>
        <div className='mt-10'>
          {location.pathname === `/${username}` && <ProfileBlogs data={user?.blogs} />}
          {loggedInUser === user?._id && location.pathname === `/${username}/liked-blogs` && <LikedBlogs data={user?.likedBlogs} />}
          {loggedInUser === user?._id && location.pathname === `/${username}/saved-blogs` && <SavedBlogs data={user?.savedBlogs} />}
        </div>
      </div>


    </div>
  );
}

export default Profile