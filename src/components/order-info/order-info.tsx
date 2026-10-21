
import { Preloader, OrderInfoUI } from '@ui';
import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import type { TIngredient } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import { selectIngredients } from '../../services/slices/ingredientsSlice';
import { selectFeed } from '../../services/slices/feedSlice';
import {
  fetchOrderByNumber,
  selectCurrentOrder,
  selectUserOrders
} from '../../services/slices/ordersSlice';

export const OrderInfo = (): React.JSX.Element => {
  const { number } = useParams();
  const dispatch = useDispatch();

  const ingredients = useSelector(selectIngredients);
  const feed = useSelector(selectFeed);
  const userOrders = useSelector(selectUserOrders);
  const currentOrder = useSelector(selectCurrentOrder);

  const orderNumber = Number(number);

  useEffect(() => {
    if (Number.isFinite(orderNumber) && orderNumber > 0) {
      void dispatch(fetchOrderByNumber(orderNumber));
    }
  }, [dispatch, orderNumber]);

  const orderData = useMemo(
    () =>
      currentOrder?.number === orderNumber
        ? currentOrder
        : userOrders.find(
            (order) => order.number === orderNumber
          ) ||
          feed.orders.find(
            (order) => order.number === orderNumber
          ),
    [currentOrder, userOrders, feed.orders, orderNumber]
  );

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) {
      return null;
    }

    const ingredientsInfo: Record<
      string,
      TIngredient & { count: number }
    > = {};

    orderData.ingredients.forEach((id) => {
      const ingredient = ingredients.find(
        (item) => item._id === id
      );

      if (!ingredient) return;

      if (ingredientsInfo[id]) {
        ingredientsInfo[id].count++;
      } else {
        ingredientsInfo[id] = {
          ...ingredient,
          count: 1
        };
      }
    });

    const total = Object.values(ingredientsInfo).reduce(
      (sum, item) => sum + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      total,
      date: new Date(orderData.createdAt)
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
