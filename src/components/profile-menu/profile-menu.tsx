import { ProfileMenuUI } from '@ui';
import { useLocation, useNavigate } from 'react-router-dom';

import { logoutUser } from '../../services/slices/userSlice';
import { useDispatch } from '../../services/store';

export const ProfileMenu = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = (): void => {
    void dispatch(logoutUser()).then((result) => {
      if (logoutUser.fulfilled.match(result)) {
        void navigate('/login', { replace: true });
      }
    });
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
