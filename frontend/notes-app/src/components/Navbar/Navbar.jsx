// Importiert React, useState und andere notwendige Komponenten/Tools.
import React, { useState } from 'react';
import ProfileInfo from '../Cards/ProfileInfo'; // Importiert die ProfileInfo-Komponente.
import { useNavigate, useLocation } from 'react-router-dom'; // useLocation hinzugefügt, um den aktuellen Pfad zu prüfen.
import SearchBar from '../SearchBar/SearchBar'; // Importiert die SearchBar-Komponente.
import Logo from '../../assets/img/Logo.png'; // Korrekt: Importiere das Logo aus dem 'assets/img' Ordner.

const Navbar = ({ userInfo, onSearchNote, handleClearSearch }) => {
  const [searchQuery, setSearchQuery] = useState(""); // Zustand für die Suchabfrage.
  const navigate = useNavigate(); // Navigationsfunktion.
  const location = useLocation(); // Holt den aktuellen Pfad.

  // Funktion zum Abmelden des Benutzers.
  const onLogout = () => {
    localStorage.clear(); // Löscht alle Daten im lokalen Speicher.
    navigate("/login");   // Navigiert zur Login-Seite.
  };

  // Funktion zum Suchen nach Notizen.
  const handleSearch = () => {
    if (searchQuery) {
      onSearchNote(searchQuery);
    }
  };

  // Funktion zum Zurücksetzen der Suche.
  const onClearSearch = () => {
    setSearchQuery(""); // Setzt die Suchabfrage zurück.
    handleClearSearch();
  };

  // Bedingtes Rendern der Suchleiste, außer auf Login- und Signup-Seiten.
  const isSearchVisible = location.pathname !== "/login" && location.pathname !== "/signUp";

  return (
    <div className='fixed top-0 left-0 w-full bg-white flex items-center justify-between px-6 py-2 drop-shadow'>
      <div className='flex'>
        {/* Navigationsleiste mit Logo */}
        <img src={Logo} alt="Logo" className='h-10' />
        <h2 className='text-xl font-medium text-black py-2 ml-5'>mytacticlab</h2>
      </div>

      {/* Bedingte Anzeige der Suchleiste */}
      {isSearchVisible && (
        <SearchBar 
          value={searchQuery} 
          onChange={({ target }) => setSearchQuery(target.value)} 
          handleSearch={handleSearch} 
          onClearSearch={onClearSearch} 
        />
      )}

      {/* Anzeige der Benutzerdaten und Logout-Button */}
      <ProfileInfo 
        userInfo={userInfo} 
        onLogout={onLogout} 
      />
    </div>
  );
}

export default Navbar;
