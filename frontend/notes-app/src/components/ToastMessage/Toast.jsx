import React, { useEffect, useState } from 'react';
import { LuCheck } from 'react-icons/lu';
import { MdDeleteOutline } from 'react-icons/md';

const Toast = ({ isShown, message, type, onClose }) => {
  // Zustand für die Sichtbarkeit des Toasts mit Übergang
  const [visible, setVisible] = useState(isShown);

  useEffect(() => {
    if (isShown) {
      setVisible(true);  // Toast wird angezeigt, Übergang beginnt
    } else {
      setTimeout(() => {
        setVisible(false); // Verzögert das Verstecken des Toasts, nachdem der Toast unsichtbar wurde
      }, 300); // Übergangszeit (z.B. 300ms)
    }
  }, [isShown]);

  // Timeout für automatisches Schließen nach 3 Sekunden
  useEffect(() => {
    if (isShown) {
      const timeoutId = setTimeout(() => {
        onClose();  // Schließt den Toast nach 3 Sekunden
      }, 3000);
  
      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [isShown, onClose]);

  // Funktion zum Schließen des Toasts beim Klicken
  const handleToastClick = () => {
    onClose(); // Ruft die onClose-Funktion auf, wenn der Toast angeklickt wird
  };

  return (
    // Toast mit Transitionen für sanftes Ein- und Ausblenden
    <div 
      className={`z-999 absolute top-20 right-6 transition-opacity duration-300 ease-in-out ${visible ? 'opacity-100' : 'opacity-0'}`} 
      onClick={handleToastClick}  // Klick-Interaktion zum Schließen des Toasts
    >
      <div className={`min-w-52 bg-white border shadow-2xl rounded-md after:w-[5px] after:h-full ${
          type === 'delete' ? 'after:bg-red-500' : 'after:bg-green-500'
        } after:absolute after:left-0 after:top-0 after:rounded-l-lg`}>
        
        <div className='flex items-center gap-3 py-2 px-4'>
          <div className={`w-10 h-10 flex items-center justify-center rounded-full ${
            type === "delete" ? "bg-red-50" : "bg-green-50"
          }`}>
            {type === 'delete' ? (
              <MdDeleteOutline className='text-xl text-red-500' />
            ) : (
              <LuCheck className='text-xl text-green-500'/>
            )}
          </div>
          <p className='text-sm text-slate-800'>{message}</p>
        </div>
      </div>
    </div>
  );
};

export default Toast;
