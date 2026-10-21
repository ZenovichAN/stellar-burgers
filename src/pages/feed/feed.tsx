
import { useEffect } from 'react';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { fetchFeed, selectFeed } from '../../services/slices/feedSlice';

export const Feed = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const { orders, isLoading, error } = useSelector(selectFeed);

  const handleGetFeeds = (): void => {
    void dispatch(fetchFeed());
  };

  useEffect(() => {
    handleGetFeeds();
  }, [dispatch]);

  if (isLoading) return <Preloader />;

  if (error) {
    return (
      <p className="text text_type_main-medium">
        {error}
      </p>
    );
  }

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={handleGetFeeds}
    />
  );
};
