import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './features/counterSlice'
import authReducer from './features/authSlice'

export const makeStore = () => {
  return configureStore({
    reducer: {
      counter: counterReducer,
      auth: authReducer,
    },
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
