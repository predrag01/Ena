import { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import Cookies from 'js-cookie'

const UnauthenticatedGuard = ({ children }: { children: ReactElement }) => {
    const isAuthenticated = Cookies.get('jwt') !== undefined;

  if (!isAuthenticated) {
    return <Navigate to="/Login"></Navigate>;
  }

  return <>{children}</>;
};

export default UnauthenticatedGuard;
