import { EnumGenderProduct, EnumSortType } from '@/constants/enum'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
interface ProductState {
  getProductRequest: IGetProductsRequest
}

const initialState: ProductState = {
  getProductRequest: {
    pageNumber: 1,
    pageSize: 12,
    isNewIn: false,
    isDiscounted: false,
    isFeatured: false,
    sortType: EnumSortType.Default,
    genderProduct: EnumGenderProduct.All,
    productRootCategoryIds: [],
    productCategoryIds: [],
    keySearch: '',
  },
}

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    updateRequest(state, action: PayloadAction<IGetProductsRequest>) {
      state.getProductRequest = action.payload
    },
    updateProductCategoryIds(state, action: PayloadAction<string[]>) {
      state.getProductRequest = { ...state.getProductRequest, productCategoryIds: action.payload }
    },
    updateProductRootCategoryIds(state, action: PayloadAction<string[]>) {
      state.getProductRequest = { ...state.getProductRequest, productRootCategoryIds: action.payload }
    },
    updateSoftType(state, action: PayloadAction<number>) {
      state.getProductRequest = { ...state.getProductRequest, sortType: action.payload }
    },
    updateIsNewIn(state, action: PayloadAction<boolean>) {
      state.getProductRequest = { ...state.getProductRequest, isNewIn: action.payload }
    },
    updateIsDiscounted(state, action: PayloadAction<boolean>) {
      state.getProductRequest = { ...state.getProductRequest, isDiscounted: action.payload }
    },
    updateIsFeatured(state, action: PayloadAction<boolean>) {
      state.getProductRequest = { ...state.getProductRequest, isFeatured: action.payload }
    },
    updatePageNumber(state, action: PayloadAction<number>) {
      state.getProductRequest = { ...state.getProductRequest, pageNumber: action.payload }
    },
    resetRequest(state) {
      state.getProductRequest = initialState.getProductRequest
    },
  },
})

export const productActions = productSlice.actions
const productReducer = productSlice.reducer
export default productReducer
