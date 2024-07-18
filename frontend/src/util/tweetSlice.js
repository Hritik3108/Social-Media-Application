import { createSlice } from "@reduxjs/toolkit";

const tweetSlice = createSlice({
    name:"tweet",
    initialState: {
        tweets:[],
    },
    reducers:{
        addTweets: (state,action) => {
            state.tweets=[...action.payload];
        },
    }
});

export const {addTweets} = tweetSlice.actions;

export default tweetSlice.reducer;