import React from 'react'
import BlogCards from './BlogCards'

const SavedBlogs = ({ data }) => {
    return (
        <div className='flex flex-col gap-10 p-10'>
            {data?.length > 0 ?
                data?.map((items, index) => <BlogCards key={index} data={items} />)
                : <h1>No saved blogs</h1>
            }
        </div>
    )
}

export default SavedBlogs