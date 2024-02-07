import { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import Cookies from 'js-cookie'

const AuthenticatedGuard = ({ children }: { children: ReactElement }) => {
  const isAuthenticated = Cookies.get('jwt') !== undefined;

  if (isAuthenticated) {
    return <Navigate to="/"></Navigate>;
  }

  return <>{children}</>;
};

export default AuthenticatedGuard;
