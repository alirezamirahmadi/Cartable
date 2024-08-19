import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

import type { MeType } from "@/types/authType";

const initialState: MeType = { isLogin: false, _id: "", firstName: "", lastName: "", defaultRole: { _id: "", title: "", root: "" }, permissions: [] };

const getMe = createAsyncThunk(
  "me/GET",
  async () => {
    return await fetch("api/v1/auth/me")
      .then(res => res.status === 200 && res.json())
      .then(data => {
        // const trueDefault = data.roles.filter((role: any) => role.isDefault === true);
        // const defaultRole = (data && trueDefault.length > 0) ? trueDefault[0] : { ...data.roles[0] }

        return data ? { isLogin: true, _id: data._id, firstName: data.firstName, lastName: data.lastName, defaultRole: { _id: data.roles._id, title: data.roles.title, root: data.roles.root }, permissions: [...data.permissions] } : initialState
      })
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

export const { clearMe, changeRole } = meSlice.actions;