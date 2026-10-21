
import { useEffect } from 'react';
import { ProfileOrdersUI } from '@ui-pages';
import { Preloader } from '@ui';

import { useDispatch, useSelector } from '../../services/store';
import {
  fetchUserOrders,
  selectUserOrders,
  selectOrdersLoading,
  selectOrdersError
} from '../../services/slices/ordersSlice';

export const ProfileOrders = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const orders = useSelector(selectUserOrders);
  const isLoading = useSelector(selectOrdersLoading);
  const error = useSelector(selectOrdersError);

  useEffect(() => {
    void dispatch(fetchUserOrders());

    const interval = setInterval(() => {
      void dispatch(fetchUserOrders());
    }, 15000);

    return () => clearInterval(interval);
  }, [dispatch]);

  if (isLoading && !orders.length) {
    return <Preloader />;
  }

  if (error && !orders.length) {
    return (
      <p className="text text_type_main-medium mt-10">
        Не удалось загрузить историю заказов: {error}
      </p>
    );
  }

  return <ProfileOrdersUI orders={orders} />;
};
