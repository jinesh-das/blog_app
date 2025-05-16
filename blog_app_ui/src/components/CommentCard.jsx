import { getTimeAgo } from "../utils/converToDate";
import { BsThreeDotsVertical } from "react-icons/bs";
import React, { useState } from 'react';
import { FaHeart, FaRegCommentAlt, FaRegHeart } from 'react-icons/fa';
import axios from 'axios';
import { useDispatch, useSelector } from "react-redux";
import { deleteComment, updateCommentLike } from "../slices/comment/commentSlice";
const apiUrl = import.meta.env.VITE_API_URL;



const CommentCard = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [reply, setReply] = useState('');
  const dispatch = useDispatch();
  const loggedInUser = useSelector((state => state?.auth?.user?._id));
  const commentFromRedux = useSelector(state =>
    state.comment.comments.find(c => c._id === data._id)
  );

  const blogId = useSelector(state => state?.blog?.selectedBlog?._id);



  const {
    comment,
    createdAt,
    user: { name, profilePic },
    _id,
    isLiked,
    likeCount

  } = commentFromRedux || data;




  const handleDelete = async () => {
    try {
      const res = await axios.delete(`${apiUrl}/comment/${_id}`, { withCredentials: true });
      dispatch(deleteComment(res.data.comment._id));
    } catch (error) {
      console.log(error);
    }
  };

  const handleLike = async () => {
    try {
      const res = await axios.patch(`${apiUrl}/comment/like/${_id}`, {}, { withCredentials: true });

      // Dispatch to Redux
      const updatedComment = res.data.updatedComment;
      dispatch(updateCommentLike({
        commentId: updatedComment._id,
        isLiked: updatedComment.likes.includes(loggedInUser),
        likeCount: updatedComment.likes.length
      }));
    } catch (error) {
      console.log(error);
    }
  }

  const handleCommentSettings = () => {
    setIsOpen(_id);
    if (isOpen === _id) {
      setIsOpen(false);
    }
  }

  const handleReplyBox = (_id) => {
    setIsReplyOpen((prev) => prev === _id ? null : _id);
    // console.log(isReplyOpen);

  }

  const handleReply = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post(`${apiUrl}/comment/${blogId}/${_id}`, { reply }, { withCredentials: true });


    } catch (error) {
      console.log(error);
    }
  }





  return (
    <div className='w-full flex flex-col p-5 gap-2'>
      <div className='flex w-full items-center justify-between'>
        <div className='flex items-center gap-2'>
          <div className='w-8 h-8 rounded-full overflow-hidden object-cover object-center'>
            <img src={
              profilePic && typeof profilePic === "string" && profilePic !== "false"
                ? `${apiUrl}/${profilePic}`
                : `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(name || "User")}`
            } alt="" />
          </div>
          <h2 className="font-semibold">{name}</h2>
          <h3 className="text-gray-500 text-sm font-medium">{getTimeAgo(createdAt)}</h3>
        </div>

        {loggedInUser === data?.user?._id && <div className='relative'>
          <BsThreeDotsVertical
            onClick={handleCommentSettings}
            className='cursor-pointer'
          />

          {isOpen === _id && (
            <div className='flex flex-col text-base shadow-2xl bg-white px-4 py-2 rounded-xl absolute right-5 top-3 z-10'>
              <p className='cursor-pointer'>Edit</p>
              <p onClick={handleDelete} className='cursor-pointer'>Delete</p>
            </div>
          )}
        </div>}
      </div>

      <div className='text-base pl-12'>
        <h3>{comment}</h3>
      </div>

      <div>
        <div className='flex items-center gap-5 pl-12 font-semibold'>
          <div onClick={handleLike} className='flex items-center gap-2 cursor-pointer'>
            {isLiked ? <FaHeart className='text-base cursor-pointer' />
              : <FaRegHeart className='text-base cursor-pointer' />}
            <span>{likeCount}</span>
          </div>
          <div onClick={() => handleReplyBox(_id)} className='flex items-center gap-2 cursor-pointer'>
            <FaRegCommentAlt className='text-base cursor-pointer' />
            <span className="text-base">Reply</span>
          </div>
        </div>

      </div>
      {isReplyOpen === _id && <form onSubmit={handleReply} className='w-full flex gap-4 px-4'>
        <input
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          className='w-full h-12 outline-none border-1 border-black rounded-lg bg-[#f7f5f1] placeholder:text-gray-400 px-2'
          type="text"
          placeholder='Write your reply...'
        />
        <button type='submit' className='bg-black text-white px-4 py-1 rounded-lg cursor-pointer'>Send</button>
      </form>}
    </div>
  );
};

export default CommentCard;
