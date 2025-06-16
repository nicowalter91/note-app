import React from 'react';
import { Group, Circle, Rect, Text, RegularPolygon, Line, Arrow } from 'react-konva';

// Utility function to render a player/coach/goalkeeper
export const Player = ({ 
  id, 
  x, 
  y, 
  color, 
  label, 
  size = 30, 
  isSelected, 
  rotation = 0,
  onSelect,
  onDragEnd,
  draggable = true,
  playerType = 'player'
}) => {
  // Define different styles based on player type
  const getLabelText = () => {
    switch (playerType) {
      case 'goalkeeper': return label || 'GK';
      case 'coach': return label || 'C';
      default: return label || 'P';
    }
  };

  // Get color based on player type if not provided
  const getColor = () => {
    switch (playerType) {
      case 'goalkeeper': return color || '#FFA000';
      case 'coach': return color || '#9E9E9E';
      default: return color || '#ff5252';
    }
  };

  return (
    <Group
      x={x}
      y={y}
      width={size}
      height={size}
      offsetX={size / 2}
      offsetY={size / 2}
      rotation={rotation}
      draggable={draggable}
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={onDragEnd}
      id={id}
    >
      {/* Player circle */}
      <Circle
        radius={size / 2}
        fill={getColor()}
        shadowColor="black"
        shadowBlur={3}
        shadowOpacity={0.3}
        shadowOffset={{ x: 1, y: 1 }}
      />
      {/* Label text */}
      {getLabelText() && (
        <Text
          text={getLabelText()}
          fontSize={size * 0.3}
          fontStyle="bold"
          fill="white"
          width={size}
          offsetX={size / 2}
          offsetY={size * 0.1}
          align="center"
        />
      )}
      
      {/* Selection indicator */}
      {isSelected && (
        <Circle
          radius={size / 2 + 3}
          stroke="#2196F3"
          strokeWidth={2}
          dash={[5, 5]}
        />
      )}
    </Group>
  );
};

// Utility function to render a ball
export const Ball = ({ 
  id, 
  x, 
  y, 
  size = 20, 
  isSelected, 
  rotation = 0,
  onSelect,
  onDragEnd,
  draggable = true 
}) => {
  return (
    <Group
      x={x}
      y={y}
      width={size}
      height={size}
      offsetX={size / 2}
      offsetY={size / 2}
      rotation={rotation}
      draggable={draggable}
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={onDragEnd}
      id={id}
    >
      {/* Ball circle */}
      <Circle
        radius={size / 2}
        fill="#FFFFFF"
        stroke="#000000"
        strokeWidth={1}
      />
      
      {/* Ball pattern (simplified) */}
      <Line
        points={[-size/4, 0, size/4, 0]}
        stroke="#000000"
        strokeWidth={1}
      />
      <Line
        points={[0, -size/4, 0, size/4]}
        stroke="#000000"
        strokeWidth={1}
      />
      
      {/* Selection indicator */}
      {isSelected && (
        <Circle
          radius={size / 2 + 3}
          stroke="#2196F3"
          strokeWidth={2}
          dash={[5, 5]}
        />
      )}
    </Group>
  );
};

// Utility function to render a cone
export const Cone = ({ 
  id, 
  x, 
  y, 
  color = '#FF9800', 
  size = 20, 
  isSelected,
  rotation = 0, 
  onSelect,
  onDragEnd,
  draggable = true 
}) => {
  return (
    <Group
      x={x}
      y={y}
      width={size}
      height={size}
      offsetX={size / 2}
      offsetY={size / 2}
      rotation={rotation}
      draggable={draggable}
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={onDragEnd}
      id={id}
    >
      {/* Cone triangle */}
      <RegularPolygon
        sides={3}
        radius={size / 2}
        fill={color}
        shadowColor="black"
        shadowBlur={2}
        shadowOpacity={0.3}
        shadowOffset={{ x: 1, y: 1 }}
      />
      
      {/* Selection indicator */}
      {isSelected && (
        <Circle
          radius={size / 2 + 3}
          stroke="#2196F3"
          strokeWidth={2}
          dash={[5, 5]}
        />
      )}
    </Group>
  );
};

