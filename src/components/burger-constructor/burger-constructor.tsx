import { BurgerConstructorUI } from '@ui';
import { useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import {
  selectConstructorItems,
  clearConstructor,
} from '../../services/slices/constructorSlice';
import {
  createOrder,
  clearOrderModal,
  selectOrderModalData,
  selectOrderRequest,
} from '../../services/slices/ordersSlice';
import { selectUser } from '../../services/slices/userSlice';
import { useDispatch, useSelector } from '../../services/store';

export const BurgerConstructor = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const user = useSelector(selectUser);
  const constructorItems = useSelector(selectConstructorItems);
  const orderRequest = useSelector(selectOrderRequest);
  const orderModalData = useSelector(selectOrderModalData);

  const onOrderClick = (): void => {
    if (!user) {
      void navigate('/login', {
        state: { from: location.pathname },
      });
      return;
    }

    if (!constructorItems.bun || orderRequest) {
      return;
    }

    const ingredients = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id,
    ];

    void dispatch(createOrder(ingredients)).then((result) => {
      if (createOrder.fulfilled.match(result)) {
        dispatch(clearConstructor());
      }
    });
  };

  const closeOrderModal = (): void => {
    dispatch(clearOrderModal());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce((sum, item) => sum + item.price, 0),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
