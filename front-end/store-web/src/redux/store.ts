import { combineReducers, configureStore } from '@reduxjs/toolkit'
import counterReducer from './features/counterSlice'
import sessionReducer from './features/sessionSlice'
import { createWrapper } from 'next-redux-wrapper'
import storage from './sync_storage'

// COMBINING ALL REDUCERS
const combinedReducer = combineReducers({
  counter: counterReducer,
  session: sessionReducer,
})

// BINDING MIDDLEWARE
const customMiddleware = (getDefaultMiddleware: any) =>
  getDefaultMiddleware({
    serializableCheck: false,
  })

const makeStore = (context: any) => {
  if (context.isServer) {
    return configureStore({
      reducer: combinedReducer,
      middleware: customMiddleware,
    })
  } else {
    const { persistStore, persistReducer } = require('redux-persist')
    const persistConfig = {
      key: 'nextjs',
      whitelist: ['counter', 'session'],
      storage, // if needed, use a safer storage
    }
    const persistedReducer = persistReducer(persistConfig, combinedReducer)
    let store: any = configureStore({
      reducer: persistedReducer,
      middleware: customMiddleware,
    })
    store.__persistor = persistStore(store)
    return store
  }
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']

export const wrapper = createWrapper(makeStore)
