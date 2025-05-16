const Blog = require("../models/blog.model");
const Comment = require("../models/comment.model");
const mongoose = require("mongoose");


const addComment = async (req, res) => {
    try {
        const creator = req.user._id;
        const blogId = req.params.id;
        const { comment } = req.body;

        if (!comment || comment.trim() === "") {
            return res.status(400).json({ error: "Comment is required" });
        }

        if (comment.length > 500) {
            return res.status(400).json({ error: "Comment too long (max 500 characters)" });
        }

        if (!mongoose.Types.ObjectId.isValid(blogId)) {
            return res.status(400).json({ error: "Invalid blog ID" });
        }

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ error: "Blog not found" });
        }

        const newComment = new Comment({ comment, blog: blogId, user: creator });
        newComment.save();

        const updatedComment = await newComment.populate("user", "name email");   
        res.status(201).json({ message: "Comment added successfully", comment: updatedComment });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const deleteComment = async (req, res) => {
    try {
        const loggedInUser = req.user._id;
        const commentId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(commentId)) {
            return res.status(400).json({ error: "Invalid comment ID" });
        }

        const comment = await Comment.findById(commentId).populate("blog");

        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }

        if ((loggedInUser != comment.user.toString()) && (loggedInUser != comment.blog.creator.toString())) {
            return res.status(400).json({ error: "You are not authorized to delete this comment" });
        }

        await Comment.deleteMany({ parentComment: commentId });
        await comment.deleteOne();
        
        res.status(200).json({ message: "Comment deleted successfully", comment });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const getComments = async (req, res) => {
    try {
        const blogId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(blogId)) {
            return res.status(400).json({ error: "Invalid blog ID" });
        }
        const comments = await Comment.find({ blog: blogId }).populate("user", "name email profilePic").populate("replies.user", "name email").sort({ createdAt: -1 });

        res.status(200).json({ message: "Comments fetched successfully", comments });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const likeAndDislikeComment = async (req, res) => {
    try {
        const commentId = req.params.id;
        const userId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(commentId)) {
            return res.status(400).json({ error: "Invalid comment ID" });
        }

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }

        const isLiked = comment.likes.includes(userId);

        if (isLiked) {
            comment.likes.pull(userId);
        } else {
            comment.likes.push(userId);
        }

        await comment.save(); // Only this is needed

        const updatedComment = await Comment.findById(commentId).populate("user", "name email");

        res.status(200).json({
            message: isLiked ? "Comment disliked successfully" : "Comment liked successfully",
            updatedComment
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const nestedComments = async (req, res) => {
    try{
        const commentId = req.params.id;
        const {blogId} = req.params;
        const userId = req.user._id;
        const {reply} = req.body;

        if (!mongoose.Types.ObjectId.isValid(commentId)) {
            return res.status(400).json({ error: "Invalid comment ID" });
        }

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ error: "Blog not found" });
        }

        const newComment = new Comment({ comment: reply, blog: blogId, user: userId, parentComment: commentId });

        await Comment.findByIdAndUpdate(commentId, { $push: { replies: newComment._id } });

        await newComment.save();

        res.status(201).json({ message: "Reply added successfully", comment: newComment });

    }catch(err){
        res.status(500).json({ error: err.message });
    }
}

module.exports = { addComment, deleteComment, likeAndDislikeComment, getComments, nestedComments };