import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ROLE_ADMIN } from "../utils/constant";

const AdminRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);

  if (!user || user.roleId !== ROLE_ADMIN) {
    return <Navigate to="/polls" replace />;
  }

  return children;
};

export default AdminRoute;