import { configureStore } from '@reduxjs/toolkit'
import { persistedReducer } from './persistConfig'
import { persistStore } from 'redux-persist'
import counterReducer from './features/counterSlice'
import sessionReducer from './features/sessionSlice'

export const makeStore = () => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware: any) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  })
  const persistor = persistStore(store)
  return { store, persistor }
}

// export const makeStore = (usePersist: boolean = true) => {
//   const customMiddleware = (getDefaultMiddleware: any) =>
//     getDefaultMiddleware({
//       serializableCheck: false,
//     })
//   if (usePersist) {
//     const store = configureStore({
//       reducer: persistedReducer,
//       middleware: customMiddleware,
//     })
//     const persistor = persistStore(store)
//     return { store, persistor }
//   } else {
//     const store = configureStore({
//       reducer: {
//         counter: counterReducer,
//         session: sessionReducer,
//       },
//       middleware: customMiddleware,
//     })
//     return { store }
//   }
// }

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['store']['getState']>
export type AppDispatch = AppStore['store']['dispatch']
