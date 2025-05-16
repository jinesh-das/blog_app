const express = require('express');
const userRouter = express.Router();
const { signUp, login, logout, loggedInUser, savedBlogs, followUnfollow, getUser, editProfile} = require('../controllers/user.controller');
const { userAuth } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');


userRouter.post('/signup', signUp);

userRouter.post('/login',login)

userRouter.get('/logout', userAuth, logout);

userRouter.get('/me', userAuth, loggedInUser);

 userRouter.get('/user/:username', userAuth, getUser);

userRouter.patch('/save-blog/:id', userAuth, savedBlogs);

userRouter.patch('/follow-unfollow/:id', userAuth, followUnfollow);

userRouter.patch('/edit-profile',upload.single('profilePic'), userAuth, editProfile);

module.exports = userRouter;