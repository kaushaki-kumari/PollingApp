import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { ROLE_ADMIN } from "../utils/constant";
import NavBar from "../components/NavBar";

const CustomRoute = ({ type, children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();

  switch (type) {
    case "public":
      return isAuthenticated ? (
        <Navigate to="/polls" state={{ from: location }} replace />
      ) : (
        children
      );
    
    case "protected":
      if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
      }
      return (
        <>
          <NavBar />
          {children}
        </>
      );
    
    case "admin":
      if (!user || user.roleId !== ROLE_ADMIN) {
        return <Navigate to="/polls" replace />;
      }
      return children;
    
    default:
      return children;
  }
};

export default CustomRoute;