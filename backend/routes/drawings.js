const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const authenticateUser = require('../middleware/authenticateUser');
const Exercise = require('../models/exercises.model');

// Ensure the drawings directory exists
const drawingsDir = path.join(__dirname, '../uploads/drawings');
if (!fs.existsSync(drawingsDir)) {
  fs.mkdirSync(drawingsDir, { recursive: true });
}

// Configure Multer for drawing uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, drawingsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'drawing-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    // Accept only PNG files
    if (file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(new Error('Only PNG files are allowed'), false);
    }
  }
});

// Route to upload a drawing
router.post('/upload-drawing', authenticateUser, upload.single('drawing'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // Get element data if available
    let elementData = null;
    if (req.body.elementData) {
      try {
        elementData = JSON.parse(req.body.elementData);
      } catch (e) {
        console.error('Error parsing element data:', e);
      }
    }
    
    // If an exercise ID is provided, update the exercise
    if (req.body.exerciseId) {
      const exerciseId = req.body.exerciseId;
      
      try {
        const exercise = await Exercise.findById(exerciseId);
        
        if (!exercise) {
          return res.status(404).json({ message: 'Exercise not found' });
        }
        
        // Update the exercise with the new drawing
        exercise.drawingImage = req.file.filename;
        
        // Store element data if available
        if (elementData) {
          exercise.drawingData = JSON.stringify(elementData);
        }
        
        await exercise.save();
        
        return res.status(200).json({ 
          success: true, 
          message: 'Exercise updated successfully',
          exerciseId: exercise._id,
          filename: req.file.filename,
          path: `/uploads/drawings/${req.file.filename}`
        });
      } catch (error) {
        console.error('Error updating exercise:', error);
        return res.status(500).json({ message: 'Server error updating exercise' });
      }
    }
    
    // If no exercise ID is provided, create a new exercise with the drawing
    const newExercise = new Exercise({
      title: 'Football Exercise ' + new Date().toLocaleDateString(),
      userId: req.user.user._id,
      drawingImage: req.file.filename,
      drawingData: elementData ? JSON.stringify(elementData) : null,
      category: 'Football',
      tags: ['football', 'exercise', 'drawing']
    });
    
    await newExercise.save();
    
    // Return the filename and path
    res.status(200).json({ 
      success: true, 
      exerciseId: newExercise._id,
      filename: req.file.filename,
      path: `/uploads/drawings/${req.file.filename}`
    });
  } catch (error) {
    console.error('Error uploading drawing:', error);
    res.status(500).json({ message: 'Server error uploading drawing' });
  }
});

// Route to get drawing data for an exercise
router.get('/get-drawing-data/:exerciseId', authenticateUser, async (req, res) => {
  try {
    const exerciseId = req.params.exerciseId;
    
    const exercise = await Exercise.findById(exerciseId);
    
    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }
    
    // Return drawing data if available
    res.status(200).json({ 
      success: true, 
      drawingImage: exercise.drawingImage,
      drawingData: exercise.drawingData ? JSON.parse(exercise.drawingData) : null,
      exerciseId: exercise._id,
      title: exercise.title
    });
  } catch (error) {
    console.error('Error getting drawing data:', error);
    res.status(500).json({ message: 'Server error getting drawing data' });
  }
});

module.exports = router;
