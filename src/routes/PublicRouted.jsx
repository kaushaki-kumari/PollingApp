import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();

  return isAuthenticated ? (
    <Navigate to="/polls" state={{ from: location }} replace />
  ) : (
    children
  );
};

export default PublicRoute;
