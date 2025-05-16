const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const generateUsername = require('../utils/generateUsername')


const signUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const username = generateUsername(email);

        const user = new User({ name, email, username, password: hashedPassword });

        await user.save();
        res.status(201).json({ message: "User created successfully", user });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const user = await User.findOne({ email });


        if (!user) {
            return res.status(400).json({ error: "User does not exist" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ error: "Invalid password" });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);


        res.cookie('token', token, { httpOnly: true });

        res.status(200).
            json({
                message: "Login successful",
                user:
                {
                    name: user.name,
                    email: user.email,
                    _id: user._id,
                    username: user.username,
                    profilePic: user.profilePic,
                    savedBlogs: user.savedBlogs
                }
            });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const loggedInUser = async (req, res) => {
    try {
        const user = req.user;
        const loggedInUser = await User.findById(user._id).select('-password  -blogs');
        res.status(200).json(loggedInUser);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const logout = (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: "Logout successful" });

}

const savedBlogs = async (req, res) => {
    try {
        const loggedInUser = req.user;
        const blogId = req.params.id;

        const user = await User.findById(loggedInUser._id);

        const isBlogSaved = user.savedBlogs.includes(blogId);

        if (isBlogSaved) {
            user.savedBlogs.pull(blogId);
        }
        else {
            user.savedBlogs.push(blogId);
        }

        await user.save();

        //    const updatedUser = await User.findById(loggedInUser._id);

        res.status(200).json({ message: isBlogSaved ? "Blog unsaved successfully" : "Blog saved successfully", user });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }

}

const followUnfollow = async (req, res) => {
    try {
        const loggedInUser = req.user;
        const userId = req.params.id;

        const user = await User.findById(loggedInUser._id);
        const userToFollow = await User.findById(userId);

        const isFollowing = user.following.includes(userId);

        if (isFollowing) {
            user.following.pull(userId);
            userToFollow.followers.pull(loggedInUser._id);
        }
        else {
            user.following.push(userId);
            userToFollow.followers.push(loggedInUser._id);
        }

        await user.save();
        await userToFollow.save();

        res.status(200).json({ message: isFollowing ? "Unfollowed successfully" : "Followed successfully", user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const getUser = async (req, res) => {
    try {
        const username = req.params.username;
        const user = await User.findOne({ username }).populate('blogs likedBlogs savedBlogs');
        res.status(200).json({ message: "User fetched successfully", user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const editProfile = async (req, res) => {
    try {
        const { name, username, bio } = req.body;
        const loggedInUser = req.user;
        const user = await User.findById(loggedInUser._id);

        // Check for duplicate username only if it's provided and changed
        if (username && username.trim() !== "" && username !== user.username) {
            const existingUser = await User.findOne({ username: username.trim() });
            if (existingUser) {
                return res.status(400).json({ error: "Username is already taken" });
            }
            user.username = username.trim();
        }

        if (name !== undefined && name.trim() !== "") {
            user.name = name.trim();
        }

        if (bio !== undefined) {
            user.bio = bio;
        }

        if (req.file?.path) {
            user.profilePic = req.file.path;
        }

        await user.save();
        res.status(200).json({ message: "Profile updated successfully", user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    signUp,
    login,
    logout,
    loggedInUser,
    savedBlogs,
    followUnfollow,
    getUser,
    editProfile
}
