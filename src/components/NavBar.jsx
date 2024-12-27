import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/authSlice";
import { RxAvatar } from "react-icons/rx";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { MdLogout } from "react-icons/md";

const NavBar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.roleId === 2;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-4">
            <Link
              to="/pollpage"
              className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Polls
            </Link>
            {isAdmin && (
              <div className="hidden md:flex space-x-4">
                <Link
                  to="/add-poll"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Add Poll
                </Link>
                <Link
                  to="/create-user"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Create User
                </Link>
                <Link
                  to="/list-users"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  List Users
                </Link>
              </div>
            )}
          </div>

          <div className="md:hidden">
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
                  <div className="py-3 flex justify-center gap-2">
                    <MdLogout
                      onClick={handleLogout}
                      className="text-gray-700 hover:text-red-500 cursor-pointer h-6 w-6"
                      title="Logout"
                    /> Logout
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden mt-4 space-y-4">
            <Link
              to="/pollpage"
              className="block text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium"
            >
              Polls
            </Link>
            {isAdmin && (
              <div className="space-y-4">
                <Link
                  to="/add-poll"
                  className="block text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium"
                >
                  Add Poll
                </Link>
                <Link
                  to="/create-user"
                  className="block text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium"
                >
                  Create User
                </Link>
                <Link
                  to="/list-users"
                  className="block text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium"
                >
                  List Users
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
