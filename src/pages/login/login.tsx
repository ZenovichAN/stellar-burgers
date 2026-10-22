import { LoginUI } from '@ui-pages';
import { type SyntheticEvent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { loginUser, selectUserError } from '../../services/slices/userSlice';
import { useDispatch, useSelector } from '../../services/store';

export const Login = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const error = useSelector(selectUserError);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();

    void dispatch(loginUser({ email, password })).then((result) => {
      if (loginUser.fulfilled.match(result)) {
        const from = (location.state as { from?: string } | null)?.from ?? '/';
        void navigate(from, { replace: true });
      }
    });
  };

  return (
    <LoginUI
      errorText={error ?? ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
