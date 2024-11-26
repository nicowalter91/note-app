// Importieren von React und einer Hilfsfunktion 'getInitials' aus einem Hilfsmodul
import React from 'react';
import { getInitials } from '../../utils/helper'; // Funktion, die die Initialen des Benutzernamens zurückgibt

// ProfileInfo-Komponente: Zeigt Benutzerinformationen an und ermöglicht das Abmelden
const ProfileInfo = ({ userInfo, onLogout }) => {
  return (
    // Überprüft, ob userInfo vorhanden ist (falls nicht, wird nichts gerendert)
    userInfo && (
    <div className='flex items-center gap-3'>
        {/* Avatar-Anzeige: Ein runder Kreis mit den Initialen des Benutzers */}
        <div className='w-12 h-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-100'>
            {/* Die Initialen des Benutzernamens werden über die getInitials-Funktion extrahiert */}
            {getInitials(userInfo?.fullName)}
        </div>

        {/* Benutzername und Logout-Schaltfläche */}
        <div>
            {/* Vollständiger Name des Benutzers */}
            <p className='text-sm font-medium'>{userInfo.fullName} </p>
            {/* Logout-Schaltfläche, die die onLogout-Funktion aufruft */}
            <button className='text-sm text-slate-700 underline' onClick={onLogout}>Logout</button>
        </div>
    </div>
    )
  );
};

// Exportiert die ProfileInfo-Komponente, damit sie in anderen Teilen der Anwendung verwendet werden kann
export default ProfileInfo;
