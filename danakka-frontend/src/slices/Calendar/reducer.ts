import { createSlice } from "@reduxjs/toolkit";

import { getEvents , addNewEvent , updateEvent, deleteEvent, getCategories} from "./thunk";

interface CalendarStateType {
  events: Array<any>,
  categories: Array<any>,
  error?: string | object | null | undefined | unknown,
  event ?: any
}

export const initialState: CalendarStateType = {
  events: [],
  categories: [],
  error: {},
  event : ''
};

const calendarSlice = createSlice({
  name: "calendar",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getEvents.fulfilled, (state : any, action : any) => {
      state.events = action.payload;
    })
    builder.addCase(getEvents.rejected, (state, action) => {
      state.error = action.payload || null;
    })
    builder.addCase(addNewEvent.fulfilled, (state : any, action : any) => {
      state.events.push(action.payload)
    })
    builder.addCase(addNewEvent.rejected, (state, action) => {
      state.error = action.payload || null;
    })
    builder.addCase(updateEvent.fulfilled, (state : any, action : any) => {
       state.events = (state.events || []).map((event : any) =>
          event.id+'' === action.payload.id+''
          ? { ...event, ...action.payload }
          : event
      )
    })
    builder.addCase(updateEvent.rejected, (state, action) => {
      state.error = action.payload || null;
    })
    builder.addCase(deleteEvent.fulfilled, (state : any, action : any) => {
      state.events = (state.events || []).filter((event : any) => event['id']+'' !== action.payload+'')
    })
    builder.addCase(deleteEvent.rejected, (state, action) => {
      state.error = action.payload || null;
    })
    builder.addCase(getCategories.fulfilled, (state : any, action : any) => {
      state.categories = action.payload;
    })
    builder.addCase(getCategories.rejected, (state, action) => {
      state.error = action.payload || null;
    })
  },
});

export default calendarSlice.reducer;