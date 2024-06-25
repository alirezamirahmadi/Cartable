import { configureStore } from "@reduxjs/toolkit";

import meSlice from "./features/me/meSlice";
import darkSlice from "./features/darkMode/darkSlice";

export const makeStore = () => {

  return configureStore({
    reducer: {
      me: meSlice,
      darkMode: darkSlice,
    }
  })
}

export type AppStore = ReturnType<typeof makeStore>

export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']