const Video = require("../models/video.model");
const fs = require("fs");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
const mongoose = require("mongoose");

// Configure ffmpeg paths - try common Windows locations
const possiblePaths = [
  'C:\\ProgramData\\chocolatey\\lib\\ffmpeg\\tools\\ffmpeg\\bin',
  'C:\\ffmpeg\\bin',
  'C:\\Program Files\\ffmpeg\\bin',
  'C:\\Users\\' + process.env.USERNAME + '\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-7.1.1-full_build\\bin'
];

let ffmpegConfigured = false;

for (const binPath of possiblePaths) {
  const ffmpegPath = path.join(binPath, 'ffmpeg.exe');
  const ffprobePath = path.join(binPath, 'ffprobe.exe');
  
  if (fs.existsSync(ffmpegPath) && fs.existsSync(ffprobePath)) {
    console.log('🔧 Found and setting ffmpeg path:', ffmpegPath);
    console.log('🔧 Found and setting ffprobe path:', ffprobePath);
    
    ffmpeg.setFfmpegPath(ffmpegPath);
    ffmpeg.setFfprobePath(ffprobePath);
    ffmpegConfigured = true;
    break;
  }
}

if (!ffmpegConfigured) {
  console.log('⚠️ Could not find ffmpeg/ffprobe in common locations');
  console.log('Will try to use from PATH (may fail)');
}

// Get all videos for a user
const getAllVideos = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 20 } = req.query;
    const userId = req.user.user._id;

    // Build query
    let query = { userId };
    
    if (category && category !== 'all') {
      query.category = category;
    }

    if (search) {
      query.$text = { $search: search };
    }

    // Execute query with pagination
    const videos = await Video.find(query)
      .sort({ uploadDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-filePath') // Don't expose file paths
      .lean();
      // Add URLs to videos
    const videosWithUrls = videos.map(video => ({
      ...video,
      url: `http://localhost:8000/uploads/videos/${video.filename}`,
      thumbnail: video.thumbnailPath ? `http://localhost:8000/uploads/thumbnails/${video._id}.jpg` : `http://localhost:8000/api/placeholder/320/180`,
      annotationCount: video.annotations ? video.annotations.length : 0
    }));

    const total = await Video.countDocuments(query);

    res.json({
      success: true,
      videos: videosWithUrls,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Error getting videos:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get videos",
      error: error.message
    });
  }
};

// Get single video
const getVideo = async (req, res) => {
  try {
    const { videoId } = req.params;
    const userId = req.user.user._id;

    const video = await Video.findOne({ _id: videoId, userId })
      .populate('annotations.playerId', 'name position jersey');
    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found"
      });
    }

    // Increment view count
    await video.incrementView();    // Return video with URLs
    const videoData = {
      ...video.toJSON(),
      url: `http://localhost:8000/uploads/videos/${video.filename}`,
      thumbnail: video.thumbnailPath ? `http://localhost:8000/uploads/thumbnails/${video._id}.jpg` : `http://localhost:8000/api/placeholder/320/180`
    };

    res.json({
      success: true,
      video: videoData
    });
  } catch (error) {
    console.error("Error getting video:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get video",
      error: error.message
    });
  }
};

// Upload video
const uploadVideo = async (req, res) => {
  console.log('Upload request received');
  console.log('File:', req.file);
  console.log('Body:', req.body);
  console.log('User:', req.user);
    try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Keine Videodatei hochgeladen"
      });
    }

    if (!req.user || !req.user.user || !req.user.user._id) {
      return res.status(401).json({
        success: false,
        message: "Benutzer nicht authentifiziert"
      });
    }

    const { title, description, category, tags } = req.body;
    const userId = req.user.user._id;

    // Validate required fields
    if (!title || !category) {
      return res.status(400).json({
        success: false,
        message: "Titel und Kategorie sind erforderlich"
      });
    }

    // Parse tags
    let parsedTags = [];
    if (tags) {
      try {
        parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;
      } catch (e) {
        parsedTags = typeof tags === 'string' ? tags.split(',').map(tag => tag.trim()) : [];
      }
    }

    // Create video record
    const video = new Video({
      title,
      description: description || "",
      category,
      tags: parsedTags,
      filename: req.file.filename,
      originalName: req.file.originalname,
      filePath: req.file.path,
      size: req.file.size,
      mimeType: req.file.mimetype,
      userId
    });

    console.log('Video object created, saving to database...');    // Get video metadata using ffmpeg (optional, don't fail upload if this fails)
    try {
      const metadata = await getVideoMetadata(req.file.path);
      
      // Convert frameRate from string like "24/1" to number
      let frameRate = metadata.frameRate;
      if (typeof frameRate === 'string' && frameRate.includes('/')) {
        const [numerator, denominator] = frameRate.split('/').map(Number);
        frameRate = denominator !== 0 ? numerator / denominator : numerator;
      } else if (typeof frameRate === 'string') {
        frameRate = parseFloat(frameRate) || 0;
      }
      
      video.duration = metadata.duration || 0;
      video.metadata = {
        width: metadata.width,
        height: metadata.height,
        bitrate: metadata.bitrate,
        frameRate: frameRate,
        codec: metadata.codec
      };
      console.log('Video metadata extracted:', {
        ...metadata,
        frameRate: frameRate
      });
    } catch (metadataError) {
      console.log("Could not extract video metadata:", metadataError.message);
      // Continue without metadata
    }    // Generate thumbnail (optional, don't fail upload if this fails)
    console.log('🎯 About to generate thumbnail for video:', video._id);
    console.log('📂 Video file path:', req.file.path);
    try {
      const thumbnailPath = await generateThumbnail(req.file.path, video._id);
      video.thumbnailPath = thumbnailPath;
      console.log('✅ Thumbnail generated and saved:', thumbnailPath);
    } catch (thumbnailError) {
      console.log("❌ Could not generate thumbnail:", thumbnailError.message);
      console.error("Full thumbnail error:", thumbnailError);
      // Continue without thumbnail
    }

    await video.save();
    console.log('Video saved to database successfully');

    res.status(201).json({
      success: true,
      message: "Video erfolgreich hochgeladen",      video: {
        ...video.toJSON(),
        url: `http://localhost:8000/uploads/videos/${video.filename}`,
        thumbnail: video.thumbnailPath ? `http://localhost:8000/uploads/thumbnails/${video._id}.jpg` : `http://localhost:8000/api/placeholder/320/180`
      }
    });
  } catch (error) {
    console.error("Error uploading video:", error);
    
    // Clean up uploaded file if database save failed
    if (req.file && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
        console.log('Cleaned up uploaded file after error');
      } catch (cleanupError) {
        console.error('Error cleaning up file:', cleanupError);
      }
    }

    res.status(500).json({
      success: false,
      message: "Video-Upload fehlgeschlagen",
      error: error.message
    });
  }
};

