import axiosInstance from './axiosInstance';

// Start onboarding tracking
export const startOnboardingTracking = async (onboardingType, totalSteps) => {
  try {
    const deviceInfo = {
      userAgent: navigator.userAgent,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      isMobile: window.innerWidth <= 768
    };

    const response = await axiosInstance.post('/analytics/onboarding/start', {
      onboardingType,
      totalSteps,
      deviceInfo
    });
    
    return response.data;
  } catch (error) {
    console.error('Error starting onboarding tracking:', error);
    throw error.response?.data || { message: 'Failed to start tracking' };
  }
};

// Track step completion
export const trackOnboardingStep = async (sessionId, stepIndex, stepTitle, timeSpent, skipped = false) => {
  try {
    const response = await axiosInstance.post('/analytics/onboarding/track-step', {
      sessionId,
      stepIndex,
      stepTitle,
      timeSpent,
      skipped
    });
    
    return response.data;
  } catch (error) {
    console.error('Error tracking step:', error);
    // Don't throw error for tracking - it shouldn't break the user experience
    return null;
  }
};

// Complete onboarding tracking
export const completeOnboardingTracking = async (sessionId, completionMethod, totalTime, feedbackRating = null, feedbackComment = null) => {
  try {
    const response = await axiosInstance.post('/analytics/onboarding/complete', {
      sessionId,
      completionMethod,
      totalTime,
      feedbackRating,
      feedbackComment
    });
    
    return response.data;
  } catch (error) {
    console.error('Error completing onboarding tracking:', error);
    // Don't throw error for tracking - it shouldn't break the user experience
    return null;
  }
};

// Get analytics (for club owners)
export const getOnboardingAnalytics = async (timeframe = '30d') => {
  try {
    const response = await axiosInstance.get(`/analytics/onboarding?timeframe=${timeframe}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching analytics:', error);
    throw error.response?.data || { message: 'Failed to fetch analytics' };
  }
};

// Get personal analytics
export const getPersonalOnboardingAnalytics = async () => {
  try {
    const response = await axiosInstance.get('/analytics/onboarding/personal');
    return response.data;
  } catch (error) {
    console.error('Error fetching personal analytics:', error);
    throw error.response?.data || { message: 'Failed to fetch personal analytics' };
  }
};

// Export all analytics functions
export default {
  startOnboardingTracking,
  trackOnboardingStep,
  completeOnboardingTracking,
  getOnboardingAnalytics,
  getPersonalOnboardingAnalytics
};
