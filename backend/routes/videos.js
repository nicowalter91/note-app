const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authenticateUser');
const optionalAuth = require('../middleware/optionalAuth');
const { videoUpload, handleVideoUploadError } = require('../middleware/videoUploadMiddleware');
const {
  getAllVideos,
  getVideo,
  uploadVideo,
  updateVideo,
  streamVideo,
  getThumbnail,
  deleteVideo,
  addAnnotation,
  updateAnnotation,
  deleteAnnotation,
  getVideoAnalytics
} = require('../controllers/videos');

// Video CRUD Routes
router.get('/', authenticateUser, getAllVideos);
router.get('/analytics', authenticateUser, getVideoAnalytics);
router.get('/:videoId', authenticateUser, getVideo);
router.post('/upload', authenticateUser, videoUpload.single('video'), handleVideoUploadError, uploadVideo);
router.put('/:videoId', authenticateUser, updateVideo);
router.delete('/:videoId', authenticateUser, deleteVideo);

// Video streaming and thumbnails (with optional auth for sharing)
router.get('/stream/:videoId', optionalAuth, streamVideo);
router.get('/thumbnail/:videoId', getThumbnail);

// Annotation Routes
router.post('/:videoId/annotations', authenticateUser, addAnnotation);
router.put('/:videoId/annotations/:annotationId', authenticateUser, updateAnnotation);
router.delete('/:videoId/annotations/:annotationId', authenticateUser, deleteAnnotation);

module.exports = router;
