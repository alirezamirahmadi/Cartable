import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import type { MeType } from "@/types/AuthType";

const initialState: MeType = { isLogin: false, firstName: "", lastName: "" };

const getMe = createAsyncThunk(
  "me/GET",
  async () => {
    return await fetch("api/v1/auth/me")
      .then(res => {
        return res.status === 200 && res.json()
      })
      .then(data => { return data ? { isLogin: true, ...data } : initialState })
      .catch(() => initialState);
  }
)


const meSlice = createSlice({
  name: "me",
  initialState,
  reducers: {
    clearMe: (me: MeType) => {
      return me = initialState
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getMe.fulfilled, (state, action) => action.payload);
  }
})

export default meSlice.reducer;

export {
  getMe
}

export const { clearMe } = meSlice.actions;