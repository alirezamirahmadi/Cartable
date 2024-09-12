import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

import type { MeType } from "@/types/authType";

const initialState: MeType = { isLogin: false, _id: "", firstName: "", lastName: "", defaultRole: { _id: "", title: "", root: "" }, permissions: [], avatar: "" };

const getMe = createAsyncThunk(
  "me/GET",
  async () => {
    return await fetch("api/v1/auth/me")
      .then(res => res.status === 200 && res.json())
      .then(data => {
        return data ? { isLogin: true, _id: data._id, firstName: data.firstName, lastName: data.lastName, defaultRole: { _id: data.roles._id, title: data.roles.title, root: data.roles.root }, permissions: [...data.permissions], avatar: data.image } : initialState
      })
      .catch(() => initialState);
  }
)


const meSlice = createSlice({
  name: "me",
  initialState,
  reducers: {
    setMe: (me: MeType, action: PayloadAction<MeType>) => {
      me.isLogin = true;
      me._id = action.payload._id;
      me.firstName = action.payload.firstName;
      me.lastName = action.payload.lastName;
      me.avatar = action.payload.avatar;
      me.defaultRole = action.payload.defaultRole;
      me.permissions = action.payload.permissions;
    },
    clearMe: (me: MeType) => {
      return me = initialState
    },
    changeRole: (me: MeType, action: PayloadAction<MeType>) => {
      me.defaultRole = action.payload.defaultRole;
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

export const { setMe, clearMe, changeRole } = meSlice.actions;