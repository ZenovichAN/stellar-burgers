
import { combineReducers } from '@reduxjs/toolkit';

import ingredientsReducer from './slices/ingredientsSlice';
import feedReducer from './slices/feedSlice';
import userReducer from './slices/userSlice';
import constructorReducer from './slices/constructorSlice';
import ordersReducer from './slices/ordersSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  feed: feedReducer,
  user: userReducer,
  burgerConstructor: constructorReducer,
  orders: ordersReducer
});
