import { createSlice } from "@reduxjs/toolkit";

interface ForgotPasswordStateType {
    forgetSuccessMsg?: string | object | null | undefined | unknown,
    forgetError?: string | object | null | undefined | unknown
}
export const initialState: ForgotPasswordStateType = {
    forgetSuccessMsg: '',
    forgetError: ''
};

const forgotPasswordSlice = createSlice({
    name: "forgotpwd",
    initialState,
    reducers: {
        userForgetPasswordSuccess(state, action) {
            state.forgetSuccessMsg = action.payload
        },
        userForgetPasswordError(state, action) {
            state.forgetError = action.payload
        },
    },
});

export const {
    userForgetPasswordSuccess,
    userForgetPasswordError
} = forgotPasswordSlice.actions

export default forgotPasswordSlice.reducer;