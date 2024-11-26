// Importiert React, useState und andere notwendige Komponenten/Tools.
import React, { useState } from 'react';
import ProfileInfo from '../Cards/ProfileInfo'; // Importiert die ProfileInfo-Komponente.
import { useNavigate } from 'react-router-dom'; // Importiert den useNavigate-Hook für die Navigation.
import SearchBar from '../SearchBar/SearchBar'; // Importiert die SearchBar-Komponente.

const Navbar = ({ userInfo, onSearchNote, handleClearSearch }) => {
  // Zustand für die Suchabfrage, die vom Benutzer eingegeben wird.
  const [searchQuery, setSearchQuery] = useState("");

  // useNavigate wird verwendet, um das Benutzer-Interface zu navigieren (z.B. Weiterleitung zu einer anderen Seite).
  const navigate = useNavigate();

  // Funktion zum Abmelden des Benutzers, entfernt alle Daten aus dem lokalen Speicher und leitet zur Login-Seite weiter.
  const onLogout = () => {
    localStorage.clear(); // Löscht alle Daten im lokalen Speicher.
    navigate("/login");   // Navigiert den Benutzer zur Login-Seite.
  };

  // Funktion, die die Notizen durchsucht, wenn eine Suchabfrage vorhanden ist.
  const handleSearch = () => {
    if(searchQuery) {  // Überprüft, ob die Suchabfrage nicht leer ist.
      onSearchNote(searchQuery);  // Ruft die übergebene Funktion `onSearchNote` auf, um nach Notizen zu suchen.
    }
  };

  // Funktion, die die Suchabfrage zurücksetzt und die Suche löscht.
  const onClearSearch = () => {
    setSearchQuery(""); // Setzt den Zustand der Suchabfrage zurück.
    handleClearSearch(); // Ruft die übergebene Funktion `handleClearSearch` auf, um die Suche zurückzusetzen.
  }

  return (
    <div className='bg-white flex items-center justify-between px-6 py-2 drop-shadow'>
        {/* Navigationsleiste mit Logo */}
        <h2 className='text-xl font-medium text-black py-2'>mytacticlab</h2>

        {/* Suchleiste mit übergebenem Wert und Handlern */}
        <SearchBar 
          value={searchQuery}  // Bindet den Zustand `searchQuery` an das Suchfeld.
          onChange={({ target }) => setSearchQuery(target.value)}  // Aktualisiert den Zustand der Suchabfrage bei Eingabe.
          handleSearch={handleSearch}  // Such-Funktion wird aufgerufen, wenn der Benutzer die Suche startet.
          onClearSearch={onClearSearch}  // Funktion zum Zurücksetzen der Suche.
        />

        {/* Anzeige der Benutzerdaten und Logout-Button */}
        <ProfileInfo 
          userInfo={userInfo}  // Überträgt die Benutzerdaten an die ProfileInfo-Komponente.
          onLogout={onLogout}  // Überträgt die Logout-Funktion an die ProfileInfo-Komponente.
        />
    </div>
  )
}

export default Navbar;
