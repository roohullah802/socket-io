import React from "react";
import { useAppSelector } from "../toolkit/hooks";
import { Navigate } from "react-router-dom";

function SecureRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAppSelector((state) => state.user);

  if (!isAuthenticated) {
    return <Navigate to={"/login"} replace />;
  }
  return <>{children}</>;
}

export default SecureRoute;
