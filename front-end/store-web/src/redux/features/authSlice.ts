import { ISignInResponse } from '@/services/auth.service'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import cookie from 'js-cookie'

interface AuthState {
  isLoggedIn: boolean
  customerId: string | null
  accountId: string | null
}

const initialState: AuthState = {
  isLoggedIn: false,
  customerId: null,
  accountId: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signInSuccess(state, action: PayloadAction<ISignInResponse>) {
      cookie.set('token', action.payload.token, {
        sameSite: 'lax',
      })
      state.isLoggedIn = true
      state.customerId = action.payload.customerId
      state.accountId = action.payload.accountId
    },
    logout(state) {
      state.isLoggedIn = false
      state.customerId = null
      state.accountId = null
    },
  },
})

export const authActions = authSlice.actions
const authReducer = authSlice.reducer
export default authReducer
