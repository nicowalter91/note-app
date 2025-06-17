const OnboardingAnalytics = require('../models/onboardingAnalytics.model');
const User = require('../models/user.model');
const TeamMember = require('../models/teamMember.model');

// Start onboarding tracking
const startOnboarding = async (req, res) => {
  try {
    const { user } = req.user;
    const { onboardingType, totalSteps, deviceInfo } = req.body;

    // Get user details
    const userDetails = await User.findById(user._id);
    if (!userDetails) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Get team member info for invited users
    let userRole = null;
    let clubId = null;
    if (userDetails.userType === 'invited') {
      const teamMember = await TeamMember.findOne({ userId: user._id });
      if (teamMember) {
        userRole = teamMember.role;
        clubId = teamMember.clubId;
      }
    }

    // Check if there's already an active session
    const existingSession = await OnboardingAnalytics.findOne({
      userId: user._id,
      status: 'started'
    });

    if (existingSession) {
      return res.json({
        success: true,
        sessionId: existingSession._id,
        message: 'Existing session found'
      });
    }

    // Create new analytics session
    const analyticsSession = new OnboardingAnalytics({
      userId: user._id,
      userType: userDetails.userType,
      userRole,
      clubId,
      onboardingType,
      totalSteps: totalSteps || 0,
      deviceInfo: deviceInfo || {}
    });

    await analyticsSession.save();

    res.json({
      success: true,
      sessionId: analyticsSession._id,
      message: 'Onboarding tracking started'
    });

  } catch (error) {
    console.error('Error starting onboarding tracking:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Track step completion
const trackStep = async (req, res) => {
  try {
    const { sessionId, stepIndex, stepTitle, timeSpent, skipped } = req.body;

    if (!sessionId) {
      return res.status(400).json({ success: false, message: 'Session ID required' });
    }

    const session = await OnboardingAnalytics.findById(sessionId);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    session.addStepAnalytics(stepIndex, stepTitle, timeSpent || 0, skipped || false);
    await session.save();

    res.json({
      success: true,
      message: 'Step tracked successfully'
    });

  } catch (error) {
    console.error('Error tracking step:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Complete onboarding
const completeOnboarding = async (req, res) => {
  try {
    const { sessionId, completionMethod, totalTime, feedbackRating, feedbackComment } = req.body;

    if (!sessionId) {
      return res.status(400).json({ success: false, message: 'Session ID required' });
    }

    const session = await OnboardingAnalytics.findById(sessionId);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    session.completeOnboarding(completionMethod || 'completed', totalTime || 0);
    
    if (feedbackRating) {
      session.feedbackRating = feedbackRating;
    }
    
    if (feedbackComment) {
      session.feedbackComment = feedbackComment;
    }

    await session.save();

    res.json({
      success: true,
      message: 'Onboarding completed and tracked'
    });

  } catch (error) {
    console.error('Error completing onboarding tracking:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get analytics for club owner
const getAnalytics = async (req, res) => {
  try {
    const { user } = req.user;
    const { timeframe = '30d' } = req.query;

    // Calculate date filter
    let dateFilter = {};
    const now = new Date();
    switch (timeframe) {
      case '7d':
        dateFilter = { createdAt: { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) } };
        break;
      case '30d':
        dateFilter = { createdAt: { $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) } };
        break;
      case '90d':
        dateFilter = { createdAt: { $gte: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000) } };
        break;
      case 'all':
      default:
        dateFilter = {};
    }

    // Get analytics for this club (main users and invited users)
    const clubFilter = {
      $or: [
        { userId: user._id }, // Main user's own onboarding
        { clubId: user._id }  // Invited users to this club
      ],
      ...dateFilter
    };

    // Overall statistics
    const totalSessions = await OnboardingAnalytics.countDocuments(clubFilter);
    const completedSessions = await OnboardingAnalytics.countDocuments({
      ...clubFilter,
      status: 'completed'
    });
    const skippedSessions = await OnboardingAnalytics.countDocuments({
      ...clubFilter,
      status: 'skipped'
    });

    const completionRate = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;

    // Average completion time
    const avgCompletionTime = await OnboardingAnalytics.getAverageCompletionTime(clubFilter);

    // By user type
    const mainUserStats = await OnboardingAnalytics.getCompletionRate({
      ...clubFilter,
      userType: 'main'
    });
    const invitedUserStats = await OnboardingAnalytics.getCompletionRate({
      ...clubFilter,
      userType: 'invited'
    });

    // By onboarding type
    const wizardStats = await OnboardingAnalytics.getCompletionRate({
      ...clubFilter,
      onboardingType: 'wizard'
    });
    const tourStats = await OnboardingAnalytics.getCompletionRate({
      ...clubFilter,
      onboardingType: 'tour'
    });

    // By role (for invited users)
    const roleStats = await OnboardingAnalytics.aggregate([
      {
        $match: {
          ...clubFilter,
          userType: 'invited',
          userRole: { $ne: null }
        }
      },
      {
        $group: {
          _id: '$userRole',
          total: { $sum: 1 },
          completed: {
            $sum: {
              $cond: [{ $eq: ['$status', 'completed'] }, 1, 0]
            }
          }
        }
      },
      {
        $project: {
          role: '$_id',
          total: 1,
          completed: 1,
          rate: {
            $cond: [
              { $gt: ['$total', 0] },
              { $multiply: [{ $divide: ['$completed', '$total'] }, 100] },
              0
            ]
          }
        }
      }
    ]);

    // Recent sessions
    const recentSessions = await OnboardingAnalytics.find(clubFilter)
      .populate('userId', 'fullName email')
      .sort({ createdAt: -1 })
      .limit(10)
      .select('userId userType userRole onboardingType status completedAt timeSpent createdAt');

    // Step analytics (most problematic steps)
    const stepAnalytics = await OnboardingAnalytics.aggregate([
      { $match: clubFilter },
      { $unwind: '$stepAnalytics' },
      {
        $group: {
          _id: {
            stepIndex: '$stepAnalytics.stepIndex',
            stepTitle: '$stepAnalytics.stepTitle'
          },
          totalViews: { $sum: 1 },
          skipped: {
            $sum: {
              $cond: ['$stepAnalytics.skipped', 1, 0]
            }
          },
          avgTimeSpent: { $avg: '$stepAnalytics.timeSpent' }
        }
      },
      {
        $project: {
          stepIndex: '$_id.stepIndex',
          stepTitle: '$_id.stepTitle',
          totalViews: 1,
          skipped: 1,
          skipRate: {
            $cond: [
              { $gt: ['$totalViews', 0] },
              { $multiply: [{ $divide: ['$skipped', '$totalViews'] }, 100] },
              0
            ]
          },
          avgTimeSpent: { $round: ['$avgTimeSpent', 2] }
        }
      },
      { $sort: { stepIndex: 1 } }
    ]);

    // Feedback summary
    const feedbackStats = await OnboardingAnalytics.aggregate([
      {
        $match: {
          ...clubFilter,
          feedbackRating: { $ne: null }
        }
      },
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$feedbackRating' },
          totalFeedback: { $sum: 1 },
          ratings: {
            $push: '$feedbackRating'
          }
        }
      }
    ]);

    res.json({
      success: true,
      analytics: {
        overview: {
          totalSessions,
          completedSessions,
          skippedSessions,
          completionRate: Math.round(completionRate * 100) / 100,
          avgCompletionTime
        },
        byUserType: {
          main: mainUserStats,
          invited: invitedUserStats
        },
        byOnboardingType: {
          wizard: wizardStats,
          tour: tourStats
        },
        byRole: roleStats,
        stepAnalytics,
        recentSessions,
        feedback: feedbackStats[0] || { avgRating: 0, totalFeedback: 0, ratings: [] }
      }
    });

  } catch (error) {
    console.error('Error getting analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get personal analytics for user
const getPersonalAnalytics = async (req, res) => {
  try {
    const { user } = req.user;

    const sessions = await OnboardingAnalytics.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .select('onboardingType status completedAt timeSpent stepsCompleted totalSteps feedbackRating createdAt');

    res.json({
      success: true,
      sessions
    });

  } catch (error) {
    console.error('Error getting personal analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  startOnboarding,
  trackStep,
  completeOnboarding,
  getAnalytics,
  getPersonalAnalytics
};
