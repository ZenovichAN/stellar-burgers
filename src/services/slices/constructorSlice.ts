import { createSlice, nanoid } from '@reduxjs/toolkit';

import type { RootState } from '../store';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  TIngredient,
  TConstructorIngredient,
  TConstructorState,
} from '@utils-types';

const initialState: TConstructorState = {
  bun: null,
  ingredients: [],
};

const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => ({
        payload: {
          ...ingredient,
          id: nanoid(),
        },
      }),
    },

    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter((item) => item.id !== action.payload);
    },

    moveIngredient: (
      state,
      action: PayloadAction<{
        from: number;
        to: number;
      }>
    ) => {
      const { from, to } = action.payload;

      if (
        from < 0 ||
        to < 0 ||
        from >= state.ingredients.length ||
        to >= state.ingredients.length
      ) {
        return;
      }

      const [ingredient] = state.ingredients.splice(from, 1);
      state.ingredients.splice(to, 0, ingredient);
    },

    clearConstructor: (): TConstructorState => initialState,
  },
});

export const { addIngredient, removeIngredient, moveIngredient, clearConstructor } =
  constructorSlice.actions;

export const selectConstructorItems = (state: RootState): TConstructorState =>
  state.burgerConstructor;

export default constructorSlice.reducer;
