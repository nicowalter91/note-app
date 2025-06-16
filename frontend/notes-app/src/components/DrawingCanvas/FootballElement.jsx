import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { FaUser, FaCircle, FaSquare, FaFlag, FaRegDotCircle, FaTimes, FaCaretUp, FaHeadset } from 'react-icons/fa';
import { IoFootball } from 'react-icons/io5';
import { MdDirectionsRun } from 'react-icons/md';

const FootballElement = ({ 
  element, 
  selected, 
  onClick, 
  onDragStart, 
  onDrag, 
  onDragEnd, 
  onDelete 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const elementRef = useRef(null);
  const startPosRef = useRef({ x: 0, y: 0 });
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  
  // Drag Event Handler
  const handleMouseDown = (e) => {
    e.stopPropagation();
    
    // Element anklicken um es auszuwählen
    onClick();
    
    // Startposition merken
    const rect = elementRef.current.getBoundingClientRect();
    startPosRef.current = { 
      x: element.x, 
      y: element.y 
    };
    
    // Offset innerhalb des Elements berechnen
    dragOffsetRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    
    // Drag-Start Event auslösen
    onDragStart();
    
    // Event Listener für Drag und Drop hinzufügen
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  
  const handleMouseMove = (e) => {
    // Neue Position berechnen
    const newX = e.clientX - dragOffsetRef.current.x;
    const newY = e.clientY - dragOffsetRef.current.y;
    
    // Drag Event auslösen
    onDrag(element.id, newX, newY);
  };
  
  const handleMouseUp = () => {
    // Event Listener entfernen
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    
    // Drag-Ende Event auslösen
    onDragEnd();
  };
  
  // Lösch-Button Handler
  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(element.id);
  };
  
  // Hilfsfunktion für Rotation (falls implementiert)
  const getRotationStyle = () => {
    return element.rotation ? `rotate(${element.rotation}deg)` : 'rotate(0deg)';
  };
  
  // Render-Funktionen für verschiedene Element-Typen
  const renderElement = () => {
    switch (element.type) {
      case 'player':
        return (
          <PlayerCircle color={element.color}>
            <FaUser />
            {element.label && <PlayerLabel>{element.label}</PlayerLabel>}
          </PlayerCircle>
        );
      
      case 'goalkeeper':
        return (
          <PlayerCircle color={element.color}>
            <FaUser />
            <PlayerLabel>{element.label || 'TW'}</PlayerLabel>
          </PlayerCircle>
        );
        
      case 'coach':
        return (
          <PlayerCircle color={element.color}>
            <FaHeadset />
            <PlayerLabel>{element.label || 'T'}</PlayerLabel>
          </PlayerCircle>
        );
        
      case 'ball':
        return <BallIcon><IoFootball /></BallIcon>;
        
      case 'cone':
        return <ConeIcon color={element.color}><FaCaretUp /></ConeIcon>;
        
      case 'pole':
        return <PoleIcon color={element.color}><FaFlag /></PoleIcon>;
        
      case 'marker':
        return <MarkerIcon color={element.color}><FaRegDotCircle /></MarkerIcon>;
        
      case 'goal':
        return <GoalBox width={element.width} height={element.height} />;
        
      case 'field':
        return <FieldBox width={element.width} height={element.height} />;
        
      case 'area':
        return <AreaBox color={element.color} width={element.width} height={element.height} />;
        
      default:
        return <div>Unknown Element</div>;
    }
  };
  
  return (
    <ElementContainer 
      ref={elementRef}
      left={element.x}
      top={element.y}
      size={element.size}
      width={element.width}
      height={element.height}
      selected={selected}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      rotation={getRotationStyle()}
    >
      {renderElement()}
      
      {(selected || isHovered) && (
        <DeleteButton onClick={handleDelete}>
          <FaTimes />
        </DeleteButton>
      )}
    </ElementContainer>
  );
};

// Styled Components
const ElementContainer = styled.div`
  position: absolute;
  left: ${props => props.left}px;
  top: ${props => props.top}px;
  width: ${props => props.width ? `${props.width}px` : `${props.size}px`};
  height: ${props => props.height ? `${props.height}px` : `${props.size}px`};
  transform: ${props => props.rotation};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: move;
  user-select: none;
  z-index: 10;
  
  ${props => props.selected && `
    outline: 2px dashed #2196F3;
    outline-offset: 2px;
  `}
`;

const PlayerCircle = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: ${props => props.color};
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  position: relative;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
`;

const PlayerLabel = styled.span`
  font-size: 10px;
  font-weight: bold;
  margin-top: 2px;
`;

const BallIcon = styled.div`
  width: 100%;
  height: 100%;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000;
`;

const ConeIcon = styled.div`
  width: 100%;
  height: 100%;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.color || '#FF9800'};
`;

const PoleIcon = styled.div`
  width: 100%;
  height: 100%;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.color || '#F44336'};
`;

const MarkerIcon = styled.div`
  width: 100%;
  height: 100%;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.color || '#FFEB3B'};
`;

const GoalBox = styled.div`
  width: 100%;
  height: 100%;
  border: 3px solid #616161;
  background-color: transparent;
`;

const FieldBox = styled.div`
  width: 100%;
  height: 100%;
  border: 2px solid #4CAF50;
  background-color: rgba(76, 175, 80, 0.1);
  position: relative;
  
  &:before {
    content: '';
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 1px;
    background-color: #4CAF50;
  }
  
  &:after {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background-color: #4CAF50;
  }
`;

const AreaBox = styled.div`
  width: 100%;
  height: 100%;
  border: 1px dashed #2196F3;
  background-color: ${props => props.color || 'rgba(33, 150, 243, 0.3)'};
`;

const DeleteButton = styled.button`
  position: absolute;
  top: -8px;
  right: -8px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: #F44336;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  font-size: 10px;
  z-index: 20;
  
  &:hover {
    background-color: #D32F2F;
  }
`;

export default FootballElement;
