import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import { Stage, Layer, Line, Circle, Rect, Group, Text, Arrow } from 'react-konva';
import { Player, Ball, Cone, Marker, Goal, Pole } from '../../components/DrawingCanvas/KonvaFootballElement';
import { 
  FaPencilAlt, 
  FaEraser, 
  FaUndo, 
  FaRedo, 
  FaSave, 
  FaArrowLeft,
  FaMousePointer,
  FaTrash,
  FaCopy,
  FaDownload,
  FaExpandArrowsAlt,
  FaSyncAlt,
  FaLayerGroup,
  FaPaste,
  FaLock,
  FaUnlock
} from 'react-icons/fa';

import ElementPalette from '../../components/DrawingCanvas/ElementPalette';

const FootballExerciseToolPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const stageRef = useRef(null);
  const containerRef = useRef(null);
  
  // Football exercise editor states
  const [elements, setElements] = useState([]);
  const [selectedElementId, setSelectedElementId] = useState(null);
  const [selectedNodeRef, setSelectedNodeRef] = useState(null);
  const [currentTeamColor, setCurrentTeamColor] = useState('#ff5252');
  const [tool, setTool] = useState('select');
  const [pathType, setPathType] = useState('movement');
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [stageScale, setStageScale] = useState(1);
  const [stagePosition, setStagePosition] = useState({ x: 0, y: 0 });
  const [copiedElement, setCopiedElement] = useState(null);
  const [showGrid, setShowGrid] = useState(true);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 450 });
  
  // Extract title and exercise ID from URL parameters
  const queryParams = new URLSearchParams(location.search);
  const exerciseId = queryParams.get('exerciseId');
  const exerciseTitle = queryParams.get('title') || 'New Exercise';

  // Event handlers
  const handleBack = () => {
    navigate('/tools');
  };
  const handleElementSelect = (elementData) => {
    console.log('Element selected:', elementData);
    if (tool !== 'select') {
      setTool('select'); // Switch to select tool when adding elements
    }
    
    // Create element with proper defaults
    const newElement = {
      id: uuidv4(),
      type: elementData.type || elementData.id,
      x: Math.random() * (canvasSize.width - 100) + 50,
      y: Math.random() * (canvasSize.height - 100) + 50,
      color: elementData.color || currentTeamColor,
      size: elementData.size || 30,
      label: elementData.label || '',
      rotation: 0,
      draggable: true,
      ...elementData.defaultProps
    };
    
    setElements([...elements, newElement]);
    setHistory([...history, elements]); // Add to history for undo
  };

  const handleWheel = (e) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;

    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    
    const scaleBy = 1.1;
    const newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;
    
    setStageScale(Math.max(0.5, Math.min(5, newScale)));
  };

  const handleStageClick = (e) => {
    if (e.target === stageRef.current || e.target.name() === 'background') {
      setSelectedElementId(null);
      setSelectedNodeRef(null);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Add save logic here
      console.log('Saving exercise...', { elements, exerciseTitle });
      // Simulate save delay
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Error saving exercise:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = () => {
    const stage = stageRef.current;
    if (!stage) return;
    
    const dataURL = stage.toDataURL({ pixelRatio: 2 });
    const link = document.createElement('a');
    link.download = `${exerciseTitle.replace(/\s+/g, '_')}_exercise.png`;
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const selectedElement = elements.find(el => el.id === selectedElementId);  // Render elements on canvas using specialized components
  const renderElement = (element) => {
    const { id, type, x, y, color, size, label, rotation = 0 } = element;
    const isSelected = selectedElementId === id;

    const commonProps = {
      id,
      x,
      y,
      size,
      color,
      label,
      rotation,
      isSelected,
      draggable: tool === 'select',
      onSelect: () => handleElementClick(id),
      onDragEnd: (e) => handleElementDragEnd(id, e),
    };

    switch (type) {
      case 'player':
        return (
          <Player
            key={id}
            {...commonProps}
            playerType="player"
          />
        );

      case 'goalkeeper':
        return (
          <Player
            key={id}
            {...commonProps}
            playerType="goalkeeper"
          />
        );

      case 'coach':
      case 'trainer':
        return (
          <Player
            key={id}
            {...commonProps}
            playerType="coach"
          />
        );

      case 'ball':
        return (
          <Ball
            key={id}
            {...commonProps}
          />
        );

      case 'cone':
        return (
          <Cone
            key={id}
            {...commonProps}
          />
        );

      case 'marker':
        return (
          <Marker
            key={id}
            {...commonProps}
          />
        );

      case 'goal':
        return (
          <Goal
            key={id}
            {...commonProps}
            width={size * 2}
            height={size}
          />
        );

      case 'flag':
        return (
          <Pole
            key={id}
            {...commonProps}
          />
        );

      default:
        return (
          <Circle
            key={id}
            x={x}
            y={y}
            radius={size / 2}
            fill={color || '#9E9E9E'}
            stroke={isSelected ? '#2196F3' : '#333'}
            strokeWidth={isSelected ? 3 : 1}
            draggable={tool === 'select'}
            onClick={() => handleElementClick(id)}
            onDragEnd={(e) => handleElementDragEnd(id, e)}
          />
        );
    }
  };

  // Element interaction handlers
  const handleElementClick = (elementId, e) => {
    e.cancelBubble = true;
    if (tool === 'select') {
      setSelectedElementId(elementId);
      setSelectedNodeRef(e.target);
    }
  };

  const handleElementDragEnd = (elementId, e) => {
    const newPos = {
      x: e.target.x(),
      y: e.target.y()
    };
    
    setElements(elements.map(el => 
      el.id === elementId 
        ? { ...el, x: newPos.x, y: newPos.y }
        : el
    ));
  };

  const handleCopyElement = () => {
    if (selectedElement) {
      setCopiedElement(selectedElement);
    }
  };

  const handlePasteElement = () => {
    if (copiedElement) {
      const newElement = {
        ...copiedElement,
        id: uuidv4(),
        x: copiedElement.x + 20,
        y: copiedElement.y + 20
      };
      setElements([...elements, newElement]);
    }
  };

  const handleUndo = () => {
    if (history.length > 0) {
      const previousState = history[history.length - 1];
      setRedoStack([...redoStack, elements]);
      setElements(previousState);
      setHistory(history.slice(0, -1));
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const nextState = redoStack[redoStack.length - 1];
      setHistory([...history, elements]);
      setElements(nextState);
      setRedoStack(redoStack.slice(0, -1));
    }
  };

  return (
    <Layout>
      <ToolPageContainer>
        <Toolbar>
          <ToolbarLeft>
            <ToolButton 
              onClick={handleBack}
              title="Back"
            >
              <FaArrowLeft />
            </ToolButton>
            <PageTitle>
              Exercise Editor: {exerciseTitle}
            </PageTitle>
          </ToolbarLeft>
          
          <ToolbarCenter>
            <ToolButton 
              onClick={() => setTool('select')}
              $active={tool === 'select'}
              title="Select"
            >
              <FaMousePointer />
            </ToolButton>
            <ToolButton 
              onClick={() => { setTool('path'); setPathType('movement'); }}
              $active={tool === 'path' && pathType === 'movement'}
              title="Draw Movement Path"
            >
              <FaPencilAlt />
            </ToolButton>
            <ToolButton 
              onClick={() => { setTool('path'); setPathType('pass'); }}
              $active={tool === 'path' && pathType === 'pass'}
              title="Draw Pass"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4L4 20L12 17L20 20L12 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </ToolButton>
            <ToolButton 
              onClick={() => { setTool('path'); setPathType('shot'); }}
              $active={tool === 'path' && pathType === 'shot'}
              title="Draw Shot"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2"/>
                <path d="M16 8l4-4m0 0l-4-4m4 4H8" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </ToolButton>
            
            <Separator />
            
            <ColorInput
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              title="Color"
            />
            
            <input
              type="range"
              min="1"
              max="20"
              value={brushSize}
              onChange={(e) => setBrushSize(parseInt(e.target.value))}
              title="Brush Size"
            />
            
            <Separator />
            
            {selectedElement && (
              <>
                <ToolButton 
                  onClick={() => {
                    console.log('Lock/unlock element');
                  }}
                  $active={selectedElement?.locked}
                  title={selectedElement?.locked ? "Unlock element" : "Lock element"}
                >
                  {selectedElement?.locked ? <FaUnlock /> : <FaLock />}
                </ToolButton>
                <ToolButton 
                  onClick={() => {
                    setCopiedElement(selectedElement);
                  }}
                  title="Copy element"
                >
                  <FaCopy />
                </ToolButton>
                <ToolButton 
                  onClick={() => {
                    setElements(elements.filter(el => el.id !== selectedElementId));
                    setSelectedElementId(null);
                  }}
                  title="Delete element"
                >
                  <FaTrash />
                </ToolButton>
              </>
            )}
          </ToolbarCenter>
          
          <ToolbarRight>
            <ActionButton 
              onClick={handleDownload}
              title="Download as image"
              $secondary
            >
              <FaDownload />
              <span>Download</span>
            </ActionButton>
            <ActionButton 
              onClick={handleSave}
              disabled={isSaving}
              title="Save exercise"
              $primary
            >
              <FaSave />
              <span>{isSaving ? 'Saving...' : 'Save'}</span>
            </ActionButton>
          </ToolbarRight>
        </Toolbar>

        <EditorContainer>
          <ElementPalette 
            onElementSelect={handleElementSelect} 
            currentTeamColor={currentTeamColor}
          />
          
          <CanvasContainer ref={containerRef}>
            <Stage
              ref={stageRef}
              width={canvasSize.width}
              height={canvasSize.height}
              onWheel={handleWheel}
              scaleX={stageScale}
              scaleY={stageScale}
              x={stagePosition.x}
              y={stagePosition.y}
              onClick={handleStageClick}
              style={{
                backgroundColor: '#f5f5f5',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              }}
            >
              <Layer>
                <Rect
                  name="background"
                  width={canvasSize.width}
                  height={canvasSize.height}
                  fill="#e8f5e9"
                />
                {Array(10).fill(0).map((_, i) => (
                  <Rect
                    key={`stripe-${i}`}
                    y={i * (canvasSize.height / 10)}
                    width={canvasSize.width}
                    height={canvasSize.height / 10}
                    fill={i % 2 === 0 ? '#e8f5e9' : '#c8e6c9'}
                  />
                ))}
                {showGrid && Array(Math.floor(canvasSize.width / 50)).fill(0).map((_, i) => (
                  <Line
                    key={`vgrid-${i}`}
                    points={[(i + 1) * 50, 0, (i + 1) * 50, canvasSize.height]}
                    stroke="#4CAF50"
                    strokeWidth={0.5}
                    opacity={0.2}
                  />
                ))}
                {showGrid && Array(Math.floor(canvasSize.height / 50)).fill(0).map((_, i) => (
                  <Line
                    key={`hgrid-${i}`}
                    points={[0, (i + 1) * 50, canvasSize.width, (i + 1) * 50]}
                    stroke="#4CAF50"
                    strokeWidth={0.5}
                    opacity={0.2}
                  />
                ))}
              </Layer>
              <Layer>
                {elements.map(renderElement)}
              </Layer>
            </Stage>
            
            <ZoomControls>
              <ZoomButton 
                onClick={() => {
                  const newScale = Math.min(stageScale * 1.2, 5);
                  setStageScale(newScale);
                }}
                title="Zoom in"
              >
                +
              </ZoomButton>
              <ZoomValue>{Math.round(stageScale * 100)}%</ZoomValue>
              <ZoomButton 
                onClick={() => {
                  const newScale = Math.max(stageScale / 1.2, 0.5);
                  setStageScale(newScale);
                }}
                title="Zoom out"
              >
                -
              </ZoomButton>
              <ZoomButton 
                onClick={() => {
                  setStageScale(1);
                  setStagePosition({ x: 0, y: 0 });
                }}
                title="Reset view"
              >
                <FaSyncAlt />
              </ZoomButton>
            </ZoomControls>
          </CanvasContainer>
        </EditorContainer>
      </ToolPageContainer>
    </Layout>
  );
};

// Styled Components
const ToolPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #fafafa;
`;

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: white;
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  z-index: 1000;
`;

const ToolbarLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const ToolbarCenter = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ToolbarRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const PageTitle = styled.h1`
  font-size: 18px;
  font-weight: 600;
  color: #212121;
  margin: 0;
`;

const ToolButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 4px;
  border: none;
  background-color: ${props => props.$active ? '#e3f2fd' : 'transparent'};
  color: ${props => props.$active ? '#2196F3' : props.$disabled ? '#bdbdbd' : '#616161'};
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  
  &:hover {
    background-color: ${props => props.$disabled ? 'transparent' : '#f5f5f5'};
  }
`;

const Separator = styled.div`
  width: 1px;
  height: 24px;
  background-color: #e0e0e0;
  margin: 0 8px;
`;

const ColorInput = styled.input`
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 16px;
  height: 36px;
  border-radius: 4px;
  border: none;
  background-color: ${props => props.$primary ? '#2196F3' : props.$secondary ? '#f5f5f5' : 'transparent'};
  color: ${props => props.$primary ? 'white' : props.$secondary ? '#616161' : '#616161'};
  font-weight: 500;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.$disabled ? 0.7 : 1};
  
  &:hover {
    background-color: ${props => props.$disabled ? (props.$primary ? '#2196F3' : props.$secondary ? '#f5f5f5' : 'transparent') : (props.$primary ? '#1976D2' : props.$secondary ? '#e0e0e0' : '#f5f5f5')};
  }
`;

const EditorContainer = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const CanvasContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
  position: relative;
`;

const ZoomControls = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: white;
  border-radius: 6px;
  padding: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
`;

const ZoomButton = styled.button`
  width: 32px;
  height: 32px;
  border: none;
  background-color: transparent;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  color: #616161;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const ZoomValue = styled.span`
  font-size: 12px;
  color: #616161;
  margin: 0 8px;
  min-width: 40px;
  text-align: center;
`;

export default FootballExerciseToolPage;
