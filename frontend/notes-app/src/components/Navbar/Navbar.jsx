import React from 'react';
import SearchBar from '../SearchBar/SearchBar'; // Importiert die SearchBar-Komponente
import ProfileInfo from '../Cards/ProfileInfo'; // Importiert die ProfileInfo-Komponente
import Logo from '../../assets/img/Logo.png'; // Importiert das Logo

const Navbar = ({ userInfo, onSearchNote, handleClearSearch, searchQuery, setSearchQuery }) => {
  return (
    <div className="flex items-center justify-between px-6 py-2 bg-white shadow-md">
      <div className="flex items-center">
        <img src={Logo} alt="Logo" className="h-10" />
        <h2 className="text-xl font-medium text-black ml-5">mytacticlab</h2>
      </div>

      {/* Willkommensnachricht, wenn der Benutzer eingeloggt ist */}
      {userInfo && userInfo.firstName && (
        <span className="text-lg text-gray-800 ml-4">
          Willkommen, {userInfo.firstName}!
        </span>
      )}


      {/* Anzeige der Benutzerdaten und Logout-Button */}
      <ProfileInfo userInfo={userInfo} />
    </div>
  );
};

export default Navbar;
