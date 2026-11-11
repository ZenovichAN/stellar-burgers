import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
  getUserApi,
  loginUserApi,
  registerUserApi,
  updateUserApi,
  logoutApi,
} from '../../utils/burger-api';
import { getCookie, setCookie, deleteCookie } from '../../utils/cookie';

import type { TLoginData, TRegisterData } from '../../utils/burger-api';
import type { RootState } from '../store';
import type { TUser } from '@utils-types';

type TUserState = {
  user: TUser | null;
  isAuthChecked: boolean;
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;
  updateUserError: string | null;
};

const initialState: TUserState = {
  user: null,
  isAuthChecked: false,
  isLoading: false,
  isUpdating: false,
  error: null,
  updateUserError: null,
};

export const checkUserAuth = createAsyncThunk('user/checkAuth', async () => {
  if (!getCookie('accessToken') && !localStorage.getItem('refreshToken')) {
    return null;
  }

  const response = await getUserApi();
  return response.user;
});

export const loginUser = createAsyncThunk('user/login', async (data: TLoginData) => {
  const response = await loginUserApi(data);

  setCookie('accessToken', response.accessToken);
  localStorage.setItem('refreshToken', response.refreshToken);

  return response.user;
});

export const registerUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData) => {
    const response = await registerUserApi(data);

    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);

    return response.user;
  }
);

export const updateUser = createAsyncThunk(
  'user/update',
  async (data: Partial<TRegisterData>) => {
    const response = await updateUserApi(data);
    return response.user;
  }
);

export const logoutUser = createAsyncThunk('user/logout', async () => {
  await logoutApi();

  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
      state.updateUserError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkUserAuth.pending, (state) => {
        state.isAuthChecked = false;
      })
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(checkUserAuth.rejected, (state) => {
        state.user = null;
        state.isAuthChecked = true;
      })

      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка входа';
      })

      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
        state.isAuthChecked = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка регистрации';
      })

      .addCase(updateUser.pending, (state) => {
        state.isUpdating = true;
        state.updateUserError = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isUpdating = false;
        state.updateUserError = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isUpdating = false;
        state.updateUserError = action.error.message ?? 'Ошибка обновления профиля';
      })

      .addCase(logoutUser.pending, (state) => {
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthChecked = true;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.error.message ?? 'Ошибка выхода из аккаунта';
      });
  },
});

export const { clearUserError } = userSlice.actions;

export const selectUser = (state: RootState): TUser | null => state.user.user;

export const selectIsAuthChecked = (state: RootState): boolean =>
  state.user.isAuthChecked;

export const selectUserLoading = (state: RootState): boolean => state.user.isLoading;

export const selectUserError = (state: RootState): string | null => state.user.error;

export const selectIsUpdatingUser = (state: RootState): boolean => state.user.isUpdating;

export const selectUpdateUserError = (state: RootState): string | null =>
  state.user.updateUserError;

export default userSlice.reducer;
