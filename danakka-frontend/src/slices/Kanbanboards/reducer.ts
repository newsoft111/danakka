import { createSlice } from "@reduxjs/toolkit";
import { getKanbanboards } from "./thunk";

interface KanbanboardStateType {
    kanbanboards: Array<any>;
    error?: string | object | null | undefined | unknown;
  }
  export const initialState: KanbanboardStateType = {
    kanbanboards: [],
    error: {},
  };
  
  const kanbanboardSlice = createSlice({
    name: "kanbanboards",
    initialState,
    reducers: {},
    extraReducers: builder => {
      builder.addCase(getKanbanboards.fulfilled, (state: any, action: any) => {
        state.kanbanboards = action.payload;
      });
      builder.addCase(getKanbanboards.rejected, (state, action) => {
        state.error = action.payload || null;
      });
    },
  });
  
  export default kanbanboardSlice.reducer;