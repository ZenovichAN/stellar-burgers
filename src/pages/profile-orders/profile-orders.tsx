
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

    const interval = window.setInterval(() => {
      void dispatch(fetchUserOrders());
    }, 15000);

    return () => {
      window.clearInterval(interval);
    };
  }, [dispatch]);

  if (isLoading && orders.length === 0) {
    return <Preloader />;
  }

  return (
    <>
      {error && (
        <p className="text text_type_main-default text_color_inactive">
          Ошибка загрузки истории: {error}
        </p>
      )}

      <ProfileOrdersUI orders={orders} />
    </>
  );
};
