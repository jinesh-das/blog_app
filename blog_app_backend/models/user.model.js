const mongoose = require('mongoose');

const userSchema= new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email:{
        type: String,
        unique: true
    },
    username:{
        type: String,
        unique: true
    },
    password: {
        type: String,
        
    },
    profilePic: {
        type: String,
        default:false
    },
    coverPic: {
        type: String,
        default:false
    },
    bio:{
        type: String,
        default:false
    },
    savedBlogs:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog'
    }],
    likedBlogs:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog'
    }],
    followers:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    following:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    blogs:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog'
    }],
    showLikedBlogs: {
        type: Boolean,
        default: false
    }

},{timestamps :true});


const User = mongoose.model('User',userSchema);

module.exports= User;