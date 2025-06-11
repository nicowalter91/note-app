// Importieren von React, date-fns (für Datumsformatierung) und Icons von 'react-icons' für UI-Elemente
import React from 'react';
import { MdDelete, MdEdit, MdPushPin } from 'react-icons/md';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';


// NoteCard-Komponente: Eine Komponente zur Darstellung einer Notizkarte
const NoteCard = ({ 
  title, 
  date, 
  content, 
  tags, 
  isPinned, 
  onEdit, 
  onDelete, 
  onPinNote,
  viewMode = 'grid'
}) => {
  // Datum im gewünschten Format und mit deutscher Lokalisierung
  const formattedDate = format(new Date(date), 'dd. MMMM yyyy', { locale: de });

  // Grid-Layout für die Notizkarte
  const gridCard = (
    <div className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 relative ${
      isPinned ? 'border-2 border-blue-500' : ''
    }`}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-800 flex-grow pr-8">{title}</h3>
        {/* Button zum Pinnen der Notiz */}
        <button
          onClick={onPinNote}
          className={`absolute top-2 right-2 p-2 rounded-full hover:bg-gray-100 transition-colors ${
            isPinned ? 'text-blue-500' : 'text-gray-400'
          }`}
        >
          <MdPushPin size={20} />
        </button>
      </div>
      
      <div className="mb-4">
        {/* Inhalt der Notiz (mit Begrenzung auf 3 Zeilen) */}
        <p className="text-gray-600 line-clamp-3">{content}</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {/* Tags der Notiz als Pillen anzeigen */}
        {tags.map((tag, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
        {/* Formatiertes Datum */}
        <span className="text-sm text-gray-500">{formattedDate}</span>
        <div className="flex gap-2">
          {/* Bearbeiten-Button */}
          <button
            onClick={onEdit}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors"
          >
            <MdEdit size={20} />
          </button>
          {/* Löschen-Button */}
          <button
            onClick={onDelete}
            className="p-2 hover:bg-red-100 rounded-full text-red-600 transition-colors"
          >
            <MdDelete size={20} />
          </button>
        </div>
      </div>
    </div>
  );

  // List-Layout für die Notizkarte
  const listCard = (
    <div className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 relative ${
      isPinned ? 'border-l-4 border-blue-500' : ''
    }`}>
      <div className="flex items-center gap-4">
        <div className="flex-grow">
          <div className="flex items-start justify-between">
            {/* Titel der Notiz */}
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            <div className="flex items-center gap-2">
              {/* Pin-Button */}
              <button
                onClick={onPinNote}
                className={`p-1.5 rounded-full hover:bg-gray-100 transition-colors ${
                  isPinned ? 'text-blue-500' : 'text-gray-400'
                }`}
              >
                <MdPushPin size={18} />
              </button>
              {/* Bearbeiten-Button */}
              <button
                onClick={onEdit}
                className="p-1.5 hover:bg-gray-100 rounded-full text-gray-600 transition-colors"
              >
                <MdEdit size={18} />
              </button>
              {/* Löschen-Button */}
              <button
                onClick={onDelete}
                className="p-1.5 hover:bg-red-100 rounded-full text-red-600 transition-colors"
              >
                <MdDelete size={18} />
              </button>
            </div>
          </div>
          
          {/* Inhalt der Notiz (mit Begrenzung auf 1 Zeile) */}
          <p className="text-gray-600 line-clamp-1 mt-1">{content}</p>
          
          <div className="flex items-center gap-4 mt-2">
            {/* Formatiertes Datum */}
            <span className="text-sm text-gray-500">{formattedDate}</span>
            <div className="flex flex-wrap gap-2">
              {/* Tags der Notiz als Pillen anzeigen */}
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Rückgabe des entsprechenden Layouts basierend auf dem viewMode
  return viewMode === 'grid' ? gridCard : listCard;
};

// Exportiert die NoteCard-Komponente, damit sie in anderen Teilen der Anwendung verwendet werden kann
export default NoteCard;
