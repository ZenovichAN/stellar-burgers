import { FeedInfoUI } from '@ui';

import { selectFeed } from '../../services/slices/feedSlice';
import { useSelector } from '../../services/store';

import type { TOrder } from '@utils-types';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo = (): React.JSX.Element => {
  const feed = useSelector(selectFeed);

  return (
    <FeedInfoUI
      readyOrders={getOrders(feed.orders, 'done')}
      pendingOrders={getOrders(feed.orders, 'pending')}
      feed={feed}
    />
  );
};
