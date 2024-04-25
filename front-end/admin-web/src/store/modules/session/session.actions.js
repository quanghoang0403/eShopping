import actionTypes from './session.types'

export function setPermissions(permissions) {
  return { type: actionTypes.SET_PERMISSIONS, permissions }
}

export function setCurrentUser(user) {
  return { type: actionTypes.SET_CURRENT_USER, user }
}

export function resetSession() {
  return { type: actionTypes.RESET_SESSION }
}

export const setThumbnailUser = (thumbnail) => {
  return { type: actionTypes.SET_THUMBNAIL, thumbnail }
}

export const setFullNameUser = (fullName) => {
  return { type: actionTypes.SET_FULL_NAME, fullName }
}

export const setSelectedSubMenuId = (data) => {
  return { type: actionTypes.SET_SELECTED_SUB_MENU_ID, payload: data }
}
