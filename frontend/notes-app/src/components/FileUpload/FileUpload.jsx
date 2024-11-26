import React, { useState } from 'react';
import { FaTrash } from 'react-icons/fa';

const ImageUpload = ({ setFile }) => {  // setFile als Prop akzeptieren
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);

  // Funktion zum Handhaben des Bild-Uploads
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    // Prüfen, ob eine Datei ausgewählt wurde
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      // Überprüfen, ob der Dateityp gültig ist
      if (validTypes.includes(file.type)) {
        setError(null);
        setImage(URL.createObjectURL(file)); // Vorschau des Bildes setzen
        setFile(file);  // Datei an die Elternkomponente weitergeben
      } else {
        setError('Bitte laden Sie nur Bilder im JPEG, PNG oder GIF-Format hoch.');
      }
    }
  };

  // Funktion zum Löschen des Bildes
  const handleDeleteImage = () => {
    setImage(null); // Lösche das Bild aus dem State
    setFile(null);  // Lösche die Datei aus dem Zustand der Elternkomponente
  };

  return (
    <div className="flex flex-col items-center justify-center mt-5">
      {!image && (
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="block mb-3 px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg file:px-3 file:py-2 file:border-0 file:bg-blue-600 file:text-white file:rounded-md items-left"
        />
      )}

      {error && <p className="text-red-500 text-xs">{error}</p>}

      {image && (
        <div className="relative w-full max-w-md mt-5">
          <img
            src={image}
            alt="Uploaded"
            className="w-full h-auto object-contain rounded-lg shadow-lg"
          />
          <button
            onClick={handleDeleteImage}
            className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-lg text-red-500 hover:bg-gray-200"
          >
            <FaTrash size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
