import { createSlice } from "@reduxjs/toolkit";

interface LoginStateType {
    users: Array<any>,
    userProfile: object,
    error?: string | object | null | undefined | unknown,
    user?: any,
    history?: any
}
export const initialState: LoginStateType = {
    users: [],
    userProfile: {},
    error: '',
    user: '',
    history: ''
};

const loginSlice = createSlice({
    name: "login",
    initialState,
    reducers: {
        apiError(state, action) {
            state.error = action.payload
        },
        loginSuccess(state, action) {
            state.user = action.payload
        },
        logoutUserSuccess(state, action) {
            state.history = action.payload
        },
    },
});

export const {
    apiError,
    loginSuccess,
    logoutUserSuccess
} = loginSlice.actions

export default loginSlice.reducer;