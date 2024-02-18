import { createAsyncThunk, createSlice } from '@reduxjs/toolkit/dist';
import { OptionDateTime } from 'constants/option-date.constants';
import reserveTableDataService from 'data-services/reserveTable/reserve-table-data.service';
import moment from "moment";

const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_SIZE = 20;
const DEFAULT_FORMAT_DATE = 'MM/D/YYYY, hh:mm:ss A';

const initialState = {
  loadingReserveTable: false,
  reserveTables: undefined,
  reserveTableParams: {
    pageNumber: DEFAULT_PAGE_NUMBER,
    pageSize: DEFAULT_PAGE_SIZE,
    startDate: moment().startOf("day").locale("en-US").format(DEFAULT_FORMAT_DATE),
    endDate: moment().endOf("day").locale("en-US").format(DEFAULT_FORMAT_DATE),
    businessSummaryWidgetFilter: OptionDateTime.today,
  },
  reserveTableCurrentPage: 1,
  reserveTableTotal: 0,
};

export const getReserveTables = createAsyncThunk(
  '/reservetable',
  async (params) => {
    const response = await reserveTableDataService.getReserveTablesAsync(params);
    return response;
  }
);

const reserveTableSlice = createSlice({
  name: 'reserveTable',
  initialState,
  reducers: {
    setReserveTableParams(state, action) {
      state.reserveTableParams = action.payload;
    },
    resetReserveTableParams(state) {
      state.reserveTableParams = {
        pageNumber: DEFAULT_PAGE_NUMBER,
        pageSize: DEFAULT_PAGE_SIZE,
        startDate: moment().startOf("day").locale("en-US").format(DEFAULT_FORMAT_DATE),
        endDate: moment().endOf("day").locale("en-US").format(DEFAULT_FORMAT_DATE),
        businessSummaryWidgetFilter: OptionDateTime.today,
      };
      state.reserveTables = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getReserveTables.pending, (state) => {
        state.loadingReserveTable = true;
      })
      .addCase(getReserveTables.fulfilled, (state, action) => {
        state.loadingReserveTable = false;
        state.reserveTables = action.payload?.reserveTables;
        state.reserveTableCurrentPage = action.payload?.pageNumber;
        state.reserveTableTotal = action.payload?.total;
      })
      .addCase(getReserveTables.rejected, (state) => {
        state.loadingReserveTable = false;
        state.reserveTables = undefined;
      });
  },
});

export const reserveTableActions = reserveTableSlice.actions;

export const reserveTableSelector = (state) => state.reserveTable;

const reserveTableReducer = reserveTableSlice.reducer;

export default reserveTableReducer;