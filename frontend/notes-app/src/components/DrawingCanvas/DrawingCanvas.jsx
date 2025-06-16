import React, { useRef, useState, useEffect } from 'react';
import { FaPencilAlt, FaEraser, FaUndo, FaRedo, FaSave, FaTimes } from 'react-icons/fa';

const DrawingCanvas = ({ onSave, onCancel }) => {
  const canvasRef = useRef(null);
  const [ctx, setCtx] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [tool, setTool] = useState('pencil'); // 'pencil' or 'eraser'
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  
  // Initialisierung des Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
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
      saveState();
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
  const saveState = () => {
    if (!canvasRef.current) return;
    setHistory([...history, canvasRef.current.toDataURL()]);
    setRedoStack([]);
  };
  
  // Funktion zum Zeichnen einer Linie
  const drawLine = (x0, y0, x1, y1) => {
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
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
  const handleSave = () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL('image/png');
    onSave(dataUrl);
  };
  
  // Render der Komponente
  return (
    <div className="flex flex-col w-full h-full bg-gray-50 rounded-lg overflow-hidden">
      <div className="p-4 flex justify-between items-center bg-white border-b">
        <div className="font-semibold text-lg text-gray-800">Übung zeichnen</div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => onCancel()} 
            className="p-2 hover:bg-gray-100 rounded-full"
            title="Abbrechen"
          >
            <FaTimes className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
      
      <div className="flex-1 relative">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full border border-gray-200 bg-white cursor-crosshair"
          onMouseDown={handleStartDrawing}
          onMouseMove={handleDraw}
          onMouseUp={handleStopDrawing}
          onMouseLeave={handleStopDrawing}
          onTouchStart={handleStartDrawing}
          onTouchMove={handleDraw}
          onTouchEnd={handleStopDrawing}
        />
      </div>
      
      <div className="p-4 bg-white border-t flex flex-wrap gap-2 justify-between items-center">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTool('pencil')}
            className={`p-2 rounded ${tool === 'pencil' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
            title="Stift"
          >
            <FaPencilAlt className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTool('eraser')}
            className={`p-2 rounded ${tool === 'eraser' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
            title="Radiergummi"
          >
            <FaEraser className="w-4 h-4" />
          </button>
          <div className="h-6 w-px bg-gray-300 mx-1"></div>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-8 h-8 rounded cursor-pointer"
            title="Farbe wählen"
            disabled={tool === 'eraser'}
          />
          <div className="flex items-center gap-1">
            <span className="text-sm text-gray-600">Größe:</span>
            <input
              type="range"
              min="1"
              max="20"
              value={brushSize}
              onChange={(e) => setBrushSize(parseInt(e.target.value))}
              className="w-20"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleClear}
            className="p-2 hover:bg-gray-100 rounded text-gray-600"
            title="Zurücksetzen"
          >
            Löschen
          </button>
          <button
            onClick={handleUndo}
            className="p-2 hover:bg-gray-100 rounded text-gray-600"
            title="Rückgängig"
            disabled={history.length <= 1}
          >
            <FaUndo className="w-4 h-4" />
          </button>
          <button
            onClick={handleRedo}
            className="p-2 hover:bg-gray-100 rounded text-gray-600"
            title="Wiederherstellen"
            disabled={redoStack.length === 0}
          >
            <FaRedo className="w-4 h-4" />
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center gap-1"
          >
            <FaSave className="w-4 h-4" />
            Speichern
          </button>
        </div>
      </div>
    </div>
  );
};

export default DrawingCanvas;
