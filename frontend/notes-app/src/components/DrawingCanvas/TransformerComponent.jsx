import React from 'react';
import { Transformer } from 'react-konva';

// This component adds resize and rotation handles to selected elements
const TransformerComponent = ({ selectedId, selectedRef, onTransformEnd, isResizable = true, isRotatable = true }) => {
  const transformerRef = React.useRef();
  
  React.useEffect(() => {
    if (selectedRef && transformerRef.current) {
      // Attach transformer to the selected node
      transformerRef.current.nodes([selectedRef]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [selectedRef]);
  
  if (!selectedId || !selectedRef) {
    return null;
  }
  
  return (
    <Transformer
      ref={transformerRef}
      boundBoxFunc={(oldBox, newBox) => {
        // Limit resize to minimum dimensions
        if (newBox.width < 5 || newBox.height < 5) {
          return oldBox;
        }
        return newBox;
      }}
      onTransformEnd={onTransformEnd}
      enabledAnchors={
        isResizable 
          ? ['top-left', 'top-right', 'bottom-left', 'bottom-right'] 
          : []
      }
      rotateEnabled={isRotatable}
      resizeEnabled={isResizable}
      padding={5}
      anchorSize={8}
      anchorCornerRadius={4}
      anchorStroke={'#2196F3'}
      anchorFill={'#FFFFFF'}
      borderStroke={'#2196F3'}
      borderDash={[5, 5]}
    />
  );
};

export default TransformerComponent;
