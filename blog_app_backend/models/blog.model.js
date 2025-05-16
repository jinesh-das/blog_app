const mongoose = require('mongoose');
const Comment = require('./comment.model');

const blogSChema = new mongoose.Schema({
    title : {
        type : String,
        required : true,
        trim : true
    },
    description : {
        type : String,
        required : true
    },
    draft: {
        type: Boolean,
        default: false
    },
    image:{
        type : String
    },
    creator : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    like:{
        type : [mongoose.Schema.Types.ObjectId],
        ref : 'User'
    },
   
  
    
},{timestamps : true});


blogSChema.pre('deleteOne', { document: true, query: false }, async function(next) {
    try {
      await Comment.deleteMany({ blogId: this._id });
      next();
    } catch (err) {
      next(err);
    }
  });



const Blog = mongoose.model('Blog', blogSChema);
module.exports = Blog;