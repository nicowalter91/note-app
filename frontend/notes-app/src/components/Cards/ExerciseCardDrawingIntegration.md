# Anleitung zur Integration der Zeichenfunktion in ExerciseCard

Die ExerciseCard-Datei scheint einige strukturelle Probleme zu haben, die eine direkte Bearbeitung erschweren. Hier ist eine Anleitung, wie die Zeichenfunktion in die ExerciseCard integriert werden kann:

## 1. Imports ergänzen

```jsx
import React, { useState } from 'react';
import moment from 'moment';
import { MdOutlinePushPin } from 'react-icons/md';
import Modal from 'react-modal'; 
import { FaPen, FaTrashAlt, FaTimes, FaStar, FaPlus, FaExpand, FaPencilAlt } from 'react-icons/fa';
import ExerciseDrawingButton from '../DrawingCanvas/ExerciseDrawingButton';
```

## 2. State hinzufügen

```jsx
// Extrahiere Exercise-Daten
const { title, organisation, durchfuehrung, coaching, variante, tags, category, image, drawing, date, isPinned } = exerciseData || {};
```

## 3. Handler für das Speichern der Zeichnung hinzufügen

```jsx
// Callback für das Speichern einer Zeichnung
const handleDrawingSaved = (filename) => {
  if (onEdit && filename) {
    // Die Übung mit der neuen Zeichnung aktualisieren
    const updatedExercise = { ...exerciseData, drawing: filename };
    onEdit(updatedExercise);
  }
};
```

## 4. Zeichenbutton in die Action Buttons einfügen

Finde den Bereich mit den Action Buttons in beiden Modal-Ansichten und füge den Button ein:

```jsx
<div className="flex gap-3 pt-4 border-t border-gray-200">
  <button
    onClick={() => {
      closeModal();
      onEdit();
    }}
    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
  >
    <FaPen className="w-4 h-4" />
    Bearbeiten
  </button>
  
  {/* Zeichenbutton hinzufügen */}
  <ExerciseDrawingButton onDrawingSaved={handleDrawingSaved} />
  
  <button
    onClick={() => {
      closeModal();
      onDelete();
    }}
    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-red-600 rounded-lg transition-colors"
  >
    <FaTrashAlt className="w-4 h-4" />
    Löschen
  </button>
</div>
```

## 5. Anzeige der Zeichnung hinzufügen

Füge einen Bereich für die Anzeige der Zeichnung unterhalb des Bildes hinzu:

```jsx
{/* Image Section */}
<div className="aspect-video bg-gray-100 rounded-lg overflow-hidden shadow-sm">
  {/* Existierender Bildcode... */}
</div>

{/* Drawing Section - wenn eine Zeichnung vorhanden ist */}
{drawing && (
  <div className="mt-4">
    <h4 className="text-sm font-semibold text-gray-700 mb-2">Zeichnung</h4>
    <div className="bg-gray-100 rounded-lg overflow-hidden shadow-sm">
      <img 
        src={`http://localhost:8000/uploads/drawings/${drawing}`} 
        alt="Übungszeichnung"
        className="w-full h-auto cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          setIsImageModalOpen(true);
        }}
      />
    </div>
  </div>
)}
```

## 6. Bildmodal anpassen, um sowohl Bild als auch Zeichnung anzuzeigen

Wenn auf ein Bild oder eine Zeichnung geklickt wird, kann das Bildmodal verwendet werden, um beides anzuzeigen:

```jsx
{/* Fullscreen Image Modal */}
<Modal
  isOpen={isImageModalOpen}
  onRequestClose={closeImageModal}
  shouldCloseOnOverlayClick={true}
  shouldCloseOnEsc={true}
  style={{
    content: {
      // ...Styling
    }
  }}
>
  <div className="relative flex items-center justify-center w-full h-full">
    {(image || drawing) && (
      <img 
        src={`http://localhost:8000/uploads/${image ? 'exercises/' + image : 'drawings/' + drawing}`}
        alt={title}
        className="max-w-[90vw] max-h-[85vh] object-contain rounded shadow-lg"
        style={{ objectFit: 'contain' }}
      />
    )}
    <button
      onClick={closeImageModal}
      className="absolute top-2 right-2 p-2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full transition-colors"
    >
      <FaTimes className="w-5 h-5" />
    </button>
  </div>
</Modal>
```

Durch diese Änderungen wird die Zeichenfunktion in die ExerciseCard integriert. Da die Datei Strukturprobleme aufweist, ist es möglicherweise besser, sie komplett neu zu schreiben oder die Änderungen schrittweise vorzunehmen und nach jedem Schritt zu testen.
