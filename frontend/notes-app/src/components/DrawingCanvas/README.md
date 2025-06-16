# Football Exercise Drawing Tool

## Implementation

The following components have been implemented to enable the drawing function and football exercise tool:

1. **DrawingCanvas.jsx**: A React component that provides a canvas-based drawing surface with tools for drawing, erasing, and saving.

2. **DrawingToolPage.jsx**: A standalone page that provides the drawing function as a complete application and can be linked to exercises via URL parameters.

3. **FootballExerciseToolPage.jsx**: A specialized tool for creating football exercises with drag-and-drop functionality for players, balls, cones, poles, and more. Now using Konva.js for advanced drawing capabilities.

4. **ElementPalette.jsx**: A sidebar with predefined football elements that can be added to the exercise.

5. **KonvaFootballElement.jsx**: A component for rendering and manipulating football elements (players, balls, cones, etc.) using Konva.js.

6. **TransformerComponent.jsx**: A Konva component that provides resize and rotation handles for selected elements.

7. **MovementPathCreator.jsx**: A specialized component for creating movement paths, passes, and shots.

8. **ExerciseDrawingButton.jsx**: A reusable component that contains the "Draw" button and navigates to the football exercise page.

9. **drawings.js**: A backend route that enables the upload and storage of drawings and element data.

10. **DrawingDemo.jsx**: An overview page that displays all saved drawings and provides access to the drawing page and football exercise tool.

## Features

### Element Types
- **Players**: Different player types (field player, goalkeeper, coach)
- **Equipment**: Ball, cone, pole, marker, goal
- **Field Elements**: Full field, zones/areas
- **Movement**: Paths for player movement, passes, and shots

### Editing Capabilities
- **Select and Manipulate**: Click any element to select it
- **Transform**: Resize and rotate elements using the transform controls
- **Copy/Paste**: Duplicate elements
- **Lock/Unlock**: Lock elements in place to prevent accidental movement
- **Drawing**: Draw movement paths, passes, and shots
- **Delete**: Remove unwanted elements
- **Undo/Redo**: Track changes for easy correction

### View Controls
- **Zoom**: Zoom in/out with mouse wheel or buttons
- **Pan**: Move around the canvas by dragging
- **Grid**: Visual grid for precise positioning

### Exercise Management
- **Save**: Save exercises to the server
- **Load**: Load and edit existing exercises
- **Export**: Download exercises as PNG images

## Integration with ExerciseCard

The drawing function has been integrated into the ExerciseCard:

- A "Draw" button has been added to the thumbnail view and detail modal.
- The button navigates to the football exercise page and passes the exercise ID and title as URL parameters.
- The created exercises can be linked to the original exercise.

## Server-side Requirements

1. In `server.js`, the Drawings route has been added, which provides the endpoints for uploading drawings.

2. The Exercises model has been extended with `drawingImage` and `drawingData` fields to store both the drawing image and the complete element data for later editing.

3. The upload middleware has been adapted to also accept drawings.

## Using the Football Exercise Tool

1. **Create Exercise**: Click the "Draw" button in the exercise view to navigate to the football exercise page.

2. **Add Elements**: Select elements (players, balls, cones, etc.) from the sidebar and place them on the field.

3. **Customize Elements**: Drag elements to the desired position. Choose different team colors for players. Resize and rotate elements using the transform handles.

4. **Draw Movements**: Use the path tools to draw movement paths, passes, and shots.

5. **Save**: Click "Save" to upload the exercise and link it to the exercise.

## Technical Architecture

The drawing tool uses Konva.js, a powerful HTML5 Canvas JavaScript framework, to create and manipulate graphical elements. This provides:

- Smooth drag-and-drop functionality
- Transform handles for resizing and rotation
- High-performance rendering even with many elements
- Support for complex paths and interactions

The backend stores both:
- A rendered PNG image of the exercise
- The complete element data as JSON for later editing

This allows users to both view exercises as images and continue editing them later.

## Demo

A complete overview of created exercises is available at `/tools/drawing-demo`. This page displays all drawings and provides a way to create new drawings or edit existing ones.

## Next Steps

1. Add animation capabilities for demonstrating sequential movements
2. Implement team management for organizing players
3. Add phase management for multi-stage exercises
4. Create field templates (full field, half field, small-sided)
5. Implement collaborative editing
6. Add offline mode with local storage
