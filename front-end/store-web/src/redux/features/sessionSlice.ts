import { notifyInfo } from '@/components/Notification'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import cookie from 'js-cookie'

interface SessionState {
  isLoggedIn: boolean
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
      cookie.set('token', action.payload.token, {
        sameSite: 'lax',
      })
      state.isLoggedIn = true
      state.customerId = action.payload.customerId
      state.accountId = action.payload.accountId
    },
    logout(state) {
      cookie.remove('token')
      state.isLoggedIn = false
      state.customerId = null
      state.accountId = null
    },
    addProductToCart(state, action: PayloadAction<ICartItem>) {
      const { productId, productPriceId } = action.payload
      const existingItemIndex = state.cartItems.findIndex((item) => item.productId === productId && item.productPriceId === productPriceId)

      if (existingItemIndex !== -1) {
        state.cartItems[existingItemIndex].quantity += 1
      } else {
        state.cartItems.push(action.payload)
      }
      state.totalQuantity = calculateTotalQuantity(state.cartItems)
      state.totalPrice = calculateTotalPrice(state.cartItems)
    },
    updateProductInCart(state, action: PayloadAction<{ productId: string; productPriceId: string; quantity: number }>) {
      const { productId, productPriceId, quantity } = action.payload
      const existingItemIndex = state.cartItems.findIndex((item) => item.productId === productId && item.productPriceId === productPriceId)

      if (existingItemIndex !== -1) {
        const quantityLeft = state.cartItems[existingItemIndex].quantityLeft
        if (state.cartItems[existingItemIndex].quantity > quantityLeft) {
          state.cartItems[existingItemIndex].quantity = quantityLeft
          notifyInfo(`${state.cartItems[existingItemIndex].productName} - ${state.cartItems[existingItemIndex].priceName} chỉ còn ${quantityLeft} sản phẩm`)
        } else state.cartItems[existingItemIndex].quantity = quantity
      }
      state.totalQuantity = calculateTotalQuantity(state.cartItems)
      state.totalPrice = calculateTotalPrice(state.cartItems)
    },
    removeProductFromCart(state, action: PayloadAction<{ productId: string; productPriceId: string }>) {
      const { productId, productPriceId } = action.payload
      state.cartItems = state.cartItems.filter((item) => !(item.productId === productId && item.productPriceId === productPriceId))
      state.totalQuantity = calculateTotalQuantity(state.cartItems)
      state.totalPrice = calculateTotalPrice(state.cartItems)
    },
    resetCart(state) {
      state.cartItems = []
      state.totalQuantity = 0
      state.totalPrice = 0
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
