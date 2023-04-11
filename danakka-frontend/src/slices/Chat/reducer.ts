import { createSlice } from "@reduxjs/toolkit";

import {
  getChats,
  getGroups,
  getContacts,
  getMessages,
  addMessage,
} from "./thunk";

interface ChatStateType {
  chats: Array<any>;
  groups: Array<any>;
  contacts: Array<any>;
  messages: Array<any>;
  error?: string | object | null | undefined | unknown;
}
export const initialState: ChatStateType = {
  chats: [],
  groups: [],
  contacts: [],
  messages: [],
  error: {},
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getChats.fulfilled, (state: any, action: any) => {
      state.chats = action.payload;
    });
    builder.addCase(getChats.rejected, (state, action) => {
      state.error = action.payload || null;
    });
    builder.addCase(getGroups.fulfilled, (state: any, action: any) => {
      state.groups = action.payload;
    });
    builder.addCase(getGroups.rejected, (state, action) => {
      state.error = action.payload || null;
    });
    builder.addCase(getContacts.fulfilled, (state: any, action: any) => {
      state.contacts = action.payload;
    });
    builder.addCase(getContacts.rejected, (state, action) => {
      state.error = action.payload || null;
    });
    builder.addCase(getMessages.fulfilled, (state: any, action: any) => {
      state.messages = action.payload;
    });
    builder.addCase(getMessages.rejected, (state, action) => {
      state.error = action.payload || null;
    });
    builder.addCase(addMessage.fulfilled, (state: any, action: any) => {
      state.messages.push(action.payload);
    });
    builder.addCase(addMessage.rejected, (state, action) => {
      state.error = action.payload || null;
    });
  },
});

export default chatSlice.reducer;
