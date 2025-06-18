const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');

// Manual thumbnail generation for existing video
const generateThumbnailForExistingVideo = async () => {
  const videoPath = path.join(__dirname, 'uploads/videos/video-1750225022406-675590535.mp4');
  const videoId = '675cc0b23e70fda05b7d8a72'; // Example video ID
  
  console.log('🎬 Starting manual thumbnail generation...');
  console.log('📁 Video path:', videoPath);
  
  const thumbnailDir = path.join(__dirname, 'uploads/thumbnails');
  if (!fs.existsSync(thumbnailDir)) {
    console.log('📂 Creating thumbnails directory...');
    fs.mkdirSync(thumbnailDir, { recursive: true });
  }

  const thumbnailPath = path.join(thumbnailDir, `${videoId}.jpg`);
  console.log('🖼️ Thumbnail will be saved to:', thumbnailPath);

  return new Promise((resolve, reject) => {
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

generateThumbnailForExistingVideo()
  .then(() => {
    console.log('Manual thumbnail generation completed!');
  })
  .catch((error) => {
    console.error('Manual thumbnail generation failed:', error);
  });
