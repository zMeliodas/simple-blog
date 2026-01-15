import React from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../redux/store";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session, initialized } = useAppSelector((state) => state.auth);

  if (!initialized) return null;

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;