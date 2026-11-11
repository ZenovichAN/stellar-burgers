import { ProfileUI } from '@ui-pages';
import { type SyntheticEvent, type ChangeEvent, useEffect, useState } from 'react';

import {
  updateUser,
  clearUserError,
  selectUser,
  selectUpdateUserError,
  selectIsUpdatingUser,
} from '../../services/slices/userSlice';
import { useDispatch, useSelector } from '../../services/store';

export const Profile = (): React.JSX.Element => {
  const dispatch = useDispatch();

  const user = useSelector(selectUser);
  const updateUserError = useSelector(selectUpdateUserError);
  const isUpdating = useSelector(selectIsUpdatingUser);

  const [formValue, setFormValue] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    password: '',
  });

  useEffect(() => {
    if (user) {
      setFormValue({
        name: user.name,
        email: user.email,
        password: '',
      });
    }
  }, [user]);

  const isFormChanged =
    formValue.name !== (user?.name ?? '') ||
    formValue.email !== (user?.email ?? '') ||
    formValue.password.length > 0;

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;

    setFormValue((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (updateUserError) {
      dispatch(clearUserError());
    }
  };

  const handleCancel = (e: SyntheticEvent): void => {
    e.preventDefault();

    setFormValue({
      name: user?.name ?? '',
      email: user?.email ?? '',
      password: '',
    });

    dispatch(clearUserError());
  };

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();

    if (!user || !isFormChanged || isUpdating) {
      return;
    }

    const changes: {
      name?: string;
      email?: string;
      password?: string;
    } = {};

    if (formValue.name !== user.name) {
      changes.name = formValue.name;
    }

    if (formValue.email !== user.email) {
      changes.email = formValue.email;
    }

    if (formValue.password) {
      changes.password = formValue.password;
    }

    void dispatch(updateUser(changes)).then((result) => {
      if (updateUser.fulfilled.match(result)) {
        setFormValue({
          name: result.payload.name,
          email: result.payload.email,
          password: '',
        });
      }
    });
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged && !isUpdating}
      updateUserError={updateUserError ?? undefined}
      handleSubmit={handleSubmit}
      handleCancel={handleCancel}
      handleInputChange={handleInputChange}
    />
  );
};
