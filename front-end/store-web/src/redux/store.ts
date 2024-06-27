import { combineReducers, configureStore } from '@reduxjs/toolkit'
import commonReducer from './features/commonSlice'
import sessionReducer from './features/sessionSlice'
import productReducer from './features/productSlice'
import { createWrapper } from 'next-redux-wrapper'
import storage from 'redux-persist/lib/storage'
import { persistReducer, persistStore } from 'redux-persist'

// COMBINING ALL REDUCERS
const combinedReducer = combineReducers({
  product: productReducer,
  common: commonReducer,
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
    const persistConfig = {
      key: 'cuchoami_store',
      whitelist: ['common', 'session'],
      storage,
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
export type IRootState = ReturnType<typeof combinedReducer>
export const wrapper = createWrapper(makeStore)
