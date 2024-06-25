import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const darkSlice = createSlice({
  name: "dark-mode",
  initialState: false,
  reducers: {
    changeMode: (mode: boolean, action: PayloadAction<boolean>) => {
      return mode = action.payload;
    }
  }
})

export default darkSlice.reducer;

export const { changeMode } = darkSlice.actions;