
import ingredientsReducer, {
  fetchIngredients
} from './ingredientsSlice';

import type { TIngredient } from '@utils-types';

const mockIngredients: TIngredient[] = [
  {
    _id: 'bun-1',
    name: 'Тестовая булка',
    type: 'bun',
    proteins: 10,
    fat: 5,
    carbohydrates: 20,
    calories: 200,
    price: 100,
    image: 'bun.png',
    image_large: 'bun-large.png',
    image_mobile: 'bun-mobile.png'
  },
  {
    _id: 'main-1',
    name: 'Тестовая начинка',
    type: 'main',
    proteins: 20,
    fat: 10,
    carbohydrates: 5,
    calories: 250,
    price: 200,
    image: 'main.png',
    image_large: 'main-large.png',
    image_mobile: 'main-mobile.png'
  }
];

describe('ingredientsSlice', () => {
  const initialState = {
    items: [],
    isLoading: false,
    error: null
  };

  test('возвращает начальное состояние при неизвестном экшене', () => {
    const state = ingredientsReducer(undefined, {
      type: 'UNKNOWN'
    });

    expect(state).toEqual(initialState);
  });

  test('pending устанавливает состояние загрузки', () => {
    const state = ingredientsReducer(
      initialState,
      fetchIngredients.pending('request-id')
    );

    expect(state).toEqual({
      items: [],
      isLoading: true,
      error: null
    });
  });

  test('pending очищает предыдущую ошибку', () => {
    const previousState = {
      items: [],
      isLoading: false,
      error: 'Ошибка сервера'
    };

    const state = ingredientsReducer(
      previousState,
      fetchIngredients.pending('request-id')
    );

    expect(state.error).toBeNull();
    expect(state.isLoading).toBe(true);
  });

  test('fulfilled сохраняет загруженные ингредиенты', () => {
    const loadingState = {
      items: [],
      isLoading: true,
      error: null
    };

    const state = ingredientsReducer(
      loadingState,
      fetchIngredients.fulfilled(
        mockIngredients,
        'request-id'
      )
    );

    expect(state).toEqual({
      items: mockIngredients,
      isLoading: false,
      error: null
    });
  });

  test('rejected сохраняет сообщение об ошибке', () => {
    const loadingState = {
      items: [],
      isLoading: true,
      error: null
    };

    const state = ingredientsReducer(
      loadingState,
      fetchIngredients.rejected(
        new Error('Ошибка загрузки'),
        'request-id'
      )
    );

    expect(state).toEqual({
      items: [],
      isLoading: false,
      error: 'Ошибка загрузки'
    });
  });

  test('rejected устанавливает стандартное сообщение при отсутствии текста ошибки', () => {
    const state = ingredientsReducer(
      initialState,
      fetchIngredients.rejected(
        { name: 'Error' },
        'request-id'
      )
    );

    expect(state.error).toBe(
      'Ошибка загрузки ингредиентов'
    );
    expect(state.isLoading).toBe(false);
  });
});
