import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name:"user",
    initialState: {
        user:{},
        token:"",
        sessionActive:false,
        active:'home',
    },
    reducers:{
        addUser: (state,action) => {
            state.user={...action.payload.user};
            console.log(state.user)
            state.token=action.payload.accessToken;
           state.sessionActive=true;
        },
        updateUser: (state,action) => {
            state.user={...action.payload}; 
        },
        logoutUser: (state, action) => {
           state.user={};
           state.token="";
           state.sessionActive=false;
        },
        setActive: (state,action) => {
            // console.log('action',action.payload)
            state.active=action.payload;
            // console.log('now path',state.activePath)
        }
        
    }
});

export const {addUser, logoutUser,updateUser,setActive} = userSlice.actions;

export default userSlice.reducer;