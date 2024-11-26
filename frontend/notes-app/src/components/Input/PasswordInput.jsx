// Importieren von React und useState-Hook für die lokale Zustandsverwaltung
import React, { useState } from 'react';

// Importieren von Symbolen für das Anzeigen und Verstecken des Passworts aus der FontAwesome-Bibliothek
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';

// PasswordInput-Komponente: Ein Eingabefeld für Passwörter mit einer Funktion zum Umschalten der Sichtbarkeit
const PasswordInput = ({ value, onChange, placeholder }) => {
  
  // useState-Hook zum Verwalten des Zustands, ob das Passwort sichtbar ist oder nicht
  const [isShowPassword, setIsShowPassword] = useState(false);

  // Funktion zum Umschalten der Passwortsichtbarkeit (zeigt das Passwort an oder verbirgt es)
  const toggleShowPassword = () => {
    setIsShowPassword(!isShowPassword); // Wechselt den Zustand von true/false
  };

  return (
    // Container für das Eingabefeld mit Styling
    <div className='flex items-center bg-transparent border-[1.5px] px-5 rounded mb-3'>
      
      {/* Eingabefeld für das Passwort */}
      <input 
        value={value} // Der Wert des Eingabefeldes wird von der `value`-Prop gesteuert
        onChange={onChange} // Bei einer Änderung des Eingabewerts wird die `onChange`-Funktion aufgerufen
        type={isShowPassword ? "text" : "password"} // Der Typ des Eingabefelds wechselt zwischen 'text' und 'password', je nachdem, ob das Passwort sichtbar ist
        placeholder={placeholder || "Password"} // Zeigt den Platzhaltertext an, falls keiner übergeben wird
        className='w-full text-sm bg-transparent py-3 mr-3 rounded outline-none' // Styling des Eingabefeldes
      />
      
      {/* Icon zum Umschalten der Passwortsichtbarkeit */}
      {isShowPassword ? 
        // Wenn das Passwort sichtbar ist, wird das Augensymbol für "anzeigen" angezeigt
        <FaRegEye 
          size={22} 
          className="text-primary cursor-pointer" 
          onClick={() => toggleShowPassword()} 
        /> : 
        // Wenn das Passwort nicht sichtbar ist, wird das Augensymbol für "verbergen" angezeigt
        <FaRegEyeSlash 
          size={22} 
          className='text-slate-400 cursor-pointer' 
          onClick={() => toggleShowPassword()} 
        />
      }
    
    </div>
  );
};

// Exportiert die PasswordInput-Komponente, damit sie in anderen Teilen der Anwendung verwendet werden kann
export default PasswordInput;
