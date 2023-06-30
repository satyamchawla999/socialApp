import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    user:false,
    userData:{}
};

const userSlice = createSlice({
    name:"user",
    initialState,
    reducers : {
        setUser : (state)=>{
            state.user = true;
        },

        setUserData : (state,action)=>{
            state.userData = action.payload;
        },
        
        deleteUser : (state)=>{
            state.user = false;
            state.userData = {};
        }
    }
});

export const {setUser,deleteUser,setUserData} = userSlice.actions;

export default userSlice.reducer;