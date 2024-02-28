import Moment from 'moment'
import { localStorageKeys, setStorage } from 'utils/localStorage.helpers'
import { encryptWithAES } from 'utils/securityHelpers'
import actionTypes from './session.types'

const sessionInitialState = {
  auth: {},
  currentUser: {},
  lastUpdated: 1439478405547
}

const sessionReducer = (state = sessionInitialState, action) => {
  switch (action.type) {
    case actionTypes.SET_AUTH:
      return {
        ...state,
        currentUser: action?.auth?.user,
        auth: action.auth,
        lastUpdated: Moment.utc().format('x')
      }

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
      return {
        ...sessionInitialState,
        lastUpdated: Moment.utc().format('x')
      }

    case actionTypes.SET_AUTH_TOKEN:
      setStorage(localStorageKeys.TOKEN, action.token)
      return {
        ...state,
        auth: {
          ...state.auth,
          token: action.token,
          refreshToken: action.refreshToken,
          expire: action.expire
        }
      }
    case actionTypes.SET_SELECTED_SUB_MENU_ID:
      return {
        ...state,
        selectedSubMenuID: action.payload,
        lastUpdated: Moment.utc().format('x')
      }
    case actionTypes.SET_WORKSPACE:
      const { auth, token, permissions } = action.data
      const jsonWorkspacePermissions = JSON.stringify(permissions)
      const encodeJsonWorkspacePermissions = encryptWithAES(jsonWorkspacePermissions)
      setStorage(localStorageKeys.PERMISSIONS, encodeJsonWorkspacePermissions)
      setStorage(localStorageKeys.TOKEN, token)
      return {
        ...state,
        auth,
        permissions,
        lastUpdated: Moment.utc().format('x')
      }
    case actionTypes.SET_THUMBNAIL:
      return {
        ...state,
        auth: {
          ...state?.auth,
          user: {
            ...state?.auth?.user,
            thumbnail: action?.thumbnail
          }
        }
      }
    case actionTypes.SET_PERMISSION_GROUP:
      const jsonPermissionGroup = JSON.stringify(action.permissionGroup)
      const encodePermissionGroupData = encryptWithAES(jsonPermissionGroup)
      setStorage(localStorageKeys.PERMISSION_GROUP, encodePermissionGroupData)
      return {
        ...state,
        permissionGroup: action.permissionGroup,
        lastUpdated: Moment.utc().format('x')
      }
    case actionTypes.SET_FULL_NAME:
      return {
        ...state,
        auth: {
          ...state?.auth,
          user: {
            ...state?.auth?.user,
            fullName: action?.fullName
          }
        }
      }
    default:
      return state
  }
}

export const sessionSelector = (state) => state.session
export const authSelector = (state) => state?.session?.auth

export default sessionReducer
