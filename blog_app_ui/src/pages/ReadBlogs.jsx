import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { FaHeart, FaRegCommentAlt, FaRegHeart } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import Comment from '../components/Comment';
import { addComment, toggleComment } from '../slices/comment/commentSlice';
import { toast } from 'react-toastify';
import { BsBookmarkHeart, BsBookmarkHeartFill } from 'react-icons/bs';
import { setUser } from '../slices/auth/authSlice';
import moment from 'moment';
const apiUrl = import.meta.env.VITE_API_URL;




const ReadBlogs = () => {
    const [blogData, setBlogData] = useState({});
    const [isLiked, setIsLiked] = useState(false)
    const [isSaved, setIsSaved]=useState(false)
    const [isFollowing, setIsFollowing] = useState(false);
    const { id } = useParams();
    const dispatch = useDispatch();


    const loggedInUser = useSelector((state => state?.auth?.user?._id));
    const isOpen = useSelector((state => state.comment.isOpen))
    const comments = useSelector((state => state.comment.comments))

    const savedBog = useSelector((state => state?.auth?.user?.savedBlogs));
     const isSavedBlog = savedBog?.includes(id);
    

    const following = useSelector((state => state?.auth?.user?.following));
    const isFollowingUser = following?.includes(blogData?.creator?._id);
    
   
    console.log(loggedInUser);
    
   
   
    
    
   
    const getDetailedBlog = async () => {
        try {
            const res = await axios.get(`${apiUrl}/blogs/${id}`);
            const blog = res.data.blog;
            setBlogData(blog);

            // Only check isLiked if user is logged in
            if (loggedInUser) {
                setIsLiked(blog.like?.includes(loggedInUser));
            } else {
                setIsLiked(false); // Default to not liked for anonymous users
            }
        } catch (error) {
            console.log(error);
        }
    }
 
 
  
    const handleLike = async () => {
        if (!loggedInUser) return toast.error("Please login to like this blog");
        try {
            const res = await axios.patch(`${apiUrl}/like/${id}`, {}, { withCredentials: true });
            // console.log("from like",res.data.updatedBlog.like.includes(loggedInUser));
            setBlogData(res.data.updatedBlog);
            setIsLiked(res.data.updatedBlog.like.includes(loggedInUser));


        } catch (error) {
            console.log(error);

        }
    }

    const getComments = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/comment/${id}`, { withCredentials: true });
            // setAllComment(res.data.comments);
            // console.log(res.data.comments);
            dispatch(addComment(res.data.comments));
        } catch (error) {
            console.log(error);
        }
    }

    const handleOpenComment = () => {
        if (!loggedInUser) {
            return toast.error("Please login to comment on this blog");
        }
        dispatch(toggleComment());
    }

    const handleBookmark = async (id) => {
      try{
        const res = await axios.patch(`http://localhost:3000/save-blog/${id}`, {}, { withCredentials: true });
        dispatch(setUser(res.data.user));
        if(isSavedBlog){
          setIsSaved(false);
          toast.success("Blog unsaved successfully");
        }else{
          setIsSaved(true);
          toast.success("Blog saved successfully");
        }
        console.log(res);
        
      }catch(error){
        console.log(error);
      }
       
        
    }

    const handleFollow = async () => {
        try {
            const res = await axios.patch(`http://localhost:3000/follow-unfollow/${blogData.creator._id}`, {}, { withCredentials: true });
            console.log(res.data.user);
            dispatch(setUser(res.data.user));
            if (isFollowingUser) {
                setIsFollowing(false);
                toast.success("Unfollowed successfully");
            } else {
                setIsFollowing(true);
                toast.success("Followed successfully");
            }
        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        getDetailedBlog();
        getComments();
        // getLoggedInUser();
    }, [id, loggedInUser]);

     useEffect(() => {
        const isSavedBlog = savedBog?.includes(id);
        setIsSaved(isSavedBlog);
      }, [savedBog, id]);

      useEffect(() => {
        const isFollowingUser = following?.includes(blogData?.creator?._id);
        setIsFollowing("from use effect",isFollowingUser);
      }, []);


    return (
        <div className='w-full min-h-screen pt-24 relative transition-all'>
            {isOpen && <Comment />}
            <div className='w-full flex justify-center items-center '>
                <div className='w-2/4 flex flex-col gap-6'>
                    <div>
                        <h2 className='text-4xl font-bold'>{blogData.title}</h2>
                    </div>
                    <div className='w-full flex items-center gap-16'>
                        <div className='flex items-center gap-3'>
                            <Link to={loggedInUser ? `/@${blogData?.creator?.username}`:""} className='w-[50px] h-[50px] rounded-full overflow-hidden bg-black object-center object-cover '>
                                <img className='w-full ' src={`${apiUrl}/${blogData?.creator?.profilePic}`||`https://api.dicebear.com/9.x/initials/svg?seed=${blogData.creator?.name}`} alt="" />
                            </Link>
                            <div>
                                <div className='flex items-center gap-3'>
                                <Link to={loggedInUser ? `/@${blogData?.creator?.username}`: "" } className='text-lg hover:underline'>{blogData.creator?.name}</Link>
                                <button onClick={handleFollow} className= {` rounded-4xl py-1 px-4 cursor-pointer text-base font-semibold bg-black dark:bg-white ${isFollowing ? "bg-transparent text-black border-2 border-gray-300" : "bg-black dark:bg-white dark:text-black text-white"}`}>{isFollowing ? "Following" :"Follow"}</button>
                                </div>
                                <p className='text-sm'>{moment(blogData.createdAt).fromNow()}</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-5'>
                            <div onClick={handleLike} className='flex items-center gap-2  cursor-pointer'>
                                {isLiked ? <FaHeart className='text-xl' /> : <FaRegHeart className='text-xl' />
                                }
                                <span>{(blogData.like?.length || 0)}</span>
                            </div>
                            <div className='flex items-center gap-2  cursor-pointer'>
                                <FaRegCommentAlt onClick={handleOpenComment} className='text-xl cursor-pointer' />
                                <span>{comments?.length || 0}</span>
                            </div>
                            <div className='flex items-center gap-2  cursor-pointer'>
                            {isSaved ?
                            <BsBookmarkHeartFill onClick={()=>handleBookmark(blogData._id)}   className='text-xl cursor-pointer' />:
                            <BsBookmarkHeart onClick={()=>handleBookmark(blogData._id)}  className='text-xl cursor-pointer' />
                            
                           }
                            </div>
                        </div>
                    </div>
                    <div className='w-3/4 rounded-2xl overflow-hidden'>
                        <img src={`http://localhost:3000/${blogData.image}`} alt="" />
                    </div>
                    <div>
                        <p className='text-lg font-normal'>{blogData.description}</p>
                    </div>
                    <div>
                        {blogData.creator?._id === loggedInUser && <Link to={`/blog/edit/${blogData._id}`}> <button className='bg-black text-white py-2 px-4 rounded-3xl cursor-pointer  dark:bg-white dark:text-black'>Edit blog</button></Link>}
                    </div>
                </div>

            </div>

        </div>
    )
}

export default ReadBlogs