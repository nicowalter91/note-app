import React, { useState } from 'react';
import Modal from 'react-modal';
import { FaPencilAlt, FaTimes } from 'react-icons/fa';

// Einfaches Beispiel, um die Zeichenfunktion zu testen
const DrawingExample = () => {
  const [isDrawingModalOpen, setIsDrawingModalOpen] = useState(false);
  const [savedDrawing, setSavedDrawing] = useState(null);
  
  // Öffnet das Zeichnen-Modal
  const openDrawingModal = () => {
    setIsDrawingModalOpen(true);
  };
  
  // Schließt das Zeichnen-Modal
  const closeDrawingModal = () => {
    setIsDrawingModalOpen(false);
  };
  
  // Callback für das Speichern einer Zeichnung
  const handleDrawingSaved = (filename) => {
    console.log('Drawing saved:', filename);
    setSavedDrawing(filename);
    closeDrawingModal();
  };
  
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Zeichnungs-Test</h2>
      
      <button 
        onClick={openDrawingModal}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        <FaPencilAlt /> Neue Zeichnung erstellen
      </button>
      
      {savedDrawing && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Gespeicherte Zeichnung:</h3>
          <img 
            src={`http://localhost:8000/uploads/drawings/${savedDrawing}`}
            alt="Gespeicherte Zeichnung"
            className="max-w-md border rounded-lg shadow-sm"
          />
        </div>
      )}
      
      {/* Drawing Modal */}
      <Modal
        isOpen={isDrawingModalOpen}
        onRequestClose={closeDrawingModal}
        contentLabel="Übung zeichnen"
        style={{
          content: {
            position: 'fixed',
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '90vw',
            height: '80vh',
            maxWidth: '1000px',
            padding: '0',
            border: 'none',
            borderRadius: '8px',
            backgroundColor: '#fff',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            overflow: 'hidden',
          },
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            zIndex: 1000,
          }
        }}
      >
        <div className="h-full flex flex-col">
          <div className="p-4 flex justify-between items-center bg-white border-b">
            <h2 className="text-xl font-bold text-gray-800">Übung zeichnen</h2>
            <button
              onClick={closeDrawingModal}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <FaTimes className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          <div className="flex-1 bg-white p-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg h-full flex items-center justify-center">
              <div className="text-center p-4">
                <FaPencilAlt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">Hier könnte Ihre Zeichnung sein.</p>
                <p className="text-gray-400 text-sm">Das ist nur ein Beispiel, um die Funktion zu testen.</p>
                <button 
                  onClick={() => handleDrawingSaved('example-drawing.png')}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Beispielzeichnung speichern
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DrawingExample;
