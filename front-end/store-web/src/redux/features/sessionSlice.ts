// import { notifyInfo, notifySuccess } from '@/components/Common/Notification'
import { cookieKeys, resetSession, setCookie } from '@/utils/localStorage.helper'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface SessionState {
  customerId: string | null
  accountId: string | null
  cartItems: ICartItem[]
  totalQuantity: number
  totalPrice: number
  wishListCodes: number[]
}

const initialState: SessionState = {
  customerId: null,
  accountId: null,
  cartItems: [],
  totalQuantity: 0,
  totalPrice: 0,
  wishListCodes: [],
}

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    signInSuccess(state, action: PayloadAction<ISignInResponse>) {
      setCookie(cookieKeys.TOKEN, action.payload.token)
      setCookie(cookieKeys.REFRESH_TOKEN, action.payload.refreshToken)
      setCookie(cookieKeys.CUSTOMER_ID, action.payload.customerId)
    },
    logout(state) {
      resetSession()
      state.cartItems = []
      state.totalQuantity = 0
      state.totalPrice = 0
      state.customerId = null
    },
    addProductToCart(state, action: PayloadAction<ICartItem>) {
      const { productId, productVariantId } = action.payload
      const existingItemIndex = state.cartItems.findIndex((item) => item.productId === productId && item.productVariantId === productVariantId)

      if (existingItemIndex !== -1) {
        const currentQuantity = state.cartItems[existingItemIndex].quantity
        const maxQuantity = state.cartItems[existingItemIndex].quantityLeft
        if (currentQuantity == maxQuantity) {
        } else {
          state.cartItems[existingItemIndex].quantity = currentQuantity + action.payload.quantity
        }
      } else {
        state.cartItems.push(action.payload)
      }
      state.totalQuantity = calculateTotalQuantity(state.cartItems)
      state.totalPrice = calculateTotalPrice(state.cartItems)
    },
    updateProductInCart(
      state,
      action: PayloadAction<{
        productId: string
        productVariantId: string
        quantity: number
      }>
    ) {
      const { productId, productVariantId, quantity } = action.payload
      const existingItemIndex = state.cartItems.findIndex((item) => item.productId === productId && item.productVariantId === productVariantId)
      if (existingItemIndex !== -1) {
        const quantityLeft = state.cartItems[existingItemIndex].quantityLeft
        if (state.cartItems[existingItemIndex].quantity > quantityLeft) {
          state.cartItems[existingItemIndex].quantity = quantityLeft
        } else state.cartItems[existingItemIndex].quantity = quantity
      }
      state.totalQuantity = calculateTotalQuantity(state.cartItems)
      state.totalPrice = calculateTotalPrice(state.cartItems)
    },
    removeProductFromCart(state, action: PayloadAction<{ productId: string; productVariantId: string }>) {
      const { productId, productVariantId } = action.payload
      state.cartItems = state.cartItems.filter((item) => !(item.productId === productId && item.productVariantId === productVariantId))
      state.totalQuantity = calculateTotalQuantity(state.cartItems)
      state.totalPrice = calculateTotalPrice(state.cartItems)
    },
    resetCart(state) {
      state.cartItems = []
      state.totalQuantity = 0
      state.totalPrice = 0
    },
    updateCartAfterCheckout(state, action: PayloadAction<ICartItem[]>) {
      state.cartItems = action.payload
      state.totalQuantity = calculateTotalQuantity(state.cartItems)
      state.totalPrice = calculateTotalPrice(state.cartItems)
    },
    addOrRemoveWishListProduct(state, action: PayloadAction<number>) {
      if (!state.wishListCodes) state.wishListCodes
      if (state.wishListCodes.includes(action.payload)) {
        state.wishListCodes = state.wishListCodes.filter((code) => code !== action.payload)
      } else {
        state.wishListCodes.push(action.payload)
      }
    },
  },
})

function calculateTotalQuantity(cartItems: ICartItem[]): number {
  let sum = 0
  cartItems.forEach((item) => (sum += item.quantity))
  return +sum
}

function calculateTotalPrice(cartItems: ICartItem[]): number {
  let sum = 0
  cartItems.forEach((item) => (sum += item.quantity * (item.priceDiscount || item.priceValue)))
  return sum
}

export const sessionActions = sessionSlice.actions
const sessionReducer = sessionSlice.reducer
export default sessionReducer
