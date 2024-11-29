import React from 'react';
import { FaPen, FaRunning, FaTools, FaSignOutAlt, FaUser } from 'react-icons/fa'; // Neue, passendere Icons
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ userInfo }) => {
  const navigate = useNavigate();

  // Funktion zum Ausloggen und Weiterleitung zur Login-Seite
  const handleLogout = () => {
    localStorage.clear(); // Löscht alle Daten im lokalen Speicher.
    navigate("/login");   // Navigiert den Benutzer zur Login-Seite.
  };

  // NavItem-Komponente, die für alle Links verwendet wird
  const NavItem = ({ icon, label, onClick }) => (
    <a
      href={label.toLowerCase() !== 'logout' ? `/${label.toLowerCase()}` : '#'} // Verhindert das Navigieren, wenn es 'logout' ist
      onClick={onClick} // Führt die onClick Funktion aus (bei Logout: handleLogout)
      className="flex flex-col items-center px-4 py-3 hover:bg-white hover:text-blue-500 transition duration-200"
    >
      <span className="text-xl">{icon}</span> {/* Noch kleinere Icons */}
      <span className="text-sm mt-2">{label}</span> {/* Noch kleineres Label */}
    </a>
  );

  return (
    <div className="w-20 fixed left-0 h-screen bg-blue-600 text-white flex flex-col items-center py-6">
      {/* Navigation Items */}
      <nav className="flex flex-col space-y-4">
        <NavItem icon={<FaPen />} label="Notes" />
        <NavItem icon={<FaRunning />} label="Exercises" />
      </nav>

      {/* Navigation Items Bottom */}
      <div className="flex item-center flex-col mt-auto mb-12">
        <hr className="w-10 mx-auto border-t border-gray-300 my-4" />
        <NavItem icon={<FaUser />} label="Profil" />
        <NavItem icon={<FaTools />} label="Settings" />
        {/* Logout Button */}
        <NavItem icon={<FaSignOutAlt />} label="Logout" onClick={handleLogout} />
      </div>
    </div>
  );
};

export default Sidebar;
