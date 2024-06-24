import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import type { MeType } from "@/types/AuthType";

const getMe = createAsyncThunk(
  "me/GET",
  async () => (await fetch("api/v1/auth/me")).json()
)

const initialState: MeType = { isLogin: false, firstName: "", lastName: "" };

const meSlice = createSlice({
  name: "me",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getMe.fulfilled, (state, action) => action.payload);
  }
})

export default meSlice.reducer;

export {
  getMe
}