import { createSlice } from "@reduxjs/toolkit";

interface RegisterStateType {
    registrationError?: string | object | null | undefined | unknown,
    message: any,
    loading: any,
    user?: any
}
export const initialState: RegisterStateType = {
    registrationError: null,
    message: null,
    loading: false,
    user: null,
};

const registerSlice = createSlice({
    name: "register",
    initialState,
    reducers: {
        registerUserSuccessful(state, action) {
            state.user = action.payload
        },
        registerUserFailed(state, action) {
            state.user = action.payload
        },
    },
});

export const {
    registerUserSuccessful,
    registerUserFailed
} = registerSlice.actions

export default registerSlice.reducer;