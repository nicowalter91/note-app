import React from 'react';
import { FaPen, FaRunning, FaTools, FaSignOutAlt, FaUser } from 'react-icons/fa'; // Neue, passendere Icons
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ userInfo, onLogout }) => {
  const NavItem = ({ icon, label }) => (
    <a
      href={`/${label.toLowerCase()}`}
      className="flex flex-col items-center px-4 py-3 hover:bg-white hover:text-blue-500 transition duration-200"
    >
      <span className="text-xl">{icon}</span> {/* Noch kleinere Icons */}
      <span className="text-sm mt-2">{label}</span> {/* Noch kleineres Label */}
    </a>
  );

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear(); // Löscht alle Daten im lokalen Speicher.
    navigate("/login");   // Navigiert den Benutzer zur Login-Seite.
  };

  return (
    <div className="w-20 fixed left-0 h-screen bg-blue-600 text-white flex flex-col items-center py-6"> {/* Breite angepasst */}
      {/* Navigation Items */}
      <nav className="flex flex-col mt-6 space-y-4">
        <NavItem icon={<FaPen />} label="Notes" /> {/* Passenderes Icon für "Notes" */}
        <NavItem icon={<FaRunning />} label="Exercises" /> {/* Passenderes Icon für "Exercises" */}

      </nav>

      {/* Navigation Items Bottom */}
      <div className="flex item-center flex-col mt-auto mb-12">
        {/* HR mit Abstand */}
        <hr className="w-10 mx-auto border-t border-gray-300 my-4" /> {/* Zentrierte Linie */}
        <NavItem icon={<FaUser />} label="Profil" />
        <NavItem icon={<FaTools />} label="Settings" /> {/* Passenderes Icon für "Settings" */}
        <NavItem icon={<FaSignOutAlt />} label="Logout" onClick={handleLogout} />

      </div>
    </div>
  );
};

export default Sidebar;
