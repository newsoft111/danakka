import { createAsyncThunk } from "@reduxjs/toolkit";

import { getKanbanboards as getKanbanboardsApi } from "../../helpers/fakebackend_helper";

export const getKanbanboards = createAsyncThunk(
  "kanbanboard/getKanbanboards",
  async () => {
    try {
      const response = getKanbanboardsApi();
      return response;
    } catch (error) {
      return error;
    }
  }
);
