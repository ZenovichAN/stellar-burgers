
import { useEffect } from 'react';
import {
  Route,
  Routes,
  useLocation,
  useNavigate
} from 'react-router-dom';

import {
  AppHeader,
  IngredientDetails,
  Modal,
  OrderInfo
} from '@components';

import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';

import { Preloader } from '@ui';
import { ProtectedRoute } from '../protected-route/protected-route';

import {
  useDispatch,
  useSelector
} from '../../services/store';

import {
  fetchIngredients,
  selectIngredientsLoading,
  selectIngredientsError
} from '../../services/slices/ingredientsSlice';

import { checkUserAuth } from '../../services/slices/userSlice';

import styles from './app.module.css';
import '../../index.css';

const App = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectIngredientsLoading);
  const error = useSelector(selectIngredientsError);

  const location = useLocation();
  const navigate = useNavigate();

  const background = (
    location.state as {
      background?: typeof location;
    } | null
  )?.background;

  useEffect(() => {
    void dispatch(fetchIngredients());
    void dispatch(checkUserAuth());
  }, [dispatch]);

  const closeModal = (): void => {
    navigate(-1);
  };

  return (
    <div className={styles.app}>
      <AppHeader />

      {isLoading ? (
        <Preloader />
      ) : error ? (
        <p className="text text_type_main-medium">
          Не удалось загрузить ингредиенты: {error}
        </p>
      ) : (
        <>
          <Routes location={background || location}>
            <Route
              path="/"
              element={<ConstructorPage />}
            />

            <Route
              path="/feed"
              element={<Feed />}
            />

            <Route
              path="/login"
              element={
                <ProtectedRoute onlyUnAuth>
                  <Login />
                </ProtectedRoute>
              }
            />

            <Route
              path="/register"
              element={
                <ProtectedRoute onlyUnAuth>
                  <Register />
                </ProtectedRoute>
              }
            />

            <Route
              path="/forgot-password"
              element={
                <ProtectedRoute onlyUnAuth>
                  <ForgotPassword />
                </ProtectedRoute>
              }
            />

            <Route
              path="/reset-password"
              element={
                <ProtectedRoute onlyUnAuth>
                  <ResetPassword />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile/orders"
              element={
                <ProtectedRoute>
                  <ProfileOrders />
                </ProtectedRoute>
              }
            />

            <Route
              path="/ingredients/:id"
              element={
                <div className={styles.detailPageWrap}>
                  <IngredientDetails />
                </div>
              }
            />

            <Route
              path="/feed/:number"
              element={
                <div className={styles.detailPageWrap}>
                  <OrderInfo />
                </div>
              }
            />

            <Route
              path="/profile/orders/:number"
              element={
                <ProtectedRoute>
                  <div className={styles.detailPageWrap}>
                    <OrderInfo />
                  </div>
                </ProtectedRoute>
              }
            />

            <Route
              path="*"
              element={<NotFound404 />}
            />
          </Routes>

          {background && (
            <Routes>
              <Route
                path="/ingredients/:id"
                element={
                  <Modal
                    title="Детали ингредиента"
                    onClose={closeModal}
                  >
                    <IngredientDetails />
                  </Modal>
                }
              />

              <Route
                path="/feed/:number"
                element={
                  <Modal
                    title="Информация о заказе"
                    onClose={closeModal}
                  >
                    <OrderInfo />
                  </Modal>
                }
              />

              <Route
                path="/profile/orders/:number"
                element={
                  <ProtectedRoute>
                    <Modal
                      title="Информация о заказе"
                      onClose={closeModal}
                    >
                      <OrderInfo />
                    </Modal>
                  </ProtectedRoute>
                }
              />
            </Routes>
          )}
        </>
      )}
    </div>
  );
};

export default App;
