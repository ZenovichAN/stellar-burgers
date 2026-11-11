import { Preloader } from '@ui';
import { ProfileOrdersUI } from '@ui-pages';
import { useEffect } from 'react';

import {
  fetchUserOrders,
  selectUserOrders,
  selectOrdersLoading,
  selectOrdersError,
} from '../../services/slices/ordersSlice';
import { useDispatch, useSelector } from '../../services/store';

const REFRESH_INTERVAL = 15000;

export const ProfileOrders = (): React.JSX.Element => {
  const dispatch = useDispatch();

  const orders = useSelector(selectUserOrders);
  const isLoading = useSelector(selectOrdersLoading);
  const error = useSelector(selectOrdersError);

  useEffect(() => {
    void dispatch(fetchUserOrders());

    const interval = window.setInterval(() => {
      void dispatch(fetchUserOrders());
    }, REFRESH_INTERVAL);

    return (): void => {
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
