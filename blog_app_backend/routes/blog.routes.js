const express = require('express'); 
const { getBlogs, createBlogs, updateBlog, deleteBlog, likeAndDislikeBlog, readBlogs, searchBlogs } = require('../controllers/blog.controller');
const { userAuth } = require('../middlewares/auth.middleware');
const { addComment, deleteComment, likeAndDislikeComment, getComments, nestedComments } = require('../controllers/comment.controller');
const upload = require('../middlewares/upload.middleware');
const blogRouter = express.Router();


blogRouter.post('/create',userAuth,upload.single('image'), createBlogs)
blogRouter.put('/update/:id', userAuth,upload.single('image'), updateBlog)
blogRouter.delete('/delete/:id', userAuth, deleteBlog)
blogRouter.get('/blogs',getBlogs)
blogRouter.get('/blogs/:id',readBlogs)

blogRouter.patch('/like/:id',userAuth, likeAndDislikeBlog)

blogRouter.post('/comment/:id',userAuth, addComment)
blogRouter.delete('/comment/:id',userAuth, deleteComment)
blogRouter.patch('/comment/like/:id',userAuth, likeAndDislikeComment)
blogRouter.get('/comment/:id',getComments)
blogRouter.post('/comment/:blogId/:id',userAuth, nestedComments)

blogRouter.get('/search', searchBlogs)


module.exports = blogRouter; 