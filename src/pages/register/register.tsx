import { RegisterUI } from '@ui-pages';
import { type SyntheticEvent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { registerUser, selectUserError } from '../../services/slices/userSlice';
import { useDispatch, useSelector } from '../../services/store';

export const Register = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const error = useSelector(selectUserError);

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();

    void dispatch(
      registerUser({
        name: userName,
        email,
        password,
      })
    ).then((result) => {
      if (registerUser.fulfilled.match(result)) {
        const from = (location.state as { from?: string } | null)?.from ?? '/';
        void navigate(from, { replace: true });
      }
    });
  };

  return (
    <RegisterUI
      errorText={error ?? ''}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
