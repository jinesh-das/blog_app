import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import ProfilePopUp from "./ProfilePopUp";
import DarkModeToggle from "./DarkModeToggle";
const apiUrl = import.meta.env.VITE_API_URL;

const Navbar = () => {
  const [showPopup, setShowPopup] = useState(false);
  const user = useSelector((state) => state?.auth?.user);

  const location = useLocation();
  const isHome = location.pathname === "/";

 


  return (
    <div
      className={`w-full h-[10vh]  ${isHome ? "dark:bg-[#F7F4ED] dark:text-black" : "dark:bg-[#1F2937] dark:text-white"
        }text-black bg-[#F7F4ED] border-b border-black/10 flex justify-between items-center px-28 fixed top-0 z-50 transition-colors duration-300`}
    >
      <div className={`${isHome ? "bg-[#F7F4ED] text-black" : "dark:bg-[#1F2937] dark:text-white"
        } text-black w-1/2 flex items-center gap-10 `}>
        <Link to={"/"} className='font-["HeroFont"] text-3xl font-bold'>
          Blogs
        </Link>
      </div>
      <div className={`${isHome ? "bg-[#F7F4ED] text-black" : "dark:bg-[#1F2937] dark:text-white"
        } flex items-center gap-10`}>
        <h3 className="cursor-pointer">
          <Link to={user?._id ? "/createblog" : "/login"}>Write</Link>
        </h3>
        {!user && (
          <Link to={"/signup"} className="cursor-pointer">
            Sign Up
          </Link>
        )}
        <button
          className={`  
            ${isHome ? "bg-black text-white" : "dark:bg-white text-black"
            }
           bg-black dark:bg-white dark:text-black text-sm text-white py-2 px-4 rounded-4xl tracking-tighter `}
        >
          Get started
        </button>
        {user && (
          <div
            onClick={() => setShowPopup(!showPopup)}
            className="w-10 h-10 overflow-hidden rounded-full cursor-pointer"
          >
            <img
              src={
                user?.profilePic && typeof user.profilePic === "string" && user.profilePic !== "false"
                  ? `${apiUrl}/${user.profilePic}`
                  : `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(user?.name || "User")}`
              }
              alt=""
            />
          </div>
        )}
        <DarkModeToggle />
      </div>
      {showPopup && <ProfilePopUp setShowPopup={setShowPopup} />}
    </div>
  );
};

export default Navbar;
