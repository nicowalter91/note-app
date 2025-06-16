import React, { useState } from 'react';
import DrawingCanvas from '../components/DrawingCanvas/DrawingCanvas';
import DrawingModal from '../components/DrawingCanvas/DrawingModal';
import { FaPencilAlt, FaImage } from 'react-icons/fa';

const DrawingDemoPage = () => {
  const [isDrawingModalOpen, setIsDrawingModalOpen] = useState(false);
  const [savedDrawings, setSavedDrawings] = useState([]);
  
  const openDrawingModal = () => {
    setIsDrawingModalOpen(true);
  };
  
  const closeDrawingModal = () => {
    setIsDrawingModalOpen(false);
  };
  
  const handleDrawingSaved = (filename) => {
    setSavedDrawings([...savedDrawings, filename]);
    closeDrawingModal();
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Übungs-Zeichentool Demo</h1>
          
          <p className="mb-4 text-gray-700">
            Mit diesem Tool können Sie Übungen zeichnen und speichern. Die Zeichnungen werden dann als Teil der Übungsdaten gespeichert und können jederzeit angezeigt werden.
          </p>
          
          <button 
            onClick={openDrawingModal}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <FaPencilAlt /> Neue Übung zeichnen
          </button>
        </div>
        
        {savedDrawings.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Gespeicherte Zeichnungen</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedDrawings.map((drawing, index) => (
                <div key={index} className="border rounded-lg overflow-hidden shadow-sm">
                  <div className="aspect-video bg-gray-100 relative">
                    <img 
                      src={`http://localhost:8000/uploads/drawings/${drawing}`}
                      alt={`Zeichnung ${index + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="p-3 bg-white">
                    <h3 className="font-medium text-gray-800">Zeichnung {index + 1}</h3>
                    <p className="text-sm text-gray-500">{drawing}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <DrawingModal 
        isOpen={isDrawingModalOpen} 
        onClose={closeDrawingModal} 
        onSave={handleDrawingSaved} 
      />
    </div>
  );
};

export default DrawingDemoPage;
