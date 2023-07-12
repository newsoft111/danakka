import { createSlice } from "@reduxjs/toolkit";

interface ProfileStateType {
    error?: string | object | null | undefined | unknown,
    success?: any
}
export const initialState: ProfileStateType = {
    error: "",
    success: "",
};

const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        profileSuccess(state, action) {
            state.success = action.payload
        },
        profileError(state, action) {
            state.error = action.payload
        }
    },
});

export const {
    profileSuccess,
    profileError
} = profileSlice.actions

export default profileSlice.reducer;