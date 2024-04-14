import { FC } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useStore } from '../stores/store';

const RequireAuth: FC = () => {
  const {
    userStore: { isLoggedIn },
  } = useStore();

  const location = useLocation();

  if (!isLoggedIn) {
    return (
      <Navigate
        to="/"
        state={{ from: location }}
      />
    );
  }

  return <Outlet />;
};

RequireAuth.displayName = 'RequireAuth';

export default RequireAuth;
