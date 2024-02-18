import { createAsyncThunk, createDraftSafeSelector, createSlice } from '@reduxjs/toolkit/dist';
import commonDataService from 'data-services/common/common-data.service';

const initialState = {
  loadingBranch: false,
  branches: undefined,
  loadingArea: false,
  areas: undefined,
};

export const getAllBranchManagement = createAsyncThunk(
  '/branch/get-all-branch-management',
  async () => {
    const response = await commonDataService.getAllBranchManagementAsync();
    return response;
  }
);

export const getAreasAreaTablesByBranchId = createAsyncThunk(
  '/area/branch',
  async (params) => {
    const response = await commonDataService.getAreasAreaTablesByBranchIdAsync(params);
    return response;
  }
);

const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllBranchManagement.pending, (state) => {
        state.loadingBranch = true;
      })
      .addCase(getAllBranchManagement.fulfilled, (state, action) => {
        state.loadingBranch = false;
        state.branches = action.payload?.branchs;
      })
      .addCase(getAllBranchManagement.rejected, (state) => {
        state.loadingBranch = false;
        state.branches = undefined;
      })
      .addCase(getAreasAreaTablesByBranchId.pending, (state) => {
        state.loadingArea = true;
      })
      .addCase(getAreasAreaTablesByBranchId.fulfilled, (state, action) => {
        state.loadingArea = false;
        state.areas = action.payload;
      })
      .addCase(getAreasAreaTablesByBranchId.rejected, (state) => {
        state.loadingArea = false;
        state.areas = undefined;
      });
  },
});

export const commonActions = commonSlice.actions;

export const commonSelector = (state) => state.common;

export const branchesSelector = (state) => state.common?.branches;

export const branchOptionSelector = createDraftSafeSelector(branchesSelector, (branches) =>
  branches?.map((branch) => {
        return { label: branch?.name, value: branch?.id };
    })
);

export const areasSelector = (state) => state.common?.areas;

export const areaOptionSelector = createDraftSafeSelector(areasSelector, (areas) =>
  areas?.map((area) => {
        return { label: area?.name, value: area?.id };
    })
);

const commonReducer = commonSlice.reducer;

export default commonReducer;