import React from 'react';
import { FaPen, FaDumbbell, FaTools, FaSignOutAlt, FaUser, FaUsers, FaClipboard, FaVideo } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ onLogout }) => {
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

  // NavItem-Komponente, die für alle Links verwendet wird
  const NavItem = ({ icon, label, onClick }) => {
    const active = isActive(label); // Überprüfen, ob der aktuelle Pfad mit dem Label übereinstimmt

    return (
      <a
        href={label.toLowerCase() !== 'logout' ? `/${label.toLowerCase()}` : '#'} // Verhindert das Navigieren, wenn es 'logout' ist
        onClick={onClick} // Führt die onClick Funktion aus (bei Logout: handleLogout)
        className={`flex flex-col items-center px-4 py-3 transition duration-200
          ${active ? 'bg-white text-blue-600' : 'hover:bg-white hover:text-blue-500'} 
        `}
      >
        <span className="text-xl">{icon}</span> {/* Noch kleinere Icons */}
        <span className="text-sm mt-2">{label}</span> {/* Noch kleineres Label */}
      </a>
    );
  };

  return (
    <div className="w-20 fixed left-0 h-screen bg-blue-600 text-white flex flex-col items-center py-6">
      {/* Navigation Items */}
      <nav className="flex flex-col space-y-4">
        <NavItem icon={<FaPen />} label="Notes" />
        <NavItem icon={<FaDumbbell />} label="Exercises" />
        <NavItem icon={<FaUsers />} label="Team" />
        <NavItem icon={<FaClipboard />} label="Tactic" />
        <NavItem icon={<FaVideo />} label="Video" />
      </nav>

      {/* Navigation Items Bottom */}
      <div className="flex item-center flex-col mt-auto mb-12">
        <hr className="w-10 mx-auto border-t border-gray-300 my-4" />
        <NavItem icon={<FaUser />} label="Profil" />
        <NavItem icon={<FaTools />} label="Settings" />
        {/* Logout Button */}
        <NavItem icon={<FaSignOutAlt />} label="Logout" onClick={onLogout} />
      </div>
    </div>
  );
};

export default Sidebar;
