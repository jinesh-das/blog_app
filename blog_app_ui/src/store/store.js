import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/auth/authSlice";
import commentReducer from "../slices/comment/commentSlice";
import blogReducer from "../slices/blog/selectBlogSlice";


const store = configureStore({
    reducer: {
        auth: authReducer,
        comment: commentReducer,
        blog: blogReducer
    },
})

export default store