import React from 'react';
import { FaMagnifyingGlass } from 'react-icons/fa6';  // Such-Icon (Lupe)
import { IoMdClose } from 'react-icons/io';  // Schließen-Icon (X)

const SearchBar = ({ value, onChange, handleSearch, onClearSearch }) => {
  return (
    <div className="w-80 flex items-center px-4 bg-slate-100 rounded-md">
      <input
        type="text"
        placeholder="Search Notes"
        className="w-full text-xs bg-transparent py-[11px] outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}  // Zustand aktualisieren
      />
      
      {/* Wenn es einen Wert gibt, wird das Schließen-Icon angezeigt */}
      {value && (
        <IoMdClose
          className="text-xl text-slate-500 cursor-pointer hover:text-black mr-3"
          onClick={onClearSearch}  // Aufruf der Funktion, um die Suche zu löschen
        />
      )}

      {/* Lupe als Such-Button */}
      <FaMagnifyingGlass
        className="text-slate-400 cursor-pointer hover:text-black"
        onClick={handleSearch}  // Führt die Suchfunktion aus
      />
    </div>
  );
};

export default SearchBar;
