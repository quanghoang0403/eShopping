import { EnumGenderProduct } from '@/enums/enumGenderProduct'
import { ncNanoId } from '@/utils/string.helper'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
interface CommonState {
  menu: INavItemType[]
}

const initialState: CommonState = {
  menu: [],
}

const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    updateMenu(state, action: PayloadAction<IMenuCategory[]>) {
      const maleCategories = action.payload.find((item) => item.genderProduct === EnumGenderProduct.Male)?.productRootCategories || []
      const femaleCategories = action.payload.find((item) => item.genderProduct === EnumGenderProduct.Female)?.productRootCategories || []
      const kidCategories = action.payload.find((item) => item.genderProduct === EnumGenderProduct.Kid)?.productRootCategories || []
      state.menu = [
        {
          id: ncNanoId(),
          urlSEO: '/search',
          name: 'Danh mục',
        },
        {
          id: EnumGenderProduct.Male,
          urlSEO: '/collection/nam',
          name: 'Nam',
          type: 'megaMenu',
          children: maleCategories,
        },
        {
          id: EnumGenderProduct.Female,
          urlSEO: '/collection/nu',
          name: 'Nữ',
          type: 'megaMenu',
          children: femaleCategories,
        },
        {
          id: ncNanoId(),
          name: 'Khác',
          type: 'dropdown',
          children: [
            {
              id: ncNanoId(),
              urlSEO: '/blog',
              name: 'Bài viết',
            },
            {
              id: ncNanoId(),
              urlSEO: '/policy',
              name: 'Chính sách',
            },
            {
              id: ncNanoId(),
              urlSEO: '/contact',
              name: 'Liên hệ',
            },
          ],
        },
      ]
    },
  },
})

export const commonActions = commonSlice.actions
const commonReducer = commonSlice.reducer
export default commonReducer
