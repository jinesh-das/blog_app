import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import BlogCards from '../components/BlogCards'
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setSelectedBlog } from '../slices/blog/selectBlogSlice';
import { RiSearchLine } from 'react-icons/ri';
import Card from '../components/Card';
import { RxCross1 } from "react-icons/rx";
const apiUrl = import.meta.env.VITE_API_URL;

const Blogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [searchData, setSearchData] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const dispatch = useDispatch()

    const getAllBlogs = async (page = 1) => {
        const params = { page, limit: 5 };
        try {
            const res = await axios.get(`${apiUrl}/blogs`, { params });
            setBlogs(res.data.blogs);
            setTotalPages(res.data.totalPages);
        } catch (error) {
            console.log(error);
        }
    };

    const handleSearch = async () => {

        try {
            const res = await axios.get(`${apiUrl}/search?search=${searchData}`);
            setBlogs(res.data.blogs);

        } catch (error) {
            console.log(error);

        }

    }
    useEffect(() => {
        if (searchData.trim() !== '') {
            handleSearch();
        } else {
            getAllBlogs(currentPage); // this will now work properly
        }
    }, [searchData, currentPage]);

    return (
        <div className='w-full min-h-screen mt-14 flex flex-col gap-32'>
            <div className='w-full  flex fixed justify-center pt-10 dark:bg-[#111827] bg-[#F7F4ED] text-black'>
                <div className='relative w-3/5 flex items-center gap-2'>
                    <input value={searchData} onChange={(e) => setSearchData(e.target.value)} className='w-full h-14 text-base font-medium px-4 py-1 rounded-4xl bg-slate-200 focus:outline-black pl-12' type="text" />
                    <RiSearchLine className='text-xl absolute left-4' />
                    {searchData && <RxCross1 onClick={() => setSearchData('')} className='text-xl absolute right-5 cursor-pointer' />}
                </div>
            </div>

            <div className='w-full px-52 min-h-[60vh] flex flex-col mt-10  p-18 gap-16'>
                {
                    blogs?.map((blogs) => <Link className='flex justify-center' onClick={() => dispatch(setSelectedBlog(blogs))} key={blogs._id} to={`/readblog/${blogs._id}`}><BlogCards data={blogs} /></Link>)
                }

            </div>
            <div className="flex justify-center items-center gap-4 pb-12">
                <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    className="px-4 py-2 bg-black text-white rounded disabled:opacity-50 cursor-pointer"
                >
                    Previous 
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    className="px-4 py-2 bg-black text-white rounded disabled:opacity-50 cursor-pointer"
                >
                    Next
                </button>
            </div>
        </div>
    )
}

export default Blogs