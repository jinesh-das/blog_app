import React from 'react'
import heroImage from '../assets/heroimage.webp'
import { Link } from 'react-router-dom'


const Home = () => {
    return (
        <div className='w-full h-screen text-black bg-[#F7F4ED]'>
            <div className='w-full h-[90vh] flex justify-between'>
                <div className='w-3/4 h-full flex flex-col gap-10 justify-center px-28 leading-none '>
                    <div className='flex flex-col -gap-5'>
                        <h1 className='text-[15vh] font-normal font-["HeroFont"] tracking-tighter'>Human</h1>
                        <h1 className='text-[15vh] font-normal font-["HeroFont"] tracking-tighter'>stories & ideas</h1>
                    </div>
                    <p className='text-2xl '>A place to read, write, and deepen your understanding</p>
                    <button className='w-[200px] h-[50px] py-3 cursor-pointer bg-black text-white text-xl rounded-3xl'><Link to={'/blog'}>Start reading</Link></button>
                </div>
                <div className='w-1/4 h-full'>
                    <img className='w-full h-full object-center object-cover' src={heroImage} alt="" />
                </div>
            </div>
            <div className='w-full h-[10vh] border-t-[1px] border-t-black'></div>

        </div>
    )
}

export default Home