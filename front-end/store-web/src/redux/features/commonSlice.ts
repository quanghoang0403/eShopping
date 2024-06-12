import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface CommonState {
  menu: IMenuLayout | null
}

const initialState: CommonState = {
  menu: null,
}

const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    updateMenu(state, action: PayloadAction<IMenuCategory[]>) {
      state.menu = {
        maleCategories: action.payload.find((item) => item.genderProduct === EnumGenderProduct.Male)?.productRootCategories || [],
        femaleCategories: action.payload.find((item) => item.genderProduct === EnumGenderProduct.Female)?.productRootCategories || [],
        kidCategories: action.payload.find((item) => item.genderProduct === EnumGenderProduct.Kid)?.productRootCategories || [],
      }
    },
  },
})

export const commonActions = commonSlice.actions
const commonReducer = commonSlice.reducer
export default commonReducer
