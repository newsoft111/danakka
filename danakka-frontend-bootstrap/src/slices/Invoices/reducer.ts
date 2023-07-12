import { createSlice } from "@reduxjs/toolkit";
import { getInvoices, addInvoice, deleteInvoice, updateInvoice  } from "./thunk";

interface InvoiceStateType {
  invoices: Array<any>;
  invoiceDetail: object;
  error?: string | object | null | undefined | unknown;
}
export const initialState: InvoiceStateType = {
  invoices: [],
  invoiceDetail: {},
  error: {},
};

const invoiceSlice = createSlice({
  name: "invoices",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getInvoices.fulfilled, (state: any, action: any) => {
      state.invoices = action.payload;
    });
    builder.addCase(getInvoices.rejected, (state, action) => {
      state.error = action.payload || null;
    });
    builder.addCase(addInvoice.fulfilled, (state: any, action: any) => {
      state.invoices.push(action.payload);
    })
    builder.addCase(addInvoice.rejected, (state, action) => {
      state.error = action.payload || null;
    })
    builder.addCase(deleteInvoice.fulfilled, (state: any, action: any) => {
      state.invoices = (state.invoices || []).filter((event: any) => event['id'] + '' !== action.payload + '')
    })
    builder.addCase(deleteInvoice.rejected, (state, action) => {
      state.error = action.payload || null;
    })
    builder.addCase(updateInvoice.fulfilled, (state: any, action: any) => {
      state.invoices = (state.invoices || []).map((event: any) =>
        event.id+'' === action.payload.id+''
          ? { ...event, ...action.payload }
          : event
      )
    })
    builder.addCase(updateInvoice.rejected, (state, action) => {
      state.error = action.payload || null;
    })
  },
});

export default invoiceSlice.reducer;