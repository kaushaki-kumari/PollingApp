import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../reducer/authSlice";
import { RxAvatar } from "react-icons/rx";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { MdLogout } from "react-icons/md";
import NavItem from "./NavItem";
import { ROLE_ADMIN } from "../utils/constant";

const NavBar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const adminNavItems = [
    { to: "/addPoll", label: "Add Poll" },
    { to: "/createUser", label: "Create User" },
    { to: "/listUsers", label: "List Users" },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileMenuOpen]);

  const handleCloseMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <NavItem to="/polls" onClick={handleCloseMobileMenu}>
                Polls
              </NavItem>
            </div>
            {user?.roleId === ROLE_ADMIN && (
              <div className="hidden md:flex space-x-4">
                {adminNavItems.map((item) => (
                  <NavItem
                    key={item.to}
                    to={item.to}
                    onClick={handleCloseMobileMenu}
                  >
                    {item.label}
                  </NavItem>
                ))}
              </div>
            )}
          </div>

          <div className="md:hidden mr-auto">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-gray-900 focus:outline-none"
            >
              {mobileMenuOpen ? (
                <AiOutlineClose className="h-6 w-6" />
              ) : (
                <AiOutlineMenu className="h-6 w-6" />
              )}
            </button>
          </div>

          <div className="flex items-center">
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center space-x-3 focus:outline-none"
              >
                <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                  <RxAvatar className="text-gray-500 h-6 w-6" />
                </div>
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-1 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 text-sm z-50">
                  <div className="flex flex-col items-center border-b border-gray-200 py-4">
                    <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                      <RxAvatar className="text-gray-500 h-6 w-6" />
                    </div>
                    <p className="text-gray-700 font-semibold pt-2 text-xl">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-gray-500 text-base">{user?.email}</p>
                  </div>
                  <div
                    className="py-3 flex justify-center gap-2 hover:cursor-pointer hover:text-red-500"
                    onClick={handleLogout}
                  >
                    <MdLogout className="h-6 w-6" title="Logout" />
                    Logout
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="absolute top-16 left-0 w-full bg-white shadow-lg md:hidden space-y-4">
            <NavItem to="/polls" onClick={handleCloseMobileMenu}>
              Polls
            </NavItem>
            {user?.roleId === ROLE_ADMIN && (
              <div className="flex flex-col space-y-2">
                {adminNavItems.map((item) => (
                  <NavItem
                    key={item.to}
                    to={item.to}
                    onClick={handleCloseMobileMenu}
                  >
                    {item.label}
                  </NavItem>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
