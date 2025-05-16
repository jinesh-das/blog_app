const Blog = require('../models/blog.model');
const User = require('../models/user.model');
const fs = require('fs');
const path = require('path');
const Comment = require('../models/comment.model');
const { log } = require('console');


const createBlogs = async (req, res) => {
    try {
        const creator = req.user._id;
        const { title, description, draft  } = req.body;

        if(!creator){
            return res.status(400).json({ error: "Login to create blog" });
        }


        if(!title || !description){
            return res.status(400).json({ error: "Title and description are required" });
        }

        const image = req.file ? req.file.path : null;
        console.log(req.body);
        

        const blog = new Blog({ title, description, draft, creator, image });
        await blog.save();

        await User.findByIdAndUpdate(creator, { $push: { blogs: blog._id } });
        res.status(201).json({ message: "Blog created successfully", blog });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const updateBlog =  async (req, res) => {
    try{
        console.log('Patch request successful');
        const creator = req.user._id;
        const blogId = req.params.id;
        
        console.log("creator:", creator);
        console.log("req.body:", req.body);
        console.log("req.file:", req.file);  // Add this to check if image is sent correctly
        
        const { title, description, draft } = req.body;

        const blog = await Blog.findById(blogId);
        
        if(creator != blog.creator.toString()){
            return res.status(400).json({ error: "You are not authorized to update this blog" });
        }

        // Handle image
        const image = req.file ? req.file.path : blog.image;

        await blog.updateOne({ title, description, draft, image });

        res.status(200).json({ message: "Blog updated successfully", blog });

    }catch(err){
        console.error(err);
        res.status(500).json({ error: err.message });
    }
}

const deleteBlog = async (req, res) => {
    try {
        const creator = req.user._id;
        const blogId = req.params.id;
        const blog = await Blog.findById(blogId);

        if (!blog) {
            return res.status(404).json({ error: "Blog not found" });
        }

        if (creator.toString() !== blog.creator.toString()) {
            return res.status(403).json({ error: "You are not authorized to delete this blog" });
        }

        // Delete the associated image file if it exists
        if (blog.image) {
            const imagePath = path.join(__dirname, '..', blog.image);
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error(`Error deleting image file: ${err.message}`);
                    // Optionally, handle the error (e.g., send a response to the client)
                } else {
                    console.log(`Successfully deleted image file: ${imagePath}`);
                }
            });
        } 

        await Comment.deleteMany({ blogId: blog._id });

        await blog.deleteOne();

        await User.findByIdAndUpdate(creator, { $pull: { blogs: blogId } });

        res.status(200).json({ message: "Blog deleted successfully" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
    
}

const getBlogs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        const blogs = await Blog.find().populate('creator', 'name email').sort({ createdAt: -1 }).skip(skip).limit(limit);

        const totalBlogs = await Blog.countDocuments();

        res.status(200).json({
            message: "Blogs fetched successfully",
            blogs,
            totalPages: Math.ceil(totalBlogs / limit),
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const readBlogs = async (req, res)=>{
    try{
        const blogId = req.params.id;
        const blog = await Blog.findById(blogId).populate('creator','name email username profilePic');
        if(!blog){
            return res.status(404).json({ error: "Blog not found" });
        }
        res.status(200).json({
            message: "Blog fetched successfully",
            blog
        })
    }catch(err){
        res.status(500).json({ error: err.message });
    }

}

const likeAndDislikeBlog = async (req, res) => {
    try{
        const blogId = req.params.id;
        const userId = req.user._id;

        const blog = await Blog.findById(blogId);
        if(!blog){
            return res.status(404).json({ error: "Blog not found" });
        }
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({ error: "User not found" });
        }

        const isLiked = blog.like.includes(userId);

        if (isLiked) {
            blog.like.pull(userId); // ✅ remove userId from blog.like array
            user.likedBlogs.pull(blogId);
        } else {
            blog.like.push(userId); // ✅ add userId to blog.like array
            user.likedBlogs.push(blogId);
        }
        await blog.save();
        await user.save();
        const updatedBlog = await Blog.findById(blogId).populate('creator','name email profilePic');
        
        res.status(200).json({
            message:isLiked ? "Blog disliked successfully" : "Blog liked successfully",
           updatedBlog
        })
        
    }catch(err){
        res.status(500).json({ error: err.message });
    }
}

const searchBlogs = async(req,res)=>{
    try{
        const query = req.query.search;
        console.log(query);
       
        
        const blogs = await Blog.find({
            $or: [
              { title: { $regex: query, $options: 'i' } },    // case-insensitive match
              { description: { $regex: query, $options: 'i' } }
            ]
          }).populate('creator', 'name username');
        res.status(200).json({
            message:"Blogs fetched successfully",
            blogs
        })
       
    }catch(err){
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    createBlogs,
    getBlogs,
    updateBlog,
    deleteBlog,
    likeAndDislikeBlog,
    readBlogs,
    searchBlogs
}