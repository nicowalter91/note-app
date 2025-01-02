import React from 'react';
import { FaMagnifyingGlass } from 'react-icons/fa6';  // Such-Icon (Lupe)
import { IoMdClose } from 'react-icons/io';  // Schließen-Icon (X)
import axiosInstance from '../../utils/axiosInstance';

const SearchBar = ({ value, onChange, searchUrl, onSetSearchResult, onClearSearch }) => {
  //***  Suchanfrage senden ***//
  const onSearch = async (query) => {
    if (!query.trim()) {
      onClearSearch();
      return;
    }

    try {
      const response = await axiosInstance.get(searchUrl, {
        params: { query },
      });
      if (response.data) {
        onSetSearchResult(response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Search handler when Enter key is pressed
  const handleKeyDown = async (e) => {
    if (e.key === "Enter") {
      // Trigger the search logic only when Enter is pressed
      if (value.trim()) {
        await onSearch(value); // Assume onSearch is your function for sending the search request
      }
    }
  };
  
  
  return (
    <div className="w-80 flex items-center px-4 bg-slate-100 rounded-md">
      <input
        type="text"
        placeholder="Search Notes"
        className="w-full text-xs bg-transparent py-[11px] outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}  // Zustand aktualisieren
        onKeyDown={handleKeyDown} // Trigger search on Enter key press

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
        onClick={() => onSearch(value)}  // Führt die Suchfunktion aus
      />
    </div>
  );
}
export default SearchBar;
