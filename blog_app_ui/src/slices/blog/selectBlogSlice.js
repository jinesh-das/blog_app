import { createSlice } from "@reduxjs/toolkit";



const selectBlogSlice = createSlice({
    name:'selectBlog',
    initialState:{
        selectedBlog:null
    },
    reducers:{
        setSelectedBlog(state,action){
            state.selectedBlog=action.payload
        },
        clearSelectedBlog(state){
            state.selectedBlog=null
        }

    }
})

export const {setSelectedBlog,clearSelectedBlog}=selectBlogSlice.actions;
export default selectBlogSlice.reducer