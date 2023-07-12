import { createSlice } from "@reduxjs/toolkit";

import { getUsers, addNewUser, deleteUser, updateUser } from "./thunk";

interface ContactsStateType {
  users: Array<any>,
  userProfile: object,
  error?: string | object | null | undefined | unknown,
}
export const initialState: ContactsStateType = {
  users: [],
  userProfile: {},
  error: ''
};

const contactsSlice = createSlice({
  name: "contacts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUsers.fulfilled, (state : any, action : any) => {
      state.users = action.payload;
    })
    builder.addCase(getUsers.rejected, (state, action) => {
      state.error = action.payload || null;
    })
    builder.addCase(addNewUser.fulfilled, (state : any, action : any) => {
      state.users.push(action.payload);
    })
    builder.addCase(addNewUser.rejected, (state, action) => {
      state.error = action.payload || null;
    })
    builder.addCase(deleteUser.fulfilled, (state: any, action: any) => {
      state.users = (state.users || []).filter((event: any) => event['id'] + '' !== action.payload + '')
    })
    builder.addCase(deleteUser.rejected, (state, action) => {
      state.error = action.payload || null;
    })
    builder.addCase(updateUser.fulfilled, (state: any, action: any) => {
      state.users = (state.users || []).map((event: any) =>
        event.id + '' === action.payload.id + ''
          ? { ...event, ...action.payload }
          : event
      )
    })
    builder.addCase(updateUser.rejected, (state, action) => {
      state.error = action.payload || null;
    })
  },
});

export default contactsSlice.reducer;
