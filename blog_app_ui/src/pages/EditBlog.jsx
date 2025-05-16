import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import Navbar from '../components/Navbar';
import { LuImagePlus } from 'react-icons/lu';
import { useParams } from 'react-router-dom';
import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;

const EditBlog = () => {
    const [updatedBlog, setUpdatedBlog] = useState({
        title: '',
        description: '',
        image: ''
    });
    const { id } = useParams();

    const handleUpdateBlog = async (e) => {
        e.preventDefault();
    
        const formData = new FormData();
        formData.append('title', updatedBlog.title);
        formData.append('description', updatedBlog.description);
    
        // Only add image if it's a File (not already uploaded string path)
        if (updatedBlog.image && typeof updatedBlog.image !== 'string') {
            formData.append('image', updatedBlog.image);
        }
    
        try {
            const res = await axios.put(
                `${apiUrl}/update/${id}`,
                formData,
                {
                  withCredentials: true,
                  headers: {
                    'Content-Type': 'multipart/form-data',
                  },
                }
              );
           
    
            toast.success(res.data.message, {
                position: "top-right",
                autoClose: 2000,
                theme: "light",
            });
    
        } catch (err) {
            
            toast.error(err?.response?.data?.error || "Something went wrong", {
                position: "top-right",
                autoClose: 2000,
                theme: "light",
            });
        }
    };
    const getBlogs = async () => {
        try {
            const res = await axios.get(`${apiUrl}/blogs/${id}`);
            const blog = res.data.blog;
            // setBlogData(blog);
            setUpdatedBlog({
                title: blog.title,
                description: blog.description,
                image: blog.image
            });
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        if (id) {
            getBlogs();
        }
    }, [id]);

    return (
        <div className='w-full min-h-screen flex-col bg-[#F7F4ED] flex items-center justify-center'>
            
            <div className='w-[50vw] min-h-[80vh] flex flex-col gap-10 p-10 rounded-xl '>
                <div className='text-center text-2xl font-semibold'>
                    <h2>Edit Blog</h2>
                </div>
                <form className='flex flex-col gap-8' onSubmit={handleUpdateBlog}>
                    <div className='flex flex-col gap-2'>
                        <label className='text-lg font-medium' htmlFor="title">Title</label>
                        <input
                            value={updatedBlog.title}
                            onChange={(e) =>
                                setUpdatedBlog({ ...updatedBlog, title: e.target.value })
                            }
                            className='text-lg p-2 border-2 rounded-xl focus:outline-none'
                            type="text"
                            name="title"
                            id="title"
                            placeholder='Enter the title of your blog'
                        />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label className='text-lg font-medium' htmlFor="description">Description</label>
                        <textarea
                            value={updatedBlog.description}
                            onChange={(e) =>
                                setUpdatedBlog({ ...updatedBlog, description: e.target.value })
                            }
                            className='text-lg p-2 border-2 rounded-xl focus:outline-none'
                            name="description"
                            id="description"
                        ></textarea>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label
                            className={`flex items-center justify-center overflow-hidden gap-2 border-2 border-dashed min-w-32 ${updatedBlog.image ? 'py-0' : 'py-8'} rounded-xl`}
                            htmlFor="image"
                        >
                            {updatedBlog.image ? (
                                <img
                                    src={
                                        typeof updatedBlog.image === 'string'
                                            ? `http://localhost:3000/${updatedBlog.image}`
                                            : URL.createObjectURL(updatedBlog.image)
                                    }
                                    alt="Selected"
                                    className="w-full h-auto object-cover max-h-64"
                                />
                            ) : (
                                <div className='flex flex-col gap-2'>
                                    <div className='flex gap-2 bg-black text-white text-lg items-center justify-center rounded-xl px-5 py-3'>
                                        <LuImagePlus />
                                        <span>Upload Image</span>
                                    </div>
                                    <p className='text-base text-center'>or</p>
                                    <p className='text-lg font-medium text-center'>Drag and drop </p>
                                </div>
                            )}
                            <input
                                onChange={(e) =>
                                    setUpdatedBlog({ ...updatedBlog, image: e.target.files[0] })
                                }
                                className='hidden'
                                accept=".png, .jpg, .jpeg"
                                type="file"
                                name="image"
                                id="image"
                            />
                        </label>
                    </div>
                    <div className='w-full'>
                        <button
                            type='submit'
                            className='text-lg w-full cursor-pointer bg-black text-white py-3 rounded-3xl'
                        >
                            Edit blog
                        </button>
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
    );
};

export default EditBlog;
