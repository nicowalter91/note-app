import React from 'react';
import { FaDumbbell, FaCog, FaStickyNote } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ userInfo, onLogout }) => {
  // Extrahiere den Vornamen des Benutzers aus userInfo (falls vorhanden)
  const firstName = userInfo?.fullName.split(' ')[0]; // Extrahiert den Vornamen, indem der Name am Leerzeichen geteilt wird

  const NavItem = ({ icon, label }) => (
    <a
      href={`/${label.toLowerCase()}`}
      className="flex items-center px-6 py-3 hover:bg-white hover:text-blue-500 transition duration-200"
    >
      <span className="mr-3">{icon}</span>
      <span className="text-lg">{label}</span>
    </a>
  );

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear(); // Löscht alle Daten im lokalen Speicher.
    navigate("/login");   // Navigiert den Benutzer zur Login-Seite.
  };

  return (
    <div className="fixed left-0 h-screen bg-blue-600 text-white flex flex-col">
      {/* Willkommen Text oben */}
      <div className="text-left ml-5 text-2xl py-6">
        <p className='font-medium'>Willkommen,</p>
        <p> {firstName} 👋 </p> {/* Zeigt den Vornamen unter "Willkommen" an */}
      </div>

      {/* Navigation Items */}
      <nav className="flex flex-col mt-6 space-y-2">
        <NavItem icon={<FaStickyNote />} label="Notes" />
        <NavItem icon={<FaDumbbell />} label="Exercises" />
        <NavItem icon={<FaCog />} label="Settings" />
      </nav>

      {/* Logout-Button am unteren Rand */}
      <button 
        className="text-sm text-blue-600 bg-white py-2 px-4 m-5 rounded-full mt-auto mb-20 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
        onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
