const mongoose = require('mongoose');


const commentSchema = new mongoose.Schema({
    comment:{
        type:String,
        required:true,
        trim:true
    },
    blog:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Blog',
        required:true

    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true
    },
    likes:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:'User'
    },
    replies:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Comment'
    }],
    parentComment:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Comment',
        default: null
    }
    
},{timestamps:true})

const Comment = mongoose.model("Comment",commentSchema);
module.exports= Comment;