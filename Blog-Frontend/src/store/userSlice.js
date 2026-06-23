import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    email: null,
    password: null,
    token: null,
    userId: null,
    isAuthenticated: false,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
       setEmail: (state, action) => {
            state.email = action.payload;
        },
        setToken: (state, action) => {
            state.token = action.payload;
            state.isAuthenticated = true;
        },
         setUserId: (state, action) => {
            state.userId = action.payload;
        },
        logout: (state) => {
            state.email = null;
            state.password = null;
            state.token = null;
            state.userId = null;
            state.isAuthenticated = false;
        },
    }
})
export const { setEmail, setToken, setUserId, logout } = userSlice.actions;
export default userSlice.reducer;