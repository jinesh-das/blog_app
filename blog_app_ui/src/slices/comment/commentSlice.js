import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    isOpen: false,
    comments: []
}


const commentSlice = createSlice({
    name: 'comment',
    initialState,
    reducers: {
        openComment(state) {
            state.isOpen = true
        },
        closeComment(state) {
            state.isOpen = false
        },
        toggleComment(state) {
            state.isOpen = !state.isOpen
        },
        addComment(state, action) {
            // console.log("from redux", action.payload);
            state.comments = action.payload
        },
        newComment(state, action) {
            state.comments.push(action.payload)
        },
        deleteComment(state, action) {
            state.comments = state.comments.filter(comment => comment._id !== action.payload)
        },
        updateCommentLike: (state, action) => {
            const { commentId, isLiked, likeCount } = action.payload;
            const comment = state.comments.find((comment) => comment._id === commentId);
            if (comment) {
              comment.isLiked = isLiked;
              comment.likeCount = likeCount;
            }
          }
    }
})

export const { openComment, closeComment, toggleComment, newComment, addComment, deleteComment, updateCommentLike } = commentSlice.actions;
export default commentSlice.reducer