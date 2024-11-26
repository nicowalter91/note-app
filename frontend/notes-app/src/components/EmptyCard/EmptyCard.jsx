// Importieren von React
import React from 'react';

// EmptyCard-Komponente: Eine Komponente, die eine leere Karte mit einer Nachricht und einem Bild darstellt
const EmptyCard = ({ imgSrc, message }) => {
  return (
    // Flex-Container, der die Karte in der Mitte des Bildschirms ausrichtet
    <div className='flex flex-col items-center justify-center mt-20'>
      
      {/* Bild-Anzeige, das von der imgSrc-Prop kommt */}
      <img src={imgSrc} alt='No notes' className='w-60'/>
      
      {/* Nachricht, die von der message-Prop kommt */}
      <p className='w-1/2 text-sm font-medium text-slate-700 text-center leading-7 mt-5'>
        {message}
      </p>

    </div>
  );
}

// Exportiert die EmptyCard-Komponente, damit sie in anderen Teilen der Anwendung verwendet werden kann
export default EmptyCard;
