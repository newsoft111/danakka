import { createAsyncThunk } from "@reduxjs/toolkit";
import { getProjects as getProjectsApi } from "../../helpers/fakebackend_helper";

export const getProjects = createAsyncThunk(
  "kanbanboard/getProjects",
  async () => {
    try {
      const response = getProjectsApi();
      return response;
    } catch (error) {
      return error;
    }
  }
);
