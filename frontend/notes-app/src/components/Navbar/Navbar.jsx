import React, { useState, useEffect, useRef } from 'react';
import { FaBell, FaCog, FaSignOutAlt, FaChevronDown, FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { getInitials } from '../../utils/helper';

const Navbar = ({ userInfo, onLogout }) => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);

  const handleOutsideClick = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const renderDropdownItems = () => (
    <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 z-50">
      <Link
        to="/profil"
        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left space-x-2"
      >
        <FaUser className="text-gray-500" />
        <span>Profil anzeigen</span>
      </Link>
      <Link
        to="/settings"
        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left space-x-2"
      >
        <FaCog className="text-gray-500" />
        <span>Einstellungen</span>
      </Link>
      <button
        className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left space-x-2"
        onClick={onLogout}
      >
        <FaSignOutAlt className="text-red-600" />
        <span>Abmelden</span>
      </button>
    </div>
  );

  const renderProfileImage = () => {
    if (!userInfo) return null;

    if (userInfo.profileImage) {
      return (
        <img
          src={userInfo.profileImage}
          alt={userInfo.fullName}
          className="w-8 h-8 rounded-full object-cover"
        />
      );
    }

    return (
      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
        {getInitials(userInfo.fullName)}
      </div>
    );
  };

  return (
    <nav className="bg-white shadow-md top-0 left-0 right-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo und Titel */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-800">mytacticlab</h1>
          </div>

          {/* Navigation und Benutzerinfo */}
          <div className="flex items-center space-x-4">
            {/* Benachrichtigungen */}
            <button
              className="text-gray-600 hover:text-gray-800"
              title="Benachrichtigungen"
              aria-label="Benachrichtigungen"
            >
              <FaBell className="text-lg" />
            </button>

            {/* Einstellungen */}
            <button
              className="text-gray-600 hover:text-gray-800"
              title="Einstellungen"
              aria-label="Einstellungen"
            >
              <FaCog className="text-lg" />
            </button>

            {/* Benutzerprofil mit Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                className="flex items-center space-x-3 hover:bg-gray-100 rounded-lg px-2 py-1 transition-colors duration-150"
                onClick={() => setDropdownVisible(!isDropdownVisible)}
              >
                <div className="flex items-center space-x-2">
                  {renderProfileImage()}
                  {userInfo && (
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium">{userInfo.fullName}</span>
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                        {userInfo.role || 'Admin'}
                      </span>
                    </div>
                  )}
                </div>
                <FaChevronDown
                  className={`text-gray-600 transition-transform duration-200 ${
                    isDropdownVisible ? 'transform rotate-180' : ''
                  }`}
                />
              </button>
              {/* Dropdown-Menü */}
              {isDropdownVisible && renderDropdownItems()}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;