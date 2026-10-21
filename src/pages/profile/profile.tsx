
import { ProfileUI } from '@ui-pages';
import {
  type SyntheticEvent,
  useEffect,
  useState
} from 'react';

import { updateUserApi } from '../../utils/burger-api';
import { useSelector } from '../../services/store';
import { selectUser } from '../../services/slices/userSlice';

export const Profile = (): React.JSX.Element => {
  const user = useSelector(selectUser);

  const [savedUser, setSavedUser] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  const [formValue, setFormValue] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

  useEffect(() => {
    if (user) {
      const values = {
        name: user.name,
        email: user.email
      };

      setSavedUser(values);
      setFormValue({
        ...values,
        password: ''
      });
    }
  }, [user]);

  const isFormChanged =
    formValue.name !== savedUser.name ||
    formValue.email !== savedUser.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();

    const changes: {
      name?: string;
      email?: string;
      password?: string;
    } = {};

    if (formValue.name !== savedUser.name) {
      changes.name = formValue.name;
    }

    if (formValue.email !== savedUser.email) {
      changes.email = formValue.email;
    }

    if (formValue.password) {
      changes.password = formValue.password;
    }

    if (!Object.keys(changes).length) return;

    void updateUserApi(changes)
      .then((response) => {
        setSavedUser({
          name: response.user.name,
          email: response.user.email
        });

        setFormValue({
          name: response.user.name,
          email: response.user.email,
          password: ''
        });
      })
      .catch((error) => {
        console.error('Ошибка обновления профиля:', error);
      });
  };

  const handleCancel = (e: SyntheticEvent): void => {
    e.preventDefault();

    setFormValue({
      ...savedUser,
      password: ''
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
