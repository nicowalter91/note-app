// Importieren von React und useState-Hook für die lokale Zustandsverwaltung
import React, { useState } from 'react';

// PasswordInput-Komponente: Ein Eingabefeld für Passwörter mit einer Funktion zum Umschalten der Sichtbarkeit
const PasswordInput = ({ value, onChange, placeholder, className }) => {
  
  // useState-Hook zum Verwalten des Zustands, ob das Passwort sichtbar ist oder nicht
  const [isShowPassword, setIsShowPassword] = useState(false);

  // Funktion zum Umschalten der Passwortsichtbarkeit (zeigt das Passwort an oder verbirgt es)
  const toggleShowPassword = () => {
    setIsShowPassword(!isShowPassword); // Wechselt den Zustand von true/false
  };

  // Basis-Klassen, wenn keine className übergeben wird
  const defaultClasses = 'w-full text-sm bg-transparent py-3 mr-3 rounded outline-none';
  
  // Verwende die übergebene className oder die Standard-Klassen
  const inputClasses = className || defaultClasses;

  return className ? (
    // Modernes Design mit übergebenen Klassen
    <div className='relative'>
      {/* Schloss-Icon links */}
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
        </svg>
      </div>
      
      {/* Eingabefeld */}
      <input 
        value={value}
        onChange={onChange}
        type={isShowPassword ? "text" : "password"}
        placeholder={placeholder || "Passwort"}
        className={inputClasses}
        id="password"
      />
      
      {/* Augen-Icon rechts */}
      <div 
        className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer z-10"
        onClick={toggleShowPassword}
      >
        {isShowPassword ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 hover:text-gray-700" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 hover:text-gray-700" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
            <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
          </svg>
        )}
      </div>
    </div>
  ) : (
    // Originales Design für ältere Komponenten
    <div className='flex items-center bg-transparent border-[1.5px] px-5 rounded mb-3'>
      <input 
        value={value}
        onChange={onChange}
        type={isShowPassword ? "text" : "password"}
        placeholder={placeholder || "Password"}
        className={defaultClasses}
      />
      {isShowPassword ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary cursor-pointer" viewBox="0 0 20 20" fill="currentColor" onClick={toggleShowPassword}>
          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 cursor-pointer" viewBox="0 0 20 20" fill="currentColor" onClick={toggleShowPassword}>
          <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
          <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
        </svg>
      )}
    </div>
  );
};

// Exportiert die PasswordInput-Komponente, damit sie in anderen Teilen der Anwendung verwendet werden kann
export default PasswordInput;
