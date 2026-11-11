import constructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
} from './constructorSlice';

import type { TIngredient, TConstructorIngredient } from '@utils-types';

const mockBun: TIngredient = {
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
  image_mobile: 'bun-mobile.png',
};

const mockMain: TIngredient = {
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
  image_mobile: 'main-mobile.png',
};

const mockSauce: TIngredient = {
  _id: 'sauce-1',
  name: 'Тестовый соус',
  type: 'sauce',
  proteins: 1,
  fat: 5,
  carbohydrates: 10,
  calories: 100,
  price: 50,
  image: 'sauce.png',
  image_large: 'sauce-large.png',
  image_mobile: 'sauce-mobile.png',
};

const firstIngredient: TConstructorIngredient = {
  ...mockMain,
  id: 'ingredient-1',
};

const secondIngredient: TConstructorIngredient = {
  ...mockSauce,
  id: 'ingredient-2',
};

const initialState = {
  bun: null,
  ingredients: [],
};

describe('constructorSlice', () => {
  test('возвращает начальное состояние при неизвестном экшене', () => {
    const state = constructorReducer(undefined, {
      type: 'UNKNOWN',
    });

    expect(state).toEqual(initialState);
  });

  test('добавляет булку в конструктор', () => {
    const state = constructorReducer(initialState, addIngredient(mockBun));

    expect(state.bun).toMatchObject(mockBun);
    expect(typeof state.bun?.id).toBe('string');
    expect(state.ingredients).toEqual([]);
  });

  test('заменяет булку при добавлении новой', () => {
    const firstBun = {
      ...mockBun,
      id: 'old-bun',
    };

    const state = constructorReducer(
      {
        bun: firstBun,
        ingredients: [],
      },
      addIngredient({
        ...mockBun,
        _id: 'bun-2',
        name: 'Новая булка',
      })
    );

    expect(state.bun?._id).toBe('bun-2');
    expect(state.bun?.name).toBe('Новая булка');
  });

  test('добавляет начинку в конструктор', () => {
    const state = constructorReducer(initialState, addIngredient(mockMain));

    expect(state.bun).toBeNull();
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toMatchObject(mockMain);
    expect(typeof state.ingredients[0].id).toBe('string');
  });

  test('каждому добавленному ингредиенту присваивается уникальный id', () => {
    const firstState = constructorReducer(initialState, addIngredient(mockMain));

    const secondState = constructorReducer(firstState, addIngredient(mockMain));

    expect(secondState.ingredients).toHaveLength(2);

    expect(secondState.ingredients[0].id).not.toBe(secondState.ingredients[1].id);
  });

  test('удаляет ингредиент по id', () => {
    const state = constructorReducer(
      {
        bun: null,
        ingredients: [firstIngredient, secondIngredient],
      },
      removeIngredient('ingredient-1')
    );

    expect(state.ingredients).toEqual([secondIngredient]);
  });

  test('не изменяет конструктор при удалении несуществующего id', () => {
    const previousState = {
      bun: null,
      ingredients: [firstIngredient],
    };

    const state = constructorReducer(previousState, removeIngredient('unknown-id'));

    expect(state).toEqual(previousState);
  });

  test('перемещает ингредиент вперед по списку', () => {
    const state = constructorReducer(
      {
        bun: null,
        ingredients: [firstIngredient, secondIngredient],
      },
      moveIngredient({
        from: 0,
        to: 1,
      })
    );

    expect(state.ingredients).toEqual([secondIngredient, firstIngredient]);
  });

  test('перемещает ингредиент назад по списку', () => {
    const state = constructorReducer(
      {
        bun: null,
        ingredients: [firstIngredient, secondIngredient],
      },
      moveIngredient({
        from: 1,
        to: 0,
      })
    );

    expect(state.ingredients).toEqual([secondIngredient, firstIngredient]);
  });

  test('не перемещает ингредиент при некорректном индексе', () => {
    const previousState = {
      bun: null,
      ingredients: [firstIngredient, secondIngredient],
    };

    const state = constructorReducer(
      previousState,
      moveIngredient({
        from: 0,
        to: 10,
      })
    );

    expect(state).toEqual(previousState);
  });

  test('полностью очищает конструктор', () => {
    const filledState = {
      bun: {
        ...mockBun,
        id: 'bun-id',
      },
      ingredients: [firstIngredient, secondIngredient],
    };

    const state = constructorReducer(filledState, clearConstructor());

    expect(state).toEqual(initialState);
  });
});
