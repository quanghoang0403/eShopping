import actionTypes from './session.types'

export function setCurrentUser(data) {
  return { type: actionTypes.SET_CURRENT_USER, payload: data }
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
