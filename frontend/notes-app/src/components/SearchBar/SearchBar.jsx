// Importiert React und die benötigten Icons aus 'react-icons'.
import React from 'react';
import { FaMagnifyingGlass } from 'react-icons/fa6';  // Such-Icon (Lupe)
import { IoMdClose } from 'react-icons/io';  // Schließen-Icon (X)

const SearchBar = ({ value, onChange, handleSearch, onClearSearch }) => {
  return (
    // Die Suchleiste als flexibles Container-Element mit definierten Abmessungen und Hintergrundfarbe
    <div className='w-80 flex items-center px-4 bg-slate-100 rounded-md'>
      
      {/* Eingabefeld für die Suche mit Platzhaltertext */}
      <input 
        type='text' 
        placeholder='Search Notes' // Platzhaltertext, der im leeren Suchfeld angezeigt wird
        className='w-full text-xs bg-transparent py-[11px] outline-none' 
        value={value}  // Der Wert des Eingabefeldes wird vom übergebenen 'value'-Prop gesteuert
        onChange={onChange}  // Führt die Funktion aus, die den Wert bei Eingabe des Benutzers aktualisiert
      />

      {/* Wenn ein Wert in der Suchleiste vorhanden ist, wird das Schließen-Icon angezeigt */}
      {value && (
        <IoMdClose 
          className='text-xl text-slate-500 cursor-pointer hover:text-black mr-3' 
          onClick={onClearSearch} // Wenn das Icon geklickt wird, wird die 'onClearSearch'-Funktion aufgerufen
        />
      )}

      {/* Lupe als Such-Button */}
      <FaMagnifyingGlass 
        className='text-slate-400 cursor-pointer hover:text-black' 
        onClick={handleSearch}  // Führt die 'handleSearch'-Funktion aus, wenn auf das Icon geklickt wird
      />
   
    </div>
  )
}

export default SearchBar;
