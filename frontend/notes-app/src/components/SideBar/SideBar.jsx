import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FaHome,
  FaCalendarAlt,
  FaUsers,
  FaStickyNote,
  FaCog,
  FaSignOutAlt,
  FaMoneyBillWave,
} from 'react-icons/fa';

const Sidebar = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const isActive = (path) => location.pathname.startsWith(`/${path.toLowerCase()}`);

  const renderNavItems = (items) => {
    return items.map((item) => (
      <li key={item.path}>
        <Link
          to={`/${item.path}`}
          className={`flex items-center space-x-2 p-2 rounded-md transition-all duration-200 ${
            isActive(item.path)
              ? 'bg-blue-500 text-white shadow-lg'
              : 'text-gray-600 hover:bg-gray-200 hover:text-blue-600'
          }`}
        >
          <item.icon />
          <span>{item.label}</span>
        </Link>
      </li>
    ));
  };

  const menuItems = [
    { path: 'dashboard', icon: FaHome, label: 'Dashboard' },
    { path: 'events', icon: FaCalendarAlt, label: 'Events' },
    { path: 'team', icon: FaUsers, label: 'Team' },
    { path: 'teamcashbox', icon: FaMoneyBillWave, label: 'Mannschaftskasse' },
    { path: 'notes', icon: FaStickyNote, label: 'Notizen' },
    { path: 'settings', icon: FaCog, label: 'Einstellungen' },
  ];

  const otherItems = [
    { path: 'logout', icon: FaSignOutAlt, label: 'Logout' },
  ];

  return (
    <div className="fixed h-full bg-gradient-to-b from-blue-700 to-blue-500 text-white flex flex-col z-50 shadow-lg w-64">
      {/* Navigation Links */}
      <div className="h-full w-64 bg-gray-100 shadow-md border-r border-gray-200 flex flex-col">
        <nav className="flex-1 p-4">
          <ul className="space-y-4">
            {/* Menu Section */}
            <li className="text-gray-500 uppercase text-xs font-bold">Menu</li>
            {renderNavItems(menuItems)}

            {/* Divider */}
            <hr className="border-gray-300 my-4" />

            {/* Other Section */}
            <li className="text-gray-500 uppercase text-xs font-bold">Other</li>
            {renderNavItems(otherItems)}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
