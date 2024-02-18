import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import { Hyperlink } from "constants/hyperlink.constants";
import { ACTION_MENU_ITEMS, ON_VIEW_MENU_MANAGEMENT } from "constants/level-menu.constants";
import menuManagementDataService from "data-services/menu-management/menu-management-data.service";
import multilevelMenuDataService from "data-services/multilevel-menu/multilevel-menu-data.service";
import { addNodeUnderParent, insertNode, removeNodeAtPath } from "react-sortable-tree";
import { randomGuid } from "utils/helpers";

const PREFIX = "menuManagement";
const PREFIX_ID_DRAFT = "DRAFT";
export const FORM_FIELD_SORTABLE_TREE_TYPE = {
  name: "name",
  hyperlinkOption: "hyperlinkOption",
  url: "url",
  categoryId: "categoryId",
  productId: "productId",
  pageId: "pageId",
  blogId: "blogId",
};
const DEFAULT_IS_INVALID_FROM_FIELD = {
  name: false,
  hyperlinkOption: false,
  url: false,
  categoryId: false,
  productId: false,
  pageId: false,
  blogId: false,
};

const initialState = {
  menuPrepareData: {
    productcategories: [],
    blogs: [],
    products: [],
    pages: [],
  },
  create: {
    multiLevelMenus: [
      {
        id: `DRAFT_${randomGuid()}`,
        expanded: true,
        children: [],
        isDraft: true,
        invalidFormField: DEFAULT_IS_INVALID_FROM_FIELD,
      },
    ],
  },
  edit: {
    menu: {},
    multiLevelMenus: [],
    originalMultiLevelMenus: [],
    requestingGetDetail: false,
  },
};

export const getMenuPrepareData = createAsyncThunk(`${PREFIX}/getMenuPrepareData`, async () => {
  const response = await menuManagementDataService.getCreateMenuPrepareDataAsync();
  return response;
});

export const getMenuByIdAsync = createAsyncThunk(`${PREFIX}/getMenuById`, async (id) => {
  const response = await multilevelMenuDataService.getMenuByIdAsync(id);
  return response;
});

export const createMenu = createAsyncThunk(`${PREFIX}/createMenu`, async (data) => {
  const response = await multilevelMenuDataService.createMenuAsync(data);
  return response;
});

export const updateMenu = createAsyncThunk(`${PREFIX}/updateMenu`, async (data) => {
  const response = await multilevelMenuDataService.updateMenuAsync(data);
  return response;
});

export const deleteMenu = createAsyncThunk(`${PREFIX}/deleteMenu`, async (data) => {
  const response = await multilevelMenuDataService.deleteMenuAsync(data);
  return response;
});

