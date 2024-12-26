import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NavBar = ({ user, isAdmin }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear authentication data (e.g., from localStorage or context)
    localStorage.removeItem('user');
    // Redirect to login page
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center">
      {/* Left Section: Polls, Add Poll, Create User, List Users */}
      <div className="flex space-x-4 text-white">
        <a href="/polls" className="hover:text-gray-400">Polls</a>
        {isAdmin && (
          <>
            <a href="/add-poll" className="hover:text-gray-400">Add Poll</a>
            <a href="/create-user" className="hover:text-gray-400">Create User</a>
            <a href="/list-users" className="hover:text-gray-400">List Users</a>
          </>
        )}
      </div>

      {/* Right Section: User Avatar and Dropdown */}
      <div className="relative">
        <div 
          className="flex items-center space-x-2 cursor-pointer text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <img src={user.avatar} alt="User Avatar" className="w-8 h-8 rounded-full" />
          <span>{user.name}</span>
        </div>

        {/* Dropdown Menu */}
        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg p-2 text-gray-800">
            <p className="text-sm">{user.email}</p>
            <button 
              onClick={handleLogout}
              className="w-full text-red-500 hover:bg-gray-200 mt-2 p-2 text-left rounded-md"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