// Stream video
const streamVideo = async (req, res) => {
  try {
    const { videoId } = req.params;
    const userId = req.user?.user?._id; // Optional auth for streaming

    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found"
      });
    }

    // Check access permissions
    if (video.userId.toString() !== userId && !video.isPublic) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    const videoPath = video.filePath;
    if (!fs.existsSync(videoPath)) {
      return res.status(404).json({
        success: false,
        message: "Video file not found"
      });
    }

    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      // Handle range requests for video seeking
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(videoPath, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': video.mimeType,
      };
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      // Serve entire file
      const head = {
        'Content-Length': fileSize,
        'Content-Type': video.mimeType,
      };
      res.writeHead(200, head);
      fs.createReadStream(videoPath).pipe(res);
    }
  } catch (error) {
    console.error("Error streaming video:", error);
    res.status(500).json({
      success: false,
      message: "Failed to stream video",
      error: error.message
    });
  }
};

// Get video thumbnail
const getThumbnail = async (req, res) => {
  try {
    const { videoId } = req.params;
    
    const video = await Video.findById(videoId);
    if (!video || !video.thumbnailPath) {
      return res.status(404).json({
        success: false,
        message: "Thumbnail not found"
      });
    }

    if (!fs.existsSync(video.thumbnailPath)) {
      return res.status(404).json({
        success: false,
        message: "Thumbnail file not found"
      });
    }

    res.sendFile(path.resolve(video.thumbnailPath));
  } catch (error) {
    console.error("Error getting thumbnail:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get thumbnail",
      error: error.message
    });
  }
};

// Delete video
const deleteVideo = async (req, res) => {
  try {
    const { videoId } = req.params;
    const userId = req.user.user._id;

    const video = await Video.findOne({ _id: videoId, userId });
    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found"
      });
    }

    // Delete files
    if (fs.existsSync(video.filePath)) {
      fs.unlinkSync(video.filePath);
    }
    if (video.thumbnailPath && fs.existsSync(video.thumbnailPath)) {
      fs.unlinkSync(video.thumbnailPath);
    }

    // Delete from database
    await Video.findByIdAndDelete(videoId);

    res.json({
      success: true,
      message: "Video deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting video:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete video",
      error: error.message
    });
  }
};

// Add annotation to video
const addAnnotation = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { timestamp, title, description, category } = req.body;
    const userId = req.user.user._id;

    const video = await Video.findOne({ _id: videoId, userId });
    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found"
      });
    }

    const annotation = {
      timestamp,
      title,
      description: description || "",
      category: category || 'general'
    };

    video.annotations.push(annotation);
    await video.save();

    res.status(201).json({
      success: true,
      message: "Annotation added successfully",
      annotation: video.annotations[video.annotations.length - 1]
    });
  } catch (error) {
    console.error("Error adding annotation:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add annotation",
      error: error.message
    });
  }
};

// Update annotation
const updateAnnotation = async (req, res) => {
  try {
    const { videoId, annotationId } = req.params;
    const updateData = req.body;
    const userId = req.user.user._id;

    const video = await Video.findOne({ _id: videoId, userId });
    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found"
      });
    }

    const annotation = video.annotations.id(annotationId);
    if (!annotation) {
      return res.status(404).json({
        success: false,
        message: "Annotation not found"
      });
    }

    Object.assign(annotation, updateData);
    await video.save();

    res.json({
      success: true,
      message: "Annotation updated successfully",
      annotation
    });
  } catch (error) {
    console.error("Error updating annotation:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update annotation",
      error: error.message
    });
  }
};

