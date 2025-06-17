const mongoose = require('mongoose');

const onboardingAnalyticsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userType: {
    type: String,
    enum: ['main', 'invited'],
    required: true
  },
  userRole: {
    type: String, // For invited users: assistant, caretaker, physiotherapist, analyst
    default: null
  },
  clubId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to main club owner
    default: null
  },
  onboardingType: {
    type: String,
    enum: ['wizard', 'tour'],
    required: true
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ['started', 'completed', 'skipped', 'abandoned'],
    default: 'started'
  },
  stepsCompleted: {
    type: Number,
    default: 0
  },
  totalSteps: {
    type: Number,
    default: 0
  },
  timeSpent: {
    type: Number, // in seconds
    default: 0
  },
  completionMethod: {
    type: String,
    enum: ['completed', 'skipped'],
    default: null
  },
  stepAnalytics: [{
    stepIndex: Number,
    stepTitle: String,
    timeSpent: Number, // seconds on this step
    skipped: Boolean,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  deviceInfo: {
    userAgent: String,
    screenResolution: String,
    isMobile: Boolean
  },
  feedbackRating: {
    type: Number,
    min: 1,
    max: 5,
    default: null
  },
  feedbackComment: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Indexes for better performance
onboardingAnalyticsSchema.index({ userId: 1 });
onboardingAnalyticsSchema.index({ clubId: 1 });
onboardingAnalyticsSchema.index({ onboardingType: 1 });
onboardingAnalyticsSchema.index({ status: 1 });
onboardingAnalyticsSchema.index({ completedAt: 1 });

// Method to calculate completion rate
onboardingAnalyticsSchema.statics.getCompletionRate = async function(filters = {}) {
  const total = await this.countDocuments(filters);
  const completed = await this.countDocuments({ ...filters, status: 'completed' });
  
  return {
    total,
    completed,
    rate: total > 0 ? (completed / total) * 100 : 0
  };
};

// Method to get average completion time
onboardingAnalyticsSchema.statics.getAverageCompletionTime = async function(filters = {}) {
  const completedSessions = await this.find({ 
    ...filters, 
    status: 'completed',
    timeSpent: { $gt: 0 }
  });
  
  if (completedSessions.length === 0) return 0;
  
  const totalTime = completedSessions.reduce((sum, session) => sum + session.timeSpent, 0);
  return Math.round(totalTime / completedSessions.length);
};

// Method to update step analytics
onboardingAnalyticsSchema.methods.addStepAnalytics = function(stepIndex, stepTitle, timeSpent, skipped = false) {
  this.stepAnalytics.push({
    stepIndex,
    stepTitle,
    timeSpent,
    skipped,
    timestamp: new Date()
  });
  
  if (!skipped) {
    this.stepsCompleted = Math.max(this.stepsCompleted, stepIndex + 1);
  }
};

// Method to complete onboarding
onboardingAnalyticsSchema.methods.completeOnboarding = function(method = 'completed', totalTime = 0) {
  this.status = method === 'skipped' ? 'skipped' : 'completed';
  this.completedAt = new Date();
  this.completionMethod = method;
  this.timeSpent = totalTime;
};

module.exports = mongoose.model('OnboardingAnalytics', onboardingAnalyticsSchema);
