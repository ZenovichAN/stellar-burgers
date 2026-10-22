import { Preloader } from '@ui';
import { Navigate, useLocation } from 'react-router-dom';

import { selectUser, selectIsAuthChecked } from '../../services/slices/userSlice';
import { useSelector } from '../../services/store';

type TProtectedRouteProps = {
  children: React.ReactElement;
  onlyUnAuth?: boolean;
};

export const ProtectedRoute = ({
  children,
  onlyUnAuth = false,
}: TProtectedRouteProps): React.JSX.Element => {
  const location = useLocation();
  const user = useSelector(selectUser);
  const isAuthChecked = useSelector(selectIsAuthChecked);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (onlyUnAuth && user) {
    const from = (location.state as { from?: string } | null)?.from ?? '/';
    return <Navigate to={from} replace />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};
