import React from "react";
import { NavLink } from "react-router-dom";

const NavItem = ({ to, children, onClick }) => {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        isActive
          ? "text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
          : "text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
      }
    >
      {children}
    </NavLink>
  );
};

export default NavItem;