// Utility function to render a pole/flag
export const Pole = ({ 
  id, 
  x, 
  y, 
  color = '#F44336', 
  size = 24, 
  isSelected,
  rotation = 0, 
  onSelect,
  onDragEnd,
  draggable = true 
}) => {
  return (
    <Group
      x={x}
      y={y}
      width={size}
      height={size}
      offsetX={size / 2}
      offsetY={size / 2}
      rotation={rotation}
      draggable={draggable}
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={onDragEnd}
      id={id}
    >
      {/* Pole stick */}
      <Rect
        width={size / 6}
        height={size}
        offsetX={size / 12}
        offsetY={size / 2}
        fill={color}
      />
      
      {/* Flag */}
      <RegularPolygon
        sides={3}
        radius={size / 3}
        x={size / 6}
        y={-size / 4}
        fill={color}
        rotation={90}
      />
      
      {/* Selection indicator */}
      {isSelected && (
        <Circle
          radius={size / 2 + 3}
          stroke="#2196F3"
          strokeWidth={2}
          dash={[5, 5]}
        />
      )}
    </Group>
  );
};

// Utility function to render a marker
export const Marker = ({ 
  id, 
  x, 
  y, 
  color = '#FFEB3B', 
  size = 15, 
  isSelected,
  rotation = 0, 
  onSelect,
  onDragEnd,
  draggable = true 
}) => {
  return (
    <Group
      x={x}
      y={y}
      width={size}
      height={size}
      offsetX={size / 2}
      offsetY={size / 2}
      rotation={rotation}
      draggable={draggable}
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={onDragEnd}
      id={id}
    >
      {/* Marker circle */}
      <Circle
        radius={size / 2}
        fill={color}
        stroke="#000000"
        strokeWidth={1}
      />
      
      {/* Selection indicator */}
      {isSelected && (
        <Circle
          radius={size / 2 + 3}
          stroke="#2196F3"
          strokeWidth={2}
          dash={[5, 5]}
        />
      )}
    </Group>
  );
};

// Utility function to render a goal
export const Goal = ({ 
  id, 
  x, 
  y, 
  width = 60, 
  height = 20, 
  isSelected,
  rotation = 0, 
  onSelect,
  onDragEnd,
  draggable = true 
}) => {
  return (
    <Group
      x={x}
      y={y}
      width={width}
      height={height}
      offsetX={width / 2}
      offsetY={height / 2}
      rotation={rotation}
      draggable={draggable}
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={onDragEnd}
      id={id}
    >
      {/* Goal box */}
      <Rect
        width={width}
        height={height}
        stroke="#616161"
        strokeWidth={3}
        fill="transparent"
      />
      
      {/* Selection indicator */}
      {isSelected && (
        <Rect
          width={width + 6}
          height={height + 6}
          offsetX={3}
          offsetY={3}
          stroke="#2196F3"
          strokeWidth={2}
          dash={[5, 5]}
        />
      )}
    </Group>
  );
};

// Utility function to render a field marker/line
export const Field = ({ 
  id, 
  x, 
  y, 
  width = 100, 
  height = 2, 
  color = '#FFFFFF', 
  isSelected,
  rotation = 0, 
  onSelect,
  onDragEnd,
  draggable = true 
}) => {
  return (
    <Group
      x={x}
      y={y}
      width={width}
      height={height}
      offsetX={width / 2}
      offsetY={height / 2}
      rotation={rotation}
      draggable={draggable}
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={onDragEnd}
      id={id}
    >
      {/* Field line */}
      <Rect
        width={width}
        height={height}
        fill={color}
      />
      
      {/* Selection indicator */}
      {isSelected && (
        <Rect
          width={width + 6}
          height={height + 6}
          offsetX={3}
          offsetY={3}
          stroke="#2196F3"
          strokeWidth={2}
          dash={[5, 5]}
        />
      )}
    </Group>
  );
};
