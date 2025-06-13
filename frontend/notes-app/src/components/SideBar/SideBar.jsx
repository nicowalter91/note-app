import React from 'react';
import { FaPen, FaDumbbell, FaTools, FaSignOutAlt, FaUser, FaUsers, FaClipboard, FaVideo, FaHome, FaCog, FaBell } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ onLogout, userInfo }) => {
  const navigate = useNavigate();
  const location = useLocation();  // Zugriff auf die aktuelle URL

  onLogout = () => {
    localStorage.clear(); // Löscht alle Daten im lokalen Speicher.
    navigate("/login");   // Navigiert den Benutzer zur Login-Seite.
  };

  // Funktion, um zu überprüfen, ob der aktuelle Pfad der aktiven Seite entspricht
  const isActive = (path) => {
    return location.pathname === `/${path.toLowerCase()}`;
  };

  // Updated NavItem component to include hover effects and modern styling
  const NavItem = ({ icon, label, onClick }) => {
    const active = isActive(label);

    return (
      <a
        href={label.toLowerCase() !== 'logout' ? `/${label.toLowerCase()}` : '#'}
        onClick={onClick}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition duration-300 transform hover:scale-105
          ${active ? 'bg-white text-blue-600 shadow-md' : 'hover:bg-white hover:text-blue-500'}
        `}
      >
        <span className="text-sm">{icon}</span> {/* Reduced icon size */}
        <span className="text-xs font-medium">{label}</span> {/* Reduced label size */}
      </a>
    );
  };

  return (
    <div className="w-64 h-screen bg-gradient-to-b from-blue-700 to-blue-500 text-white flex flex-col py-4 shadow-lg overflow-y-auto justify-between">
      <div>
        {/* User Info Section */}
        <div className="flex items-center gap-3 px-4 mb-6">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-blue-600 font-bold text-sm">
            {userInfo?.name?.[0] || 'U'}
          </div>
          <div>
            <p className="text-xs font-medium">{userInfo?.name || 'Guest'}</p>
            <p className="text-[10px] text-blue-200">{userInfo?.email || 'Not logged in'}</p>
          </div>
        </div>

        {/* HOME Section */}
        <div className="mb-6 px-4">
          <h2 className="text-sm font-semibold mb-3">HOME</h2>
          <nav className="flex flex-col space-y-2">
            <NavItem icon={<FaHome />} label="Dashboard" onClick={() => navigate('/dashboard')} />
            <NavItem icon={<FaPen />} label="Notes" />
            <NavItem icon={<FaDumbbell />} label="Exercises" />
          </nav>
        </div>

        {/* TEAM MANAGEMENT Section */}
        <div className="mb-6 px-4">
          <h2 className="text-sm font-semibold mb-3">TEAM MANAGEMENT</h2>
          <nav className="flex flex-col space-y-2">
            <NavItem icon={<FaUsers />} label="Players" />
            <NavItem icon={<FaClipboard />} label="Schedule" />
            <NavItem icon={<FaClipboard />} label="Statistics" />
            <NavItem icon={<FaClipboard />} label="Training" />
            <NavItem icon={<FaClipboard />} label="Tactics" />
          </nav>
        </div>

        {/* OTHER Section */}
        <div className="px-4">
          <h2 className="text-sm font-semibold mb-3">OTHER</h2>
          <nav className="flex flex-col space-y-2">
            <NavItem icon={<FaUser />} label="Profil" />
            <NavItem icon={<FaCog />} label="Settings" />
            <NavItem icon={<FaSignOutAlt />} label="Logout" onClick={onLogout} />
          </nav>
        </div>
      </div>

      
      {/* Logout Section */}
    </div>
  );
};

export default Sidebar;
