import  { useEffect, useState } from 'react'
import { RiSunFill } from "react-icons/ri";
import { BiSolidMoon } from "react-icons/bi";

const DarkModeToggle = () => {
    const [isDark, setIsDark] = useState(() => {
        return localStorage.getItem('theme') === 'dark' ||
          (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
      });
    
      useEffect(() => {
        if (isDark) {
          document.documentElement.classList.add('dark');
          localStorage.setItem('theme', 'dark');
        } else {
          document.documentElement.classList.remove('dark');
          localStorage.setItem('theme', 'light');
        }
      }, [isDark]);
    
  return (
    <div  onClick={() => setIsDark(!isDark)} className='text-xl cursor-pointer bg-black text-white p-2 rounded-full dark:bg-white dark:text-black'>
   {isDark ?<RiSunFill />
   : <BiSolidMoon />}
    </div>
  )
}

export default DarkModeToggle