// Delete annotation
const deleteAnnotation = async (req, res) => {
  try {
    const { videoId, annotationId } = req.params;
    const userId = req.user.user._id;

    const video = await Video.findOne({ _id: videoId, userId });
    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found"
      });
    }

    video.annotations.pull(annotationId);
    await video.save();

    res.json({
      success: true,
      message: "Annotation deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting annotation:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete annotation",
      error: error.message
    });
  }
};

// Get video analytics
const getVideoAnalytics = async (req, res) => {
  try {
    const userId = req.user.user._id;
    const mongoose = require('mongoose');

    const analytics = await Video.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalVideos: { $sum: 1 },
          totalViews: { $sum: "$viewCount" },
          totalSize: { $sum: "$size" },
          totalDuration: { $sum: "$duration" },
          averageDuration: { $avg: "$duration" },
          categoryCounts: {
            $push: {
              category: "$category",
              count: 1
            }
          },
          totalAnnotations: {
            $sum: { $size: "$annotations" }
          }
        }
      }
    ]);    const categoryStats = await Video.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          totalDuration: { $sum: "$duration" },
          totalAnnotations: { $sum: { $size: "$annotations" } }
        }
      }
    ]);

    res.json({
      success: true,
      analytics: analytics[0] || {
        totalVideos: 0,
        totalViews: 0,
        totalSize: 0,
        totalDuration: 0,
        averageDuration: 0,
        totalAnnotations: 0
      },
      categoryStats
    });
  } catch (error) {
    console.error("Error getting video analytics:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get video analytics",
      error: error.message
    });
  }
};

// Update video
const updateVideo = async (req, res) => {
  try {
    const { videoId } = req.params;
    const userId = req.user.user._id;
    const { title, description, category, tags } = req.body;

    // Find video and verify ownership
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found"
      });
    }

    // Check if user owns this video
    if (video.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied: You can only edit your own videos"
      });
    }

    // Update video fields
    if (title !== undefined) video.title = title;
    if (description !== undefined) video.description = description;
    if (category !== undefined) video.category = category;
    if (tags !== undefined) {
      // Parse tags if they come as string
      video.tags = typeof tags === 'string' ? JSON.parse(tags) : tags;
    }

    await video.save();    // Return updated video with URLs
    const videoData = {
      ...video.toJSON(),
      url: `http://localhost:8000/uploads/videos/${video.filename}`,
      thumbnail: video.thumbnailPath ? `http://localhost:8000/uploads/thumbnails/${video._id}.jpg` : `http://localhost:8000/api/placeholder/320/180`
    };

    res.json({
      success: true,
      message: "Video updated successfully",
      video: videoData
    });
  } catch (error) {
    console.error("Error updating video:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update video",
      error: error.message
    });
  }
};

// Helper functions
const getVideoMetadata = (filePath) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) {
        reject(err);
        return;
      }

      const videoStream = metadata.streams.find(stream => stream.codec_type === 'video');
      
      resolve({
        duration: metadata.format.duration,
        width: videoStream?.width,
        height: videoStream?.height,
        bitrate: metadata.format.bit_rate,
        frameRate: videoStream?.r_frame_rate,
        codec: videoStream?.codec_name
      });
    });
  });
};

const generateThumbnail = (videoPath, videoId) => {
  return new Promise((resolve, reject) => {
    console.log('🎬 Starting thumbnail generation for:', videoId);
    console.log('📁 Video path:', videoPath);
    
    const thumbnailDir = path.join(__dirname, '../uploads/thumbnails');
    if (!fs.existsSync(thumbnailDir)) {
      console.log('📂 Creating thumbnails directory...');
      fs.mkdirSync(thumbnailDir, { recursive: true });
    }

    const thumbnailPath = path.join(thumbnailDir, `${videoId}.jpg`);
    console.log('🖼️ Thumbnail will be saved to:', thumbnailPath);

    ffmpeg(videoPath)
      .screenshots({
        count: 1,
        timemarks: ['10%'], // Take screenshot at 10% of video duration
        filename: `${videoId}.jpg`,
        folder: thumbnailDir
      })
      .on('start', (commandLine) => {
        console.log('🚀 FFmpeg command:', commandLine);
      })
      .on('end', () => {
        console.log('✅ Thumbnail generated successfully!');
        resolve(thumbnailPath);
      })
      .on('error', (err) => {
        console.error('❌ FFmpeg error:', err.message);
        console.error('Full error details:', err);
        reject(err);
      });
  });
};

module.exports = {
  getAllVideos,
  getVideo,
  uploadVideo,
  streamVideo,
  getThumbnail,
  deleteVideo,
  addAnnotation,
  updateAnnotation,
  deleteAnnotation,
  getVideoAnalytics,
  updateVideo
};
