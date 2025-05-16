import React from 'react'
import { GoArrowRight } from "react-icons/go";

const Card = () => {
    return (
       <div className='w-1/4 ml-10 mt-10 '>
        <div className='w-full bg-[url(https://images.unsplash.com/photo-1746457256184-9a93292b1765?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)] bg-cover bg-center h-60  overflow-hidden  rounded-xl'>
          <div className='bg-[#F7F4ED] text-black border-b-8 inline-block border-r-8 border-[#F7F4ED] rounded-br-xl relative before:absolute before:-bottom-6 before:left-0 before:content-[""] before:rounded-tl-xl shadow-lg  before:w-4 before:h-4 before:bg-transparent before:shadow-[-0.375rem_-0.375rem_#F7F4ED] after:absolute after:-right-6 after:top-0 after:content-[""] after:rounded-tl-xl after:w-4 after:h-4 after:bg-transparent after:shadow-[-0.375rem_-0.375rem_#F7F4ED] '> <button className='border-2 border-black py-2 ml-1 px-4 rounded-xl flex items-center gap-2 text-base'>Read Article <GoArrowRight className='text-xl'/></button> </div>
        </div>

       </div>
      );
} 

export default Card