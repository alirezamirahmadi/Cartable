import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

import type { MeType } from "@/types/authType";

const initialState: MeType = { isLogin: false, _id: "", firstName: "", lastName: "", roles: [{ _id: "", title: "", root: "" }], selectedRole: { _id: "", title: "", root: "" } };

const getMe = createAsyncThunk(
  "me/GET",
  async () => {
    return await fetch("api/v1/auth/me")
      .then(res => res.status === 200 && res.json())
      .then(data => { return data ? { isLogin: true, ...data, selectedRole: { _id: data.roles[0]._id, title: data.roles[0].title, root: data.roles[0].root } } : initialState })
      .catch(() => initialState);
  }
)


const meSlice = createSlice({
  name: "me",
  initialState,
  reducers: {
    clearMe: (me: MeType) => {
      return me = initialState
    },
    changeRole: (me: MeType, action: PayloadAction<MeType>) => {
      me.selectedRole = action.payload.selectedRole;
      return me;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getMe.fulfilled, (state, action) => action.payload);
  }
})

export default meSlice.reducer;

export {
  getMe
}

export const { clearMe, changeRole } = meSlice.actions;