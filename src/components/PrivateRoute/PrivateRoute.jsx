import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { isLogin } from '../../rtk';

const PrivateRoute = () => {
  const isAuthenticated = isLogin('token');

  return isAuthenticated ? <Outlet /> : <Navigate to="/sign-in" />;
};

export default PrivateRoute;
