// This is a temp file to store clean JSX structure
const JSXSection = () => {
  return (
    <Layout>
      <ToolPageContainer>
        <Toolbar>
          {/* ... toolbar content ... */}
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
              onMouseDown={(e) => {
                if (tool === 'path') {
                  e.evt.preventDefault();
                }
              }}
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
              </Layer>
              <Layer>
                {/* elements */}
              </Layer>
              <Layer>
                {/* path creator */}
              </Layer>
              <Layer>
                {/* transformer */}
              </Layer>
            </Stage>
            <ZoomControls>
              {/* zoom controls */}
            </ZoomControls>
          </CanvasContainer>
        </EditorContainer>
      </ToolPageContainer>
    </Layout>
  );
};
