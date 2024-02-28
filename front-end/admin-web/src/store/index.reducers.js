import { combineReducers } from 'redux'
import sessionReducer from './modules/session/session.reducers'

const rootReducer = combineReducers({
  session: sessionReducer
})

export default rootReducer
