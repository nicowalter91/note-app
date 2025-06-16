import React from 'react';
import { FaPencilAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ExerciseDrawingButton = ({ exerciseId, exerciseTitle }) => {
  const navigate = useNavigate();
    const navigateToDrawingTool = () => {
    // Wenn eine Exercise-ID vorhanden ist, füge sie als Query-Parameter hinzu
    const id = exerciseId || '';
    const title = exerciseTitle || 'Neue Übung';
    navigate(`/tools/football-exercise?exerciseId=${id}&title=${encodeURIComponent(title)}`);
  };
  
  return (
    <>
      <button
        onClick={navigateToDrawingTool}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        title="Übung zeichnen"
      >
        <FaPencilAlt className="w-4 h-4" />
        Zeichnen
      </button>
    </>
  );
};

export default ExerciseDrawingButton;
