import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    email: null,
    password: null,
    token: null,
    isAuthenticated: false,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
       setEmail: (state, action) => {
            state.email = action.payload;
        },
        setPassword: (state, action) => {
            state.password = action.payload;
        },
        setToken: (state, action) => {
            state.token = action.payload;
            state.isAuthenticated = true;
        },
        logout: (state) => {
            state.email = null;
            state.password = null;
            state.token = null;
            state.isAuthenticated = false;
        },
    }
})
export const { setEmail, setPassword, setToken, logout } = userSlice.actions;
export default userSlice.reducer;