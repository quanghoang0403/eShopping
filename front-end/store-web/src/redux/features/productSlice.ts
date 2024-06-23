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
    resetRequest(state) {
      state.getProductRequest = initialState.getProductRequest
    },
  },
})

export const productActions = productSlice.actions
const productReducer = productSlice.reducer
export default productReducer
