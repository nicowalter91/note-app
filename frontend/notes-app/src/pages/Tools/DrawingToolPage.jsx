import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import { FaPencilAlt, FaEraser, FaUndo, FaRedo, FaSave, FaTimes, FaArrowLeft } from 'react-icons/fa';

const DrawingToolPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const canvasRef = useRef(null);
  const [ctx, setCtx] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [tool, setTool] = useState('pencil'); // 'pencil' oder 'eraser'
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [savedDrawing, setSavedDrawing] = useState(null);
  
  // Extrahiere Titel und Übungs-ID aus den URL-Parametern (falls vorhanden)
  const queryParams = new URLSearchParams(location.search);
  const exerciseId = queryParams.get('exerciseId');
  const exerciseTitle = queryParams.get('title') || 'Neue Übung';
  
  // Initialisierung des Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      // Setze Canvas-Größe auf 16:9 Format für bessere Darstellung
      const parentWidth = canvas.parentElement.clientWidth;
      const aspectRatio = 16 / 9;
      canvas.width = parentWidth;
      canvas.height = parentWidth / aspectRatio;
      
      const context = canvas.getContext('2d');
      context.lineCap = 'round';
      context.lineJoin = 'round';
      context.strokeStyle = color;
      context.lineWidth = brushSize;
      setCtx(context);
      
      // Setze Hintergrundfarbe auf weiß
      context.fillStyle = 'white';
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      // Speichere den Initialzustand in der History
      saveState(context);
    }
  }, []);
  
  // Aktualisiere den Kontext bei Änderungen der Tools
  useEffect(() => {
    if (ctx) {
      ctx.strokeStyle = tool === 'eraser' ? 'white' : color;
      ctx.lineWidth = tool === 'eraser' ? brushSize * 2 : brushSize;
    }
  }, [color, brushSize, tool, ctx]);

  // Funktion zum Speichern des aktuellen Canvas-Zustands
  const saveState = (context = ctx) => {
    if (!canvasRef.current || !context) return;
    const newHistory = [...history, canvasRef.current.toDataURL()];
    setHistory(newHistory);
    setRedoStack([]);
  };
  
  // Maus-/Touch-Ereignisse
  const handleStartDrawing = (e) => {
    const { offsetX, offsetY } = getCoordinates(e);
    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
  };
  
  const handleDraw = (e) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = getCoordinates(e);
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
  };
  
  const handleStopDrawing = () => {
    if (isDrawing) {
      ctx.closePath();
      setIsDrawing(false);
      saveState();
    }
  };
  
  // Hilfsfunktion für Touch- und Mausereignisse
  const getCoordinates = (e) => {
    let offsetX, offsetY;
    const canvas = canvasRef.current;
    
    if (e.type.includes('touch')) {
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0] || e.changedTouches[0];
      offsetX = touch.clientX - rect.left;
      offsetY = touch.clientY - rect.top;
    } else {
      offsetX = e.nativeEvent.offsetX;
      offsetY = e.nativeEvent.offsetY;
    }
    
    return { offsetX, offsetY };
  };
  
  // Undo-Funktion
  const handleUndo = () => {
    if (history.length <= 1) return;
    
    const newHistory = [...history];
    const lastState = newHistory.pop();
    setRedoStack([...redoStack, lastState]);
    setHistory(newHistory);
    
    const img = new Image();
    img.src = newHistory[newHistory.length - 1];
    img.onload = () => {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.drawImage(img, 0, 0);
    };
  };
  
  // Redo-Funktion
  const handleRedo = () => {
    if (redoStack.length === 0) return;
    
    const newRedoStack = [...redoStack];
    const nextState = newRedoStack.pop();
    setHistory([...history, nextState]);
    setRedoStack(newRedoStack);
    
    const img = new Image();
    img.src = nextState;
    img.onload = () => {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.drawImage(img, 0, 0);
    };
  };
  
  // Clear-Funktion
  const handleClear = () => {
    if (!ctx || !canvasRef.current) return;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    saveState();
  };
  
  // Speichern der Zeichnung
  const handleSave = async () => {
    if (!canvasRef.current) return;
    
    setIsSaving(true);
    
    try {
      // Konvertiere Base64-String in Blob
      const dataUrl = canvasRef.current.toDataURL('image/png');
      const fetchResponse = await fetch(dataUrl);
      const blob = await fetchResponse.blob();
      
      // Erstelle FormData für Upload
      const formData = new FormData();
      formData.append('drawing', blob, 'drawing.png');
      
      // Wenn eine Übungs-ID vorhanden ist, füge sie hinzu
      if (exerciseId) {
        formData.append('exerciseId', exerciseId);
      }
      
      // Sende zum Server
      const response = await fetch('http://localhost:8000/api/exercises/upload-drawing', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Fehler beim Upload der Zeichnung');
      }
      
      const data = await response.json();
      setSavedDrawing(data.filename);
      
      // Zeige Erfolgsmeldung
      alert('Zeichnung erfolgreich gespeichert!');
      
      // Wenn eine Übungs-ID vorhanden ist, navigiere zurück zur Übung
      if (exerciseId) {
        navigate(`/exercises?id=${exerciseId}`);
      } else {
        // Sonst zur Übersichtsseite
        navigate('/tools/drawing-demo');
      }
    } catch (error) {
      console.error('Fehler beim Speichern der Zeichnung:', error);
      alert('Die Zeichnung konnte nicht gespeichert werden. Bitte versuchen Sie es erneut.');
    } finally {
      setIsSaving(false);
    }
  };
  
  // Zurück-Funktion
  const handleBack = () => {
    if (window.confirm('Möchten Sie die Seite wirklich verlassen? Nicht gespeicherte Änderungen gehen verloren.')) {
      navigate(-1);
    }
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button 
              onClick={handleBack}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              title="Zurück"
            >
              <FaArrowLeft />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">
              Übung zeichnen: {exerciseTitle}
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`px-4 py-2 rounded-md text-white font-medium flex items-center gap-2 ${
                isSaving ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              <FaSave />
              {isSaving ? 'Wird gespeichert...' : 'Speichern'}
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Zeichenwerkzeuge */}
          <div className="p-4 border-b border-gray-200 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTool('pencil')}
                className={`p-2 rounded ${tool === 'pencil' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
                title="Stift"
              >
                <FaPencilAlt className="w-5 h-5" />
              </button>
              <button
                onClick={() => setTool('eraser')}
                className={`p-2 rounded ${tool === 'eraser' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
                title="Radiergummi"
              >
                <FaEraser className="w-5 h-5" />
              </button>
            </div>
            
            <div className="h-8 w-px bg-gray-300"></div>
            
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-8 h-8 rounded cursor-pointer"
                title="Farbe wählen"
                disabled={tool === 'eraser'}
              />
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Größe:</span>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={brushSize}
                  onChange={(e) => setBrushSize(parseInt(e.target.value))}
                  className="w-24"
                />
                <span className="text-sm text-gray-600 w-6">{brushSize}px</span>
              </div>
            </div>
            
            <div className="h-8 w-px bg-gray-300"></div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleUndo}
                disabled={history.length <= 1}
                className={`p-2 rounded ${history.length <= 1 ? 'text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
                title="Rückgängig"
              >
                <FaUndo className="w-5 h-5" />
              </button>
              <button
                onClick={handleRedo}
                disabled={redoStack.length === 0}
                className={`p-2 rounded ${redoStack.length === 0 ? 'text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
                title="Wiederherstellen"
              >
                <FaRedo className="w-5 h-5" />
              </button>
            </div>
            
            <div className="h-8 w-px bg-gray-300"></div>
            
            <button
              onClick={handleClear}
              className="px-3 py-1 rounded text-gray-600 hover:bg-gray-100"
              title="Zeichnung löschen"
            >
              Zurücksetzen
            </button>
          </div>
          
          {/* Canvas-Bereich */}
          <div className="relative bg-gray-50 p-4 flex justify-center">
            <div className="canvas-container border border-gray-200 shadow-sm bg-white">
              <canvas
                ref={canvasRef}
                className="cursor-crosshair"
                onMouseDown={handleStartDrawing}
                onMouseMove={handleDraw}
                onMouseUp={handleStopDrawing}
                onMouseLeave={handleStopDrawing}
                onTouchStart={handleStartDrawing}
                onTouchMove={handleDraw}
                onTouchEnd={handleStopDrawing}
              />
            </div>
          </div>
          
          {/* Hilfe-Text */}
          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              <strong>Tipp:</strong> Verwenden Sie den Stift zum Zeichnen und den Radiergummi zum Korrigieren. Mit den Pfeilen können Sie Änderungen rückgängig machen oder wiederherstellen.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DrawingToolPage;
