
import { Preloader, OrderInfoUI } from '@ui';
import { useEffect, useMemo, useState } from 'react';
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

  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const orderNumber = Number(number);
  const isValidNumber =
    Boolean(number) &&
    Number.isInteger(orderNumber) &&
    orderNumber > 0;

  useEffect(() => {
    let cancelled = false;

    setIsFetching(true);
    setError(null);

    if (!isValidNumber) {
      setIsFetching(false);
      return;
    }

    void dispatch(fetchOrderByNumber(orderNumber))
      .unwrap()
      .catch(() => {
        if (!cancelled) {
          setError('Не удалось загрузить заказ');
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsFetching(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [dispatch, orderNumber, isValidNumber]);

  const orderData = useMemo(() => {
    if (!isValidNumber) return null;

    if (currentOrder?.number === orderNumber) {
      return currentOrder;
    }

    return (
      userOrders.find(
        (order) => order.number === orderNumber
      ) ||
      feed.orders.find(
        (order) => order.number === orderNumber
      ) ||
      null
    );
  }, [
    currentOrder,
    userOrders,
    feed.orders,
    orderNumber,
    isValidNumber
  ]);

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

  if (!isValidNumber) {
    return (
      <p className="text text_type_main-medium mt-10">
        Некорректный номер заказа
      </p>
    );
  }

  if (isFetching) {
    return <Preloader />;
  }

  if (error && !orderInfo) {
    return (
      <p className="text text_type_main-medium mt-10">
        {error}
      </p>
    );
  }

  if (!orderInfo) {
    return (
      <p className="text text_type_main-medium mt-10">
        Заказ не найден
      </p>
    );
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
