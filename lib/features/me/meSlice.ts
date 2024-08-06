import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

import type { MeType } from "@/types/AuthType";

const initialState: MeType = { isLogin: false, _id: "", firstName: "", lastName: "", selectedRole: { _id: "", title: "", root: "" } };

const getMe = createAsyncThunk(
  "me/GET",
  async () => {
    return await fetch("api/v1/auth/me")
      .then(res => res.status === 200 && res.json())
      .then(data => {
        const trueDefault = data.roles.filter((role:any) => role.isDefault === true);
        const defaultRole = (data && trueDefault.length > 0) ? trueDefault[0] : { ...data.roles[0] }

        return data ? { isLogin: true, _id:data._id, firstName:data.firstName, lastName:data.lastName, selectedRole: defaultRole } : initialState
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