// Importieren von React, Moment (für Datumsformatierung) und Icons von 'react-icons' für UI-Elemente
import React from 'react';
import moment from "moment";
import { MdOutlinePushPin } from 'react-icons/md'; // Pin-Icon
import { MdCreate, MdDelete } from 'react-icons/md'; // Edit- und Delete-Icons


// NoteCard-Komponente: Eine Komponente zur Darstellung einer Notizkarte
const NoteCard = ({ title, date, content, tags, isPinned, onEdit, onDelete, onPinNote }) => {
  return (
    <div className='border rounded p-4 bg-white hover:shadow-xl transition-all ease-out'>
        {/* Flex-Container für die obere Zeile der Notizkarte (Titel und Datum) */}
        <div className='flex items-center justify-between'>
            <div>
                {/* Titel der Notiz */}
                <h6 className='text-sm font-medium'>{title}</h6>
                {/* Formatiertes Datum */}
                <span className='text-xs text-slate-500'>{moment(date).format('DD.MM.YYYY')}</span>
            </div>

            {/* Pin-Icon, das auf den Status "isPinned" reagiert */}
            <MdOutlinePushPin
                className={`icon-btn ${isPinned ? 'text-primary' : 'text-slate-300'}`}
                onClick={onPinNote} // Event-Handler, der das Pinnen der Notiz ermöglicht
            />
        </div>  

        {/* Vorschau des Inhalts der Notiz (nur die ersten 60 Zeichen) */}
        <p className="text-xs text-slate-600 mt-2">{content?.slice(0, 120)}</p>

        {/* Tags der Notiz und Buttons für Bearbeiten und Löschen */}
        <div className="flex items-center justify-between mt-2">
            {/* Tags der Notiz als Hashtags anzeigen */}
            <div className='text-xs text-blue-500'>
                {tags.map((item) => `#${item}  `)} {/* Tags werden durch ein Array iteriert */}
            </div>

            {/* Buttons für Bearbeiten und Löschen der Notiz */}
            <div className='flex items-center gap-2'>
                {/* Bearbeiten-Icon */}
                <MdCreate className='icon-btn hover:text-green-600' onClick={onEdit} />
                {/* Löschen-Icon */}
                <MdDelete className='icon-btn hover:text-red-500' onClick={onDelete} />
            </div>
        </div>
    </div>
  );
}

// Exportiert die NoteCard-Komponente, damit sie in anderen Teilen der Anwendung verwendet werden kann
export default NoteCard;
