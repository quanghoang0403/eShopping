import { ncNanoId } from '@/utils/string.helper'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
interface CommonState {
  menu: INavItemType[]
}

const initialState: CommonState = {
  menu: [
    {
      id: 1,
      urlSEO: "/collection",
      name: "Nam",
      type: "dropdown",
      children: []
    },
    {
      id: 2,
      urlSEO: "/collection",
      name: "Nữ",
      type: "dropdown",
      children: []
    },
    {
      id: ncNanoId(),
      urlSEO: "/search",
      name: "Danh mục",
    },
    {
      id: ncNanoId(),
      name: "Khác",
      type: "dropdown",
      children: [
        {
          id: ncNanoId(),
          urlSEO: "/blog",
          name: "Bài viết",
        },
        {
          id: ncNanoId(),
          urlSEO: "/about",
          name: "Về chúng tôi",
        },
        {
          id: ncNanoId(),
          urlSEO: "/contact",
          name: "Liên hệ",
        },
      ],
    },
  ],
}

const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    updateMenu(state, action: PayloadAction<IMenuCategory[]>) {
      const maleCategories = action.payload.find((item) => item.genderProduct === EnumGenderProduct.Male)?.children || [];
      const femaleCategories = action.payload.find((item) => item.genderProduct === EnumGenderProduct.Female)?.children || [];
      const kidCategories = action.payload.find((item) => item.genderProduct === EnumGenderProduct.Kid)?.children || [];
      state.menu = state.menu.map(menuItem => {
        if (menuItem.id === EnumGenderProduct.Male) {
          return {
            ...menuItem,
            children: maleCategories
          };
        } else if (menuItem.id === EnumGenderProduct.Female) {
          return {
            ...menuItem,
            children: femaleCategories
          };
        } else if (menuItem.id === EnumGenderProduct.Kid) {
          return {
            ...menuItem,
            children: kidCategories
          };
        }
        return menuItem;
      });
    },
  },
})

export const commonActions = commonSlice.actions
const commonReducer = commonSlice.reducer
export default commonReducer
