// Importiert React und den useState-Hook für Zustandsverwaltung.
import React, { useState } from 'react';

// Importiert die Icons für das Hinzufügen und Entfernen von Tags.
import { MdAdd, MdClose } from 'react-icons/md';

// TagInput-Komponente, die Tags verwaltet und hinzufügt oder entfernt.
const TagInput = ({ tags, setTags }) => {
    // Zustand für den aktuellen Wert des Eingabefeldes.
    const [inputValue, setInputValue] = useState("");

    // Handler für Änderungen im Eingabefeld, um den Zustand zu aktualisieren.
    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    // Funktion zum Hinzufügen eines neuen Tags.
    const addNewTag = () => {
        // Prüft, ob der Eingabewert nicht leer oder nur Leerzeichen ist.
        if(inputValue.trim() !== "") {
            // Fügt das neue Tag zur Liste hinzu und setzt das Eingabefeld zurück.
            setTags([...tags, inputValue.trim()]);
            setInputValue("");
        }
    };

    // Handler, um beim Drücken der "Enter"-Taste ein neues Tag hinzuzufügen.
    const handleKeyDown = (e) => {
        if(e.key === "Enter") {
            addNewTag();
        }
    };

    // Funktion zum Entfernen eines Tags aus der Liste.
    const handleRemoveTag = (tagToRemove) => {
        // Filtert das Tag aus der Liste, um es zu entfernen.
        setTags(tags.filter((tag) => tag !== tagToRemove));
    };

  return (
    <div>
        {/* Wenn Tags vorhanden sind, wird eine Liste der Tags angezeigt. */}
        {tags?.length > 0 && (
        <div className='flex items-center gap-2 flex-wrap mt-2'>
            {tags.map((tag, index ) => (
                <span key={index} className='flex items-center gap-2 text-sm text-slate-900 bg-slate-100 px-3 py-1 rounded'>
                    {/* Zeigt das Tag an, vorangestellt mit einem # */}
                    # {tag}

                    {/* Button zum Entfernen des Tags */}
                    <button onClick={() => {
                        handleRemoveTag(tag);
                    }}>
                        <MdClose />
                    </button>
                </span>
            ))}
        </div>
        )}

        {/* Eingabefeld und Hinzufügen-Button */}
        <div className='flex items-center gap-4 mt-3'>
            {/* Eingabefeld zum Hinzufügen neuer Tags */}
            <input 
                type="text" 
                value={inputValue}  // Bindet den Zustand des Eingabefelds
                className='text-sm bg-transparent border px-3 py-2 rounded outline-none' 
                placeholder='Add tags' 
                onChange={handleInputChange}  // Handler für Änderungen im Eingabefeld
                onKeyDown={handleKeyDown}    // Handler für Tastaturereignisse
            />

            {/* Button zum Hinzufügen eines neuen Tags */}
            <button className='w-8 h-8 flex items-center justify-center rounded border border-blue-700 hover:bg-blue-700' 
            onClick={() => {
                addNewTag(); // Aufruf der Funktion, um das Tag hinzuzufügen
            }}
            >
                <MdAdd className="text-2xl text-blue-700 hover:text-white"></MdAdd>
            </button>
        </div>
    </div>
  )
}

// Exportiert die TagInput-Komponente, damit sie in anderen Teilen der Anwendung verwendet werden kann.
export default TagInput;
