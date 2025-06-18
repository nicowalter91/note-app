const mongoose = require("mongoose");

// Video-Schema für die Videoanalyse
const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ""
  },
  category: {
    type: String,
    enum: ['match', 'training', 'tactics', 'individual'],
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  thumbnailPath: {
    type: String,
    default: null
  },
  size: {
    type: Number,
    required: true
  },
  duration: {
    type: Number,
    default: 0 // in seconds
  },
  mimeType: {
    type: String,
    required: true
  },
  annotations: [{
    timestamp: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ""
    },
    category: {
      type: String,
      enum: ['general', 'tactics', 'technique', 'mistake', 'highlight'],
      default: 'general'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  metadata: {
    width: Number,
    height: Number,
    bitrate: Number,
    frameRate: Number,
    codec: String
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  lastAccessed: {
    type: Date,
    default: Date.now
  },
  viewCount: {
    type: Number,
    default: 0
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  sharedWith: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    permission: {
      type: String,
      enum: ['view', 'comment', 'edit'],
      default: 'view'
    },
    sharedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Indexes für bessere Performance
videoSchema.index({ userId: 1, category: 1 });
videoSchema.index({ userId: 1, uploadDate: -1 });
videoSchema.index({ title: 'text', description: 'text', tags: 'text' });

// Virtual für URL
videoSchema.virtual('url').get(function() {
  return `/api/videos/stream/${this._id}`;
});

// Virtual für Thumbnail URL
videoSchema.virtual('thumbnailUrl').get(function() {
  if (this.thumbnailPath) {
    return `/api/videos/thumbnail/${this._id}`;
  }
  return null;
});

// Pre-save middleware
videoSchema.pre('save', function(next) {
  this.lastAccessed = new Date();
  next();
});

// Methods
videoSchema.methods.addAnnotation = function(annotationData) {
  this.annotations.push(annotationData);
  return this.save();
};

videoSchema.methods.updateAnnotation = function(annotationId, updateData) {
  const annotation = this.annotations.id(annotationId);
  if (!annotation) {
    throw new Error('Annotation not found');
  }
  Object.assign(annotation, updateData);
  return this.save();
};

videoSchema.methods.deleteAnnotation = function(annotationId) {
  this.annotations.pull(annotationId);
  return this.save();
};

videoSchema.methods.incrementView = function() {
  this.viewCount += 1;
  this.lastAccessed = new Date();
  return this.save();
};

module.exports = mongoose.model("Video", videoSchema);
