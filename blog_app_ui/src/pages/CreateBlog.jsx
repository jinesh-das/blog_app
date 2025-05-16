import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { LuImagePlus } from 'react-icons/lu'
import { toast, ToastContainer } from 'react-toastify';
import Navbar from '../components/Navbar';
import { useParams } from 'react-router-dom';
const apiUrl = import.meta.env.VITE_API_URL;

const CreateBlog = () => {
    const {id}=useParams();

    const [blogData, setBlogData] = useState({
        title: '',
        description: '',
        image: ''
    });


    const handleBlogData = async (e) => {
        e.preventDefault();
    
        const formData = new FormData();
        formData.append('title', blogData.title);
        formData.append('description', blogData.description);
        formData.append('image', blogData.image);
    
        try {
            const res = await axios.post(`${apiUrl}/create`, formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
    
            toast.success(res.data.message, {
                position: "top-right",
                autoClose: 2000,
                theme: "light",
            });
    
            setBlogData({ title: '', description: '', image: '' });
    
        } catch (err) {
            toast.error(err?.response?.data?.error || "Something went wrong", {
                position: "top-right",
                autoClose: 2000,
                theme: "light",
            });
           
        }
    };
    


    useEffect(()=>{
        if(id){
            getBlogs();
        }
    },[id])



    return (
        <div className='w-full min-h-screen flex-col mt-10 flex items-center justify-center'>
            
            <div className='w-[50vw] min-h-[80vh] flex flex-col gap-10 p-10 rounded-xl '>
                <div className='text-center text-2xl font-semibold'>
                    <h2>{id?'Edit Blog':'Create Blog'}</h2>
                </div>
                <form className='flex flex-col gap-8' onSubmit={ handleBlogData}>
                    <div className='flex flex-col gap-2'>
                        <label className='text-lg font-medium' htmlFor="title">Title</label>
                        <input value={blogData.title} onChange={(e) => setBlogData({ ...blogData, title: e.target.value })} className='text-lg p-2 border-2 rounded-xl focus:outline-none' type="text" name="title" id="title" placeholder='Enter the title of your blog' />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label className='text-lg font-medium' htmlFor="description">Description</label>
                        <textarea value={blogData.description} onChange={(e) => setBlogData({ ...blogData, description: e.target.value })} className='text-lg p-2 border-2 rounded-xl focus:outline-none' name="description" id="description"></textarea>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label className={`flex items-center justify-center overflow-hidden gap-2 border-2 border-dashed min-w-32 ${blogData.image ? 'py-0':'py-8' }  rounded-xl`} htmlFor="image">
                            {blogData.image ?
                               <img src={ typeof(blogData.image)==='string' ? `http://localhost:3000/${blogData.image}` : URL.createObjectURL(blogData.image)} alt="" /> :
                                <div className='flex flex-col gap-2'>
                                    <div className='flex gap-2 bg-black text-white text-lg items-center justify-center rounded-xl px-5 py-3'>
                                        <LuImagePlus />
                                        <span>Upload Image</span>
                                    </div>
                                    <p className='text-base text-center'>or</p>
                                    <p className='text-lg font-medium text-center'>Drag and drop </p>
                                </div>
                            }
                            <input onChange={(e) => setBlogData({ ...blogData, image: e.target.files[0] })} className='hidden' accept=".png, .jpg, .jpeg" type="file" name="image" id="image" />
                        </label>
                    </div>
                    <div className='w-full'>
                        <button type='submit' className='text-lg w-full cursor-pointer bg-black text-white py-3 rounded-3xl'>{id?'Edit blog':'Add blog'}</button>
                    </div>
                </form>
            </div>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />

        </div>
    )
}

export default CreateBlog