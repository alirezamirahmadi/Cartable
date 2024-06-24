import { configureStore } from "@reduxjs/toolkit";

import meSlice from "./features/me/meSlice";

export const makeStore = () => {

  return configureStore({
    reducer: {
      me: meSlice
    }
  })
}

export type AppStore = ReturnType<typeof makeStore>

export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']