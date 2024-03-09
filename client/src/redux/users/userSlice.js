import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentUser: JSON.parse(localStorage.getItem("user")) || ""
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInUser: (state, action) => {
            state.currentUser = action.payload;
            localStorage.setItem("user", JSON.stringify(action.payload))
        },
        signOutUser: (state, action) => {
            state.currentUser = "";
            localStorage.removeItem("user");
        }
    }
});

export const { signInUser, signOutUser } = userSlice.actions;

export default userSlice.reducer;