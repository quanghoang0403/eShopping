import Moment from 'moment'
import { localStorageKeys, setStorage } from 'utils/localStorage.helpers'
import { encryptWithAES } from 'utils/securityHelpers'
import actionTypes from './session.types'

const sessionInitialState = {
  currentUser: {},
  permissions: [],
  lastUpdated: 1439478405547
}

const sessionReducer = (state = sessionInitialState, action) => {
  switch (action.type) {
    case actionTypes.SET_PERMISSIONS:
      const jsonPermissions = JSON.stringify(action.permissions)
      const encodeData = encryptWithAES(jsonPermissions)
      setStorage(localStorageKeys.PERMISSIONS, encodeData)
      return {
        ...state,
        permissions: action.permissions,
        lastUpdated: Moment.utc().format('x')
      }

    case actionTypes.SET_CURRENT_USER:
      return {
        ...state,
        currentUser: action.currentUser,
        lastUpdated: Moment.utc().format('x')
      }

    case actionTypes.RESET_SESSION:
      localStorage.removeItem(localStorageKeys.TOKEN)
      localStorage.removeItem(localStorageKeys.REFRESH_TOKEN)
      localStorage.removeItem(localStorageKeys.PERMISSIONS)
      localStorage.removeItem('persist:root')
      return {
        ...sessionInitialState,
        lastUpdated: Moment.utc().format('x')
      }

    case actionTypes.SET_SELECTED_SUB_MENU_ID:
      return {
        ...state,
        selectedSubMenuID: action.payload,
        lastUpdated: Moment.utc().format('x')
      }

    case actionTypes.SET_THUMBNAIL:
      return {
        ...state,
        currentUser: {
          ...state?.currentUser,
          thumbnail: action?.thumbnail
        }
      }

    case actionTypes.SET_FULL_NAME:
      return {
        ...state,
        currentUser: {
          ...state?.currentUser,
          fullName: action?.fullName
        }
      }
    default:
      return state
  }
}

export const sessionSelector = (state) => state.session
export default sessionReducer
