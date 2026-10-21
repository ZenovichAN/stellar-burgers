
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getFeedsApi } from '../../utils/burger-api';
import type { TOrder } from '@utils-types';

export const fetchFeed = createAsyncThunk(
  'feed/fetchFeed',
  getFeedsApi
);

type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null;
};

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null
};

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => builder
    .addCase(fetchFeed.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(fetchFeed.fulfilled, (state, action) => {
      state.isLoading = false;
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
    })
    .addCase(fetchFeed.rejected, (state, action) => {
      state.isLoading = false;
      state.error =
        action.error.message ?? 'Ошибка загрузки заказов';
    })
});

export const selectFeed = (
  state: { feed: TFeedState }
) => state.feed;

export default feedSlice.reducer;
