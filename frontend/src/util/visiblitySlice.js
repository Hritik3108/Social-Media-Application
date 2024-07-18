import { createSlice } from "@reduxjs/toolkit";

const visiblitySlice = createSlice({
    name:"visiblity",
    initialState: {
        newTweetVisiblity:false,
        replyVisiblity:false,
        replyId:'',
        editVisiblity:false,
        uploadProfilePictureVisiblity:false,
    },
    reducers:{
        setNewTweetVisiblity: (state,action) => {
            state.newTweetVisiblity=action.payload;
        },
        setReplyVisiblity: (state,action) => {
            state.replyVisiblity=action.payload;
        },
        setEditVisiblity: (state,action) => {
            state.editVisiblity=action.payload;
        },
        setReplyTweetId: (state,action) => {
            state.replyId=action.payload;
        },
        setUploadProfilePictureVisiblity: (state,action) => {
            state.uploadProfilePictureVisiblity=action.payload;
        }
    }
});

export const {setNewTweetVisiblity,setUploadProfilePictureVisiblity,setReplyVisiblity,setEditVisiblity,setReplyTweetId} = visiblitySlice.actions;

export default visiblitySlice.reducer;