const menuManagementSlice = createSlice({
  name: PREFIX,
  initialState,
  reducers: {
    onChangeByDrag: (state, action) => {
      const { treeData, onView } = action.payload;
      if (onView === ON_VIEW_MENU_MANAGEMENT.CREATE) {
        state.create.multiLevelMenus = treeData;
      }
      if (onView === ON_VIEW_MENU_MANAGEMENT.EDIT) {
        state.edit.multiLevelMenus = treeData;
      }
    },
    updateDataInNode: (state, action) => {
      const { nodeModified, onView } = action.payload;
      let newTree = [];
      if (onView === ON_VIEW_MENU_MANAGEMENT.CREATE) {
        newTree = JSON.parse(JSON.stringify(current(state.create.multiLevelMenus))); //Clone new object to avoid immutable
      }
      if (onView === ON_VIEW_MENU_MANAGEMENT.EDIT) {
        newTree = JSON.parse(JSON.stringify(current(state.edit.multiLevelMenus)));
      }
      const recursiveUpdate = (data) => {
        if (data?.length > 0) {
          for (let i = 0; i < data.length; i++) {
            if (nodeModified.id === data[i].id) {
              data[i] = { ...data[i], ...nodeModified };
              return;
            } else {
              recursiveUpdate(data[i].children);
            }
          }
        } else return;
      };
      recursiveUpdate(newTree);

      if (onView === ON_VIEW_MENU_MANAGEMENT.CREATE) {
        state.create.multiLevelMenus = newTree;
      }
      if (onView === ON_VIEW_MENU_MANAGEMENT.EDIT) {
        state.edit.multiLevelMenus = newTree;
      }
    },
    deleteNode: (state, action) => {
      const { nodeModified, onView } = action.payload;
      let newTree = [];
      if (onView === ON_VIEW_MENU_MANAGEMENT.CREATE) {
        newTree = JSON.parse(JSON.stringify(current(state.create.multiLevelMenus)));
      }
      if (onView === ON_VIEW_MENU_MANAGEMENT.EDIT) {
        newTree = JSON.parse(JSON.stringify(current(state.edit.multiLevelMenus)));
      }

      newTree = removeNodeAtPath({
        treeData: newTree,
        path: nodeModified.path,
        ignoreCollapsed: true,
        getNodeKey: ({ node: _TreeNode, treeIndex: number }) => {
          return number;
        },
      });

      if (onView === ON_VIEW_MENU_MANAGEMENT.CREATE) {
        state.create.multiLevelMenus = newTree;
      }
      if (onView === ON_VIEW_MENU_MANAGEMENT.EDIT) {
        state.edit.multiLevelMenus = newTree;
      }
    },
    addUnderRoot: (state, action) => {
      const { onView } = action.payload;
      let newTree = [];
      if (onView === ON_VIEW_MENU_MANAGEMENT.CREATE) {
        newTree = JSON.parse(JSON.stringify(current(state.create.multiLevelMenus)));
      }
      if (onView === ON_VIEW_MENU_MANAGEMENT.EDIT) {
        newTree = JSON.parse(JSON.stringify(current(state.edit.multiLevelMenus)));
      }
      const newNode = {
        id: `${PREFIX_ID_DRAFT}_${randomGuid()}`,
        children: [],
        expanded: true,
        isDraft: true,
      };
      newTree = addNodeUnderParent({
        treeData: newTree,
        parentKey: null,
        expandParent: true,
        newNode: newNode,
        getNodeKey: ({ treeIndex }) => treeIndex,
      }).treeData;
      if (onView === ON_VIEW_MENU_MANAGEMENT.CREATE) {
        state.create.multiLevelMenus = newTree;
      }
      if (onView === ON_VIEW_MENU_MANAGEMENT.EDIT) {
        state.edit.multiLevelMenus = newTree;
      }
    },
    addNode: (state, action) => {
      const { nodeItem, onView } = action.payload;
      let newTree = [];
      if (onView === ON_VIEW_MENU_MANAGEMENT.CREATE) {
        newTree = JSON.parse(JSON.stringify(current(state.create.multiLevelMenus)));
      }
      if (onView === ON_VIEW_MENU_MANAGEMENT.EDIT) {
        newTree = JSON.parse(JSON.stringify(current(state.edit.multiLevelMenus)));
      }
      const newNode = {
        id: `${PREFIX_ID_DRAFT}_${randomGuid()}`,
        children: [],
        expanded: true,
        isDraft: true,
      };

      newTree = insertNode({
        treeData: newTree,
        newNode: newNode,
        minimumTreeIndex:
          nodeItem?.behavior === ACTION_MENU_ITEMS.ADD_ABOVE ? nodeItem?.treeIndex : nodeItem?.treeIndex + 1,
        depth: nodeItem?.path?.length - 1,
        ignoreCollapsed: true,
        expandParent: true,
        getNodeKey: ({ treeIndex }) => treeIndex,
      }).treeData;

      if (onView === ON_VIEW_MENU_MANAGEMENT.CREATE) {
        state.create.multiLevelMenus = newTree;
      }
      if (onView === ON_VIEW_MENU_MANAGEMENT.EDIT) {
        state.edit.multiLevelMenus = newTree;
      }
    },
    resetDataInsert: (state, _action) => {
      const defaultNode = {
        id: `${PREFIX_ID_DRAFT}_${randomGuid()}`,
        expanded: true,
        children: [],
        isDraft: true,
      };
      state.create.multiLevelMenus = [defaultNode];
    },
    resetDataUpdate: (state, _action) => {
      state.edit = {
        menu: {},
        multiLevelMenus: [],
      };
    },
    updateOriginalMenuEdit: (state, _action) => {
      state.edit.originalMultiLevelMenus = state.edit.multiLevelMenus;
    },
    validateForm: (state, action) => {
      const { onView } = action.payload;
      let newTree = [];
      if (onView === ON_VIEW_MENU_MANAGEMENT.CREATE) {
        newTree = JSON.parse(JSON.stringify(current(state.create.multiLevelMenus))); //Clone new object to avoid immutable
      }
      if (onView === ON_VIEW_MENU_MANAGEMENT.EDIT) {
        newTree = JSON.parse(JSON.stringify(current(state.edit.multiLevelMenus)));
      }

      const validateChildren = (data) => {
        if (data?.length > 0) {
          for (let i = 0; i < data.length; i++) {
            const newInvalidFormField = {
              name: data[i]?.name ? false : true,
              hyperlinkOption: data[i]?.hyperlinkOption ? false : true,
              url: data[i]?.hyperlinkOption === Hyperlink.URL && data[i]?.url ? false : true,
              categoryId: data[i]?.hyperlinkOption === Hyperlink.CATEGORY && !data[i]?.categoryId ? true : false,
              productId: data[i]?.hyperlinkOption === Hyperlink.PRODUCT_DETAIL && !data[i]?.productId ? true : false,
              pageId: data[i]?.hyperlinkOption === Hyperlink.MY_PAGES && !data[i]?.pageId ? true : false,
              blogId: data[i]?.hyperlinkOption === Hyperlink.BLOG_DETAIL && !data[i]?.blogId ? true : false,
            };
            data[i] = { ...data[i], invalidFormField: newInvalidFormField };
            validateChildren(data[i]?.children);
          }
        } else return;
      };
      validateChildren(newTree);
      if (onView === ON_VIEW_MENU_MANAGEMENT.CREATE) {
        state.create.multiLevelMenus = newTree;
      }
      if (onView === ON_VIEW_MENU_MANAGEMENT.EDIT) {
        state.edit.multiLevelMenus = newTree;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getMenuPrepareData.fulfilled, (state, action) => {
      state.menuPrepareData = action.payload;
    });
    builder.addCase(getMenuByIdAsync.pending, (state) => {
      state.edit.requestingGetDetail = true;
      state.edit.isModified = false;  
    });
    builder.addCase(getMenuByIdAsync.fulfilled, (state, action) => {
      state.edit.menu = action.payload.menu;
      state.edit.multiLevelMenus = action.payload.multiLevelMenus;
      state.edit.originalMultiLevelMenus = action.payload.multiLevelMenus;
      state.edit.requestingGetDetail = false;
    });
    builder.addCase(getMenuByIdAsync.rejected, (state) => {
      state.edit.requestingGetDetail = false;
    });
  },
});

export const menuManagementActions = menuManagementSlice.actions;
export const menuManagementSelector = (state) => state.menuManagement;

const menuManagementReducer = menuManagementSlice.reducer;
export default menuManagementReducer;
