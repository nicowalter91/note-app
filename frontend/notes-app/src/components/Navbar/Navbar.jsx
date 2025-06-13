import React, { useState } from 'react';
import ProfileInfo from '../Cards/ProfileInfo';
import Logo from '../../assets/img/Logo.png';
import { FaBell, FaBars, FaSearch, FaGlobe, FaUserCircle } from 'react-icons/fa';

const Navbar = ({ userInfo, onLogout, notifications = [] }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const toggleNotificationDropdown = () => {
    setIsNotificationDropdownOpen(!isNotificationDropdownOpen);
  };

  const getUserInitials = (fullName = '') => {
    const names = fullName.split(' ');
    const initials = names.map(name => name.charAt(0)).join('').toUpperCase();
    return initials || '?';
  };

  const displayName = userInfo?.fullName || 'Unbekannter Benutzer';

  return (
    <div className="flex items-center justify-between px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-md sticky top-0 z-50">
      {/* Left Section: Logo */}
      <div className="flex items-center">
        <img src={Logo} alt="Logo" className="h-10 cursor-pointer" onClick={() => window.location.href = '/'} />
        <h2 className="text-xl font-medium ml-5">mytacticlab</h2>
      </div>

      {/* Center Section: Search Bar */}
      <div className="hidden md:flex items-center bg-white text-gray-700 rounded-md px-3 py-1 w-1/3">
        <FaSearch className="text-gray-500 mr-2" />
        <input
          type="text"
          placeholder="Suchen..."
          className="w-full bg-transparent outline-none"
        />
      </div>

      {/* Right Section: Icons and Profile */}
      <div className="flex items-center space-x-4">
        {/* Notification Bell */}
        <div className="relative hidden md:block">
          <FaBell
            className="text-xl cursor-pointer hover:text-yellow-400"
            onClick={toggleNotificationDropdown}
            aria-label="Notifications"
          />
          {notifications.length > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {notifications.length}
            </span>
          )}
          {isNotificationDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 bg-white text-gray-700 shadow-lg rounded-md p-4 w-64 z-50">
              <h3 className="font-medium mb-2">Benachrichtigungen</h3>
              {notifications.length > 0 ? (
                <ul>
                  {notifications.map((notification, index) => (
                    <li key={index} className="mb-1 text-sm hover:bg-gray-100 p-2 rounded-md">
                      {notification}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">Keine neuen Benachrichtigungen</p>
              )}
            </div>
          )}
        </div>

        {/* Language Switcher */}
        <div className="hidden md:block">
          <FaGlobe className="text-xl cursor-pointer hover:text-yellow-400" aria-label="Change Language" />
        </div>

        {/* User Profile Section */}
        <div className="relative hidden md:flex items-center space-x-2">
          {userInfo?.avatar ? (
            <img
              src={userInfo.avatar}
              alt="User Avatar"
              className="h-10 w-10 rounded-full cursor-pointer border-2 border-white hover:border-yellow-400"
              onClick={toggleProfileDropdown}
            />
          ) : (
            <div
              className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-blue-700 font-bold cursor-pointer border-2 border-white hover:border-yellow-400"
              onClick={toggleProfileDropdown}
            >
              {getUserInitials(userInfo?.fullName)}
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-sm font-medium">{displayName}</span>
          </div>
          {isProfileDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 bg-white text-gray-700 shadow-lg rounded-md p-4 w-48 z-50">
              <ul className="flex flex-col">
                <li>
                  <a href="/profile" className="block px-4 py-2 hover:bg-gray-100 rounded-md">
                    Profil
                  </a>
                </li>
                <li>
                  <a href="/settings" className="block px-4 py-2 hover:bg-gray-100 rounded-md">
                    Einstellungen
                  </a>
                </li>
                <li>
                  <button
                    onClick={onLogout}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded-md"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Hamburger Menu for Mobile */}
        <div className="md:hidden">
          <FaBars className="text-xl cursor-pointer" onClick={toggleMenu} aria-label="Toggle menu" />
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-14 right-0 bg-white text-gray-700 shadow-lg rounded-md p-4 w-64 z-50">
          <ul className="flex flex-col">
            <li>
              <a href="/profile" className="block px-4 py-2 hover:bg-gray-100 rounded-md">
                Profil
              </a>
            </li>
            <li>
              <a href="/settings" className="block px-4 py-2 hover:bg-gray-100 rounded-md">
                Einstellungen
              </a>
            </li>
            <li>
              <button
                onClick={onLogout}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded-md"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;
