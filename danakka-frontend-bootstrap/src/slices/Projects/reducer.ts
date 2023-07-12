import { createSlice } from "@reduxjs/toolkit";
import { getProjects } from "./thunk";

interface KanbanboardStateType {
    projects: Array<any>;
    error?: string | object | null | undefined | unknown;
  }
  export const initialState: KanbanboardStateType = {
    projects: [],
    error: {},
  };
  
  const kanbanboardSlice = createSlice({
    name: "projects",
    initialState,
    reducers: {},
    extraReducers: builder => {
      builder.addCase(getProjects.fulfilled, (state: any, action: any) => {
        state.projects = action.payload;
      });
      builder.addCase(getProjects.rejected, (state, action) => {
        state.error = action.payload || null;
      });
    },
  });
  
  export default kanbanboardSlice.reducer;