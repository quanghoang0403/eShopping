import { ISignInResponse } from '@/services/auth.service'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import cookie from 'js-cookie'

interface SessionState {
  isLoggedIn: boolean
  token?: string
  customerId: string | null
  accountId: string | null
  cartItems: ICartItem[]
  totalQuantity: number
  totalPrice: number
}

const initialState: SessionState = {
  isLoggedIn: false,
  customerId: null,
  accountId: null,
  cartItems: [],
  totalQuantity: 0,
  totalPrice: 0,
}

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    signInSuccess(state, action: PayloadAction<ISignInResponse>) {
      // cookie.set('token', action.payload.token, {
      //   sameSite: 'lax',
      // })
      state.token = action.payload.token
      state.isLoggedIn = true
      state.customerId = action.payload.customerId
      state.accountId = action.payload.accountId
    },
    logout(state) {
      state.token = ''
      state.isLoggedIn = false
      state.customerId = null
      state.accountId = null
    },
    addProductToCart(state, action: PayloadAction<ICartItem>) {
      const { productId, priceId } = action.payload
      const existingItemIndex = state.cartItems.findIndex((item) => item.productId === productId && item.priceId === priceId)

      if (existingItemIndex !== -1) {
        state.cartItems[existingItemIndex].quantity += 1
      } else {
        state.cartItems.push(action.payload)
      }
      state.totalQuantity = calculateTotalQuantity(state.cartItems)
      state.totalPrice = calculateTotalPrice(state.cartItems)
    },
    updateProductInCart(state, action: PayloadAction<{ productId: string; priceId: string; quantity: number }>) {
      const { productId, priceId, quantity } = action.payload
      const existingItemIndex = state.cartItems.findIndex((item) => item.productId === productId && item.priceId === priceId)

      if (existingItemIndex !== -1) {
        state.cartItems[existingItemIndex].quantity = quantity
      }
      state.totalQuantity = calculateTotalQuantity(state.cartItems)
      state.totalPrice = calculateTotalPrice(state.cartItems)
    },
    removeProductFromCart(state, action: PayloadAction<{ productId: string; priceId: string }>) {
      const { productId, priceId } = action.payload
      state.cartItems = state.cartItems.filter((item) => !(item.productId === productId && item.priceId === priceId))
      state.totalQuantity = calculateTotalQuantity(state.cartItems)
      state.totalPrice = calculateTotalPrice(state.cartItems)
    },
  },
})

function calculateTotalQuantity(cartItems: ICartItem[]): number {
  return cartItems.reduce((total, item) => total + item.quantity, 0)
}

function calculateTotalPrice(cartItems: ICartItem[]): number {
  return cartItems.reduce((total, item) => total + item.priceValue * item.quantity, 0)
}

export const sessionActions = sessionSlice.actions
const sessionReducer = sessionSlice.reducer
export default sessionReducer
