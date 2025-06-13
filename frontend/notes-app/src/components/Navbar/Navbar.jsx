import React from 'react';
import ProfileInfo from '../Cards/ProfileInfo'; // Importiert die ProfileInfo-Komponente
import Logo from '../../assets/img/Logo.png'; // Importiert das Logo
import { FaBell } from 'react-icons/fa'; // Import notification bell icon

const Navbar = ({ userInfo, onLogout }) => {
  return (
    <div className="flex items-center justify-between px-6 py-2 bg-white shadow-md">
      <div className="flex items-center">
        <img src={Logo} alt="Logo" className="h-10" />
        <h2 className="text-xl font-medium text-black ml-5">mytacticlab</h2>
      </div>

      {/* Notification Bell */}
      <div className="relative">
        <FaBell className="text-xl text-gray-600 cursor-pointer hover:text-blue-600" />
        {/* Optional: Add a badge for unread notifications */}
        <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
      </div>

      {/* Willkommensnachricht, wenn der Benutzer eingeloggt ist */}
      {userInfo && userInfo.firstName && (
        <span className="text-lg text-gray-800 ml-4">
          Willkommen, {userInfo.firstName}!
        </span>
      )}

      {/* Anzeige der Benutzerdaten und Logout-Button */}
      <ProfileInfo userInfo={userInfo} onLogout={onLogout}/>
    </div>
  );
};

export default Navbar;
