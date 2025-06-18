const mongoose = require('mongoose');
const Video = require('./models/video.model');
const config = require('./config.json');

// Connect to MongoDB (using same connection as server)
mongoose.connect(config.connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
  checkVideoThumbnails();
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

async function checkVideoThumbnails() {
  try {
    const videos = await Video.find({}).limit(10);
    
    console.log('Found', videos.length, 'videos:');
    
    videos.forEach((video, index) => {
      console.log(`\n--- Video ${index + 1} ---`);
      console.log('ID:', video._id.toString());
      console.log('Title:', video.title);
      console.log('Thumbnail Path:', video.thumbnailPath);
      console.log('File Path:', video.filePath);
      
      if (video.thumbnailPath) {
        const fs = require('fs');
        const exists = fs.existsSync(video.thumbnailPath);
        console.log('Thumbnail file exists:', exists);
      } else {
        console.log('No thumbnail path in database');
      }
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error checking videos:', error);
    process.exit(1);
  }
}
