import React, { useState, useRef, useEffect } from 'react';
import { Group, Line, Arrow } from 'react-konva';

const MovementPathCreator = ({ 
  isActive, 
  pathType, // 'movement', 'pass', 'shot'
  color, 
  strokeWidth, 
  onPathComplete,
  dashArray = null
}) => {
  const [points, setPoints] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const groupRef = useRef(null);
  
  // Handler for when user starts drawing a path
  const handleMouseDown = (e) => {
    if (!isActive) return;
    
    const stage = e.target.getStage();
    if (!stage) return;
    
    const point = stage.getPointerPosition();
    if (!point) return;
    
    const scale = stage.scaleX() || 1;
    
    // Start a new path
    setPoints([point.x / scale, point.y / scale]);
    setIsDrawing(true);
  };
    // Handler for drawing path movement
  const handleMouseMove = (e) => {
    if (!isDrawing || !isActive) return;
    
    const stage = e.target.getStage();
    if (!stage) return;
    
    const point = stage.getPointerPosition();
    if (!point) return;
    
    const scale = stage.scaleX() || 1;
    
    // For movement paths, we track multiple points
    if (pathType === 'movement') {
      setPoints([...points, point.x / scale, point.y / scale]);
    } 
    // For pass and shot, we only need start and end points
    else {
      setPoints([points[0], points[1], point.x / scale, point.y / scale]);
    }
  };
  
  // Handler for completing a path
  const handleMouseUp = () => {
    if (!isDrawing || !isActive) return;
    
    // Finish drawing
    setIsDrawing(false);
    
    // If we have at least 2 points (start and end), create the path
    if (points.length >= 4) {
      onPathComplete({
        type: pathType,
        points: [...points],
        color,
        size: strokeWidth,
        dashArray: pathType === 'movement' ? dashArray : null
      });
    }
    
    // Reset for the next path
    setPoints([]);
  };
  
  // Attach event handlers to the stage when the component is mounted
  useEffect(() => {
    if (!isActive) return;
    
    const stage = document.querySelector('.konvajs-content canvas');
    if (!stage) return;
    
    // We need to handle the events at the window level to capture events outside of Konva
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isActive, isDrawing, points]);
  
  // Component to show current path being drawn
  const renderCurrentPath = () => {
    if (points.length < 2 || !isActive) return null;
    
    // Different visuals for different path types
    switch (pathType) {
      case 'movement':
        return (
          <Line
            points={points}
            stroke={color}
            strokeWidth={strokeWidth}
            dash={dashArray || null}
            lineCap="round"
            lineJoin="round"
            opacity={0.7}
          />
        );
      
      case 'pass':
        return (
          <Arrow
            points={points}
            stroke={color}
            strokeWidth={strokeWidth}
            fill={color}
            pointerLength={10}
            pointerWidth={8}
            lineCap="round"
            lineJoin="round"
            opacity={0.7}
          />
        );
      
      case 'shot':
        return (
          <Arrow
            points={points}
            stroke={color}
            strokeWidth={strokeWidth}
            fill={color}
            pointerLength={15}
            pointerWidth={12}
            dash={[10, 5]}
            lineCap="round"
            lineJoin="round"
            opacity={0.7}
          />
        );
      
      default:
        return null;
    }
  };
    return (
    <Group
      ref={groupRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {renderCurrentPath()}
    </Group>
  );
};

export default MovementPathCreator;
