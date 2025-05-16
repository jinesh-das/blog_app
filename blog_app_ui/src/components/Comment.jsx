import React, { useEffect, useState } from 'react';
import { TfiClose } from "react-icons/tfi";
import { useDispatch, useSelector } from 'react-redux';
import { addComment, closeComment, newComment } from '../slices/comment/commentSlice';
import axios from 'axios';
import CommentCard from './CommentCard';
const apiUrl = import.meta.env.VITE_API_URL;

const Comment = () => {
    const [comment, setComment] = useState('');
    const dispatch = useDispatch();

    const blogId = useSelector((state) => state?.blog?.selectedBlog?._id);
    const loggedInUserId = useSelector((state) => state?.auth?.user?._id);
    const allComments = useSelector((state) => state?.comment?.comments);

    // ✅ Fetch and transform comments on mount
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await axios.get(`${apiUrl}/comment/${blogId}`, { withCredentials: true });
                
                const transformed = res.data.comments.map(comment => ({
                    ...comment,
                    isLiked: comment.likes.includes(loggedInUserId),
                    likeCount: comment.likes.length
                }));
                dispatch(addComment(transformed));
            } catch (error) {
                console.log("Fetch comments error:", error);
            }
        };

        if (blogId) fetchComments();
    }, [blogId, loggedInUserId, dispatch]);

    const handleComment = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return;
        try {
            const res = await axios.post(`${apiUrl}/comment/${blogId}`, { comment }, { withCredentials: true });
            const created = res.data.comment;
            dispatch(newComment({
                ...created,
                isLiked: created.likes.includes(loggedInUserId),
                likeCount: created.likes.length
            }));
            setComment('');
        } catch (error) {
            console.log("Add comment error:", error);
        }
    };

    return (
        <div className='w-[400px] max-h-screen  absolute top-0 right-0 shadow-2xl transition-all mt-16'>
            <div className='p-5 flex justify-between'>
                <h1 className='text-xl font-semibold'>Comment ({allComments?.length})</h1>
                <TfiClose onClick={() => dispatch(closeComment())} className='text-xl font-semibold cursor-pointer' />
            </div>

            <div className='w-full h-[82vh] flex flex-col gap-3 overflow-y-scroll'>
                {allComments?.map((data, index) => (
                    <CommentCard key={data._id} data={data} index={index} />
                ))}
            </div>

            <form onSubmit={handleComment} className='p-5 w-full absolute bottom-0 flex gap-4'>
                <input
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className='w-full h-12 outline-none border-1 border-black rounded-lg bg-[#f7f5f1] placeholder:text-gray-400 px-2'
                    type="text"
                    placeholder='Write your comment...'
                />
                <button type='submit' className='bg-black text-white dark:text-black dark:bg-white px-4 py-1 rounded-lg cursor-pointer'>Send</button>
            </form>
        </div>
    );
};

export default Comment;
