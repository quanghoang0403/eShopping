import persistReducer from 'redux-persist/es/persistReducer'
import storage from 'redux-persist/lib/storage'
import { applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import persistStore from 'redux-persist/es/persistStore'
import rootReducer from './index.reducers'
import { configureStore } from '@reduxjs/toolkit/dist'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const enhancer = composeEnhancers(applyMiddleware(thunk))

const configureStoreOptions = () => {
  const persistConfig = {
    key: 'root',
    storage,
    timeout: null,
    whitelist: ['session']
  }
  const persistedReducer = persistReducer(persistConfig, rootReducer)
  // const store = configureStore({
  //   reducer: persistedReducer,
  //   middleware: (getDefaultMiddleware) =>
  //     getDefaultMiddleware({
  //       serializableCheck: false, // Disable serializable check as we are using redux-persist
  //     }),
  //   devTools: process.env.NODE_ENV !== "production",
  //   enhancer
  // });
  const store = configureStore({
    reducer: persistedReducer,
    enhancer
  })
  const persister = persistStore(store)
  return { persister, store }
}

export const { persister, store } = configureStoreOptions()
