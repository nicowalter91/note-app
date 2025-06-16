import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import { FaPencilAlt, FaArrowLeft, FaPlus, FaSearch } from 'react-icons/fa';

const DrawingDemo = () => {
  const navigate = useNavigate();
  const [savedDrawings, setSavedDrawings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Lade gespeicherte Zeichnungen beim ersten Rendern
  useEffect(() => {
    fetchDrawings();
  }, []);
  
  // Funktion zum Laden der Zeichnungen vom Server
  const fetchDrawings = async () => {
    setIsLoading(true);
    try {
      // Diese API muss noch implementiert werden
      const response = await fetch('http://localhost:8000/api/exercises/drawings', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setSavedDrawings(data.drawings || []);
      }
    } catch (error) {
      console.error('Fehler beim Laden der Zeichnungen:', error);
      // Füge Demo-Daten hinzu, falls keine vom Server kommen
      setSavedDrawings([
        {
          id: 1,
          filename: 'drawing-example.png', 
          date: new Date().toISOString(),
          title: 'Beispielzeichnung'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Navigiere zum Zeichentool
  const goToDrawingTool = () => {
    navigate('/tools/drawing-tool');
  };
  
  // Navigiere zum Fußballübungstool
  const goToFootballExerciseTool = () => {
    navigate('/tools/football-exercise');
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">            <button 
              onClick={() => navigate(-1)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              title="Zurück"
            >
              <FaArrowLeft />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Übungen zeichnen</h1>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={goToFootballExerciseTool}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <FaPlus /> Fußballübung erstellen
            </button>
            <button 
              onClick={goToDrawingTool}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <FaPlus /> Neue Zeichnung
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Übungsdiagramme mit dem Zeichentool erstellen
          </h2>
          <p className="text-gray-600 mb-6">
            Mit unserem interaktiven Zeichentool können Sie Übungsaufstellungen, taktische Formationen und Spielzüge einfach und schnell visualisieren. Zeichnen Sie Ihre Ideen und speichern Sie sie direkt in Ihrer Übungsdatenbank.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors">
              <div className="mb-3 text-blue-600">
                <FaPencilAlt className="w-8 h-8 mx-auto" />
              </div>
              <h3 className="font-semibold text-gray-700 mb-2">Einfach zeichnen</h3>
              <p className="text-sm text-gray-500">
                Nutzen Sie intuitive Zeichenwerkzeuge, um Ihre Übungen zu visualisieren.
              </p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors">
              <div className="mb-3 text-blue-600">
                <FaSearch className="w-8 h-8 mx-auto" />
              </div>
              <h3 className="font-semibold text-gray-700 mb-2">Mit Übungen verknüpfen</h3>
              <p className="text-sm text-gray-500">
                Ordnen Sie Ihre Zeichnungen bestehenden Übungen zu oder erstellen Sie neue.
              </p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors hover:cursor-pointer" onClick={goToDrawingTool}>
              <div className="mb-3 text-blue-600">
                <FaPlus className="w-8 h-8 mx-auto" />
              </div>
              <h3 className="font-semibold text-gray-700 mb-2">Jetzt loslegen</h3>
              <p className="text-sm text-gray-500">
                Klicken Sie hier, um direkt mit dem Zeichnen zu beginnen.
              </p>
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-500">Zeichnungen werden geladen...</p>
          </div>
        ) : savedDrawings.length > 0 ? (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Meine Zeichnungen
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedDrawings.map((drawing) => (
                <div key={drawing.id} className="border rounded-lg overflow-hidden shadow-sm group hover:shadow-md transition-shadow">
                  <div className="aspect-video bg-gray-50 relative group-hover:opacity-90 transition-opacity">
                    <img 
                      src={`http://localhost:8000/uploads/drawings/${drawing.filename}`}
                      alt={drawing.title || "Übungszeichnung"}
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                      <button 
                        className="px-3 py-1.5 bg-white rounded-md shadow-sm text-sm font-medium"
                        onClick={() => window.open(`http://localhost:8000/uploads/drawings/${drawing.filename}`, '_blank')}
                      >
                        Vollbild anzeigen
                      </button>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-gray-800 mb-1">{drawing.title || "Unbenannte Zeichnung"}</h3>
                    <p className="text-sm text-gray-500">
                      Erstellt am {new Date(drawing.date).toLocaleDateString('de-DE', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </p>
                    <div className="flex justify-end mt-2">
                      <button 
                        className="text-sm text-blue-600 hover:text-blue-800"
                        onClick={() => navigate(`/tools/drawing-tool?drawingId=${drawing.id}`)}
                      >
                        Bearbeiten
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="py-8">
              <FaPencilAlt className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">Keine Zeichnungen gefunden</h3>
              <p className="text-gray-500 mb-6">
                Sie haben noch keine Zeichnungen erstellt. Erstellen Sie jetzt Ihre erste Zeichnung!
              </p>
              <button 
                onClick={goToDrawingTool}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-flex items-center gap-2"
              >
                <FaPlus /> Neue Zeichnung erstellen
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default DrawingDemo;
