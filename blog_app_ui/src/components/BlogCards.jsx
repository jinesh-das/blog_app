import moment from 'moment'
import React from 'react'
const apiUrl = import.meta.env.VITE_API_URL;

const BlogCards = ({data}) => {
    const {title,description,image,createdAt, creator:{name} }= data
  return (
    <div className='w-3/4 h-42 flex overflow-hidden hover:shadow-2xl  transition-all'>
     <div className='flex flex-col justify-between gap-3 py-5 px-7 cursor-pointer flex-grow'>
            <div className='flex flex-col gap-3'>
                <h2 className='text-2xl font-bold'>{title}</h2>
                <p className='text-lg font-medium'>{description}</p>
            </div>
            <div className='flex items-center gap-5'>
                <h2 className='font-semibold'>~~ {name}</h2>
                <span>{moment(createdAt).fromNow()}</span>
            </div>
        </div>
        <div className='w-1/3 h-full object-cover overflow-hidden'>
            <img src={`${apiUrl}/${image}`} alt="" />
        </div>
       
    </div>
  )
}

export default BlogCards