import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

// Import your reducers
import counterReducer from './features/counterSlice'
import sessionReducer from './features/sessionSlice'
import { combineReducers } from '@reduxjs/toolkit'

const rootPersistConfig = {
  key: 'root',
  storage,
  whitelist: ['counter', 'auth'],
}

// const counterPersistConfig = {
//   key: 'counter',
//   storage,
//   whitelist: ['counter'],
// }

// const authPersistConfig = {
//   key: 'auth',
//   storage,
//   whitelist: ['auth'],
// }

const rootReducer = combineReducers({
  counter: counterReducer,
  session: sessionReducer,
})

export const persistedReducer = persistReducer(rootPersistConfig, rootReducer)
