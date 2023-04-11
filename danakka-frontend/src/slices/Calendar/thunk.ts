import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  getEvents as getEventsApi,
  addNewEvent as addNewEventApi,
  updateEvent as updateEventApi,
  deleteEvent as deleteEventApi,
  getCategories as getCategoriesApi,
} from "../../helpers/fakebackend_helper";

export const getEvents = createAsyncThunk("calendar/getEvents", async () => {
  try {
    const response = getEventsApi();
    return response;
  } catch (error) {
    return error;
  }
});

export const addNewEvent = createAsyncThunk(
  "calendar/addNewEvent",
  async (event: any) => {
    try {
      const response = addNewEventApi(event);
      return response;
    } catch (error) {
      return error;
    }
  }
);

export const updateEvent = createAsyncThunk(
  "calendar/updateEvent",
  async (event: any) => {
    try {
      const response = updateEventApi(event);
      const modifiedEvent = await response;
      return modifiedEvent;
    } catch (error) {
      return error;
    }
  }
);

export const deleteEvent = createAsyncThunk(
  "calendar/deleteEvent",
  async (event: any) => {
    try {
      const response = deleteEventApi(event);
      const deletedEvent = await response;
      return deletedEvent;
    } catch (error) {
      return error;
    }
  }
);

export const getCategories = createAsyncThunk(
  "calendar/getCategories",
  async () => {
    try {
      const response = getCategoriesApi();
      return response;
    } catch (error) {
      return error;
    }
  }
);
