import { combineReducers, configureStore } from '@reduxjs/toolkit'
import counterReducer from './features/counterSlice'
import sessionReducer from './features/sessionSlice'
import { createWrapper } from 'next-redux-wrapper'
// import storage from './sync_storage'
import storage from 'redux-persist/lib/storage'
// import { createCookieWrapper } from 'next-redux-cookie-wrapper'
import { COOKIE_NAME } from './sync_storage'
import { persistReducer, persistStore } from 'redux-persist'

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

export const makeStore = () => {
  if (typeof window === 'undefined') {
    return configureStore({
      reducer: combinedReducer,
      middleware: customMiddleware,
    })
  } else {
    //const { persistStore, persistReducer } = require('redux-persist')
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
export type AppState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']

// const cookieWrapper = createCookieWrapper({
//   cookieName: COOKIE_NAME,
//   expiration: {
//     maxAge: 60 * 60 * 24 * 30, // 30 days
//   },
// })

// export const wrapper = createWrapper(makeStore)
// export const cookieStoreWrapper = createWrapper(makeStore, { debug: true }, cookieWrapper)
