import React, { useState, useEffect } from 'react';
import { FaTimes, FaChevronRight, FaChevronLeft, FaMapMarkerAlt, FaCheckCircle } from 'react-icons/fa';
import { Button, Card } from '../UI/DesignSystem';
import { startOnboardingTracking, trackOnboardingStep, completeOnboardingTracking } from '../../utils/analyticsService';

const InvitedUserTour = ({ user, teamMember, onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [analyticsSessionId, setAnalyticsSessionId] = useState(null);
  const [stepStartTime, setStepStartTime] = useState(Date.now());
  const [tourStartTime] = useState(Date.now());

  // Define tour steps based on role and permissions
  const getTourSteps = () => {
    const baseSteps = [
      {
        target: '.navbar',
        title: 'Welcome to Football Trainer!',
        content: `Hi ${teamMember?.name || user?.fullName}! You've been invited as a ${teamMember?.role} to join this team. Let's explore what you can do.`,
        position: 'bottom',
        highlight: false
      }
    ];

    const roleSpecificSteps = [];

    // Add role-specific steps based on permissions
    if (teamMember?.permissions?.canViewPlayers) {
      roleSpecificSteps.push({
        target: '[data-tour="players-menu"]',
        title: 'Player Management',
        content: teamMember.permissions.canEditPlayers 
          ? 'You can view and edit player information, including injuries and performance data.'
          : 'You can view player information and their performance statistics.',
        position: 'right',
        highlight: true
      });
    }

    if (teamMember?.permissions?.canViewTraining) {
      roleSpecificSteps.push({
        target: '[data-tour="training-menu"]',
        title: 'Training Sessions',
        content: teamMember.permissions.canEditTraining
          ? 'You can create and manage training sessions, exercises, and drills.'
          : 'You can view training sessions and exercises planned by the coaching staff.',
        position: 'right',
        highlight: true
      });
    }

    if (teamMember?.permissions?.canViewStatistics) {
      roleSpecificSteps.push({
        target: '[data-tour="statistics-menu"]',
        title: 'Statistics & Analytics',
        content: 'Access detailed player and team statistics to analyze performance trends.',
        position: 'right',
        highlight: true
      });
    }

    if (teamMember?.permissions?.canViewFinances) {
      roleSpecificSteps.push({
        target: '[data-tour="finance-menu"]',
        title: 'Team Finances',
        content: 'Manage team expenses, budgets, and financial planning.',
        position: 'right',
        highlight: true
      });
    }

    // Add role-specific final steps
    switch (teamMember?.role) {
      case 'assistant':
        roleSpecificSteps.push({
          target: '.main-content',
          title: 'Assistant Coach Role',
          content: 'As an assistant coach, you have comprehensive access to training planning and player management. You can help organize training sessions and work directly with players.',
          position: 'center',
          highlight: false
        });
        break;
      case 'caretaker':
        roleSpecificSteps.push({
          target: '.main-content',
          title: 'Team Caretaker Role',
          content: 'As a team caretaker, you focus on player welfare and team logistics. You can view training plans and manage team finances.',
          position: 'center',
          highlight: false
        });
        break;
      case 'physiotherapist':
        roleSpecificSteps.push({
          target: '.main-content',
          title: 'Physiotherapist Role',
          content: 'As a physiotherapist, you can update player injury status and track their physical condition. Focus on the player management section for injury tracking.',
          position: 'center',
          highlight: false
        });
        break;
      case 'analyst':
        roleSpecificSteps.push({
          target: '.main-content',
          title: 'Analyst Role',
          content: 'As an analyst, your focus is on statistics and performance data. Use the statistics section to analyze player and team performance trends.',
          position: 'center',
          highlight: false
        });
        break;
    }

    const finalSteps = [
      {
        target: '[data-tour="settings-menu"]',
        title: 'Your Profile',
        content: 'Access your profile settings and preferences here. You can update your personal information and notification settings.',
        position: 'right',
        highlight: true
      },
      {
        target: '.main-content',
        title: 'Ready to Start!',
        content: 'You\'re all set! Start exploring the features available to your role. If you need help, use the help section or contact the head coach.',
        position: 'center',
        highlight: false
      }
    ];

    return [...baseSteps, ...roleSpecificSteps, ...finalSteps];
  };
  const steps = getTourSteps();

  // Initialize analytics on mount
  useEffect(() => {
    initAnalytics();
  }, []);

  // Track step changes
  useEffect(() => {
    setStepStartTime(Date.now());
  }, [currentStep]);

  const initAnalytics = async () => {
    try {
      const response = await startOnboardingTracking('tour', steps.length);
      if (response.success) {
        setAnalyticsSessionId(response.sessionId);
      }
    } catch (error) {
      console.error('Failed to start tour analytics:', error);
      // Continue without analytics
    }
  };

  const trackCurrentStep = async (skipped = false) => {
    if (analyticsSessionId && steps[currentStep]) {
      const timeSpent = Math.round((Date.now() - stepStartTime) / 1000);
      const stepTitle = steps[currentStep].title;
      await trackOnboardingStep(analyticsSessionId, currentStep, stepTitle, timeSpent, skipped);
    }
  };

  const handleNext = async () => {
    // Track current step before moving
    await trackCurrentStep(false);
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = async () => {
    // Track step as skipped when going back
    await trackCurrentStep(true);
    
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    // Track final step
    await trackCurrentStep(false);
    
    // Complete analytics tracking
    if (analyticsSessionId) {
      const totalTime = Math.round((Date.now() - tourStartTime) / 1000);
      await completeOnboardingTracking(analyticsSessionId, 'completed', totalTime);
    }
    
    setIsVisible(false);
    onComplete();
  };

  const handleSkip = async () => {
    // Track current step as skipped
    await trackCurrentStep(true);
    
    // Complete analytics tracking as skipped
    if (analyticsSessionId) {
      const totalTime = Math.round((Date.now() - tourStartTime) / 1000);
      await completeOnboardingTracking(analyticsSessionId, 'skipped', totalTime);
    }
    
    setIsVisible(false);
    onSkip();
  };

  const currentStepData = steps[currentStep];

  // Get target element position for positioning the tooltip
  const getTooltipPosition = () => {
    if (!currentStepData?.target || currentStepData.position === 'center') {
      return {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 10000
      };
    }

    const targetElement = document.querySelector(currentStepData.target);
    if (!targetElement) {
      return {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 10000
      };
    }

    const rect = targetElement.getBoundingClientRect();
    const tooltipWidth = 320;
    const tooltipHeight = 200;

    let style = {
      position: 'fixed',
      zIndex: 10000
    };

    switch (currentStepData.position) {
      case 'bottom':
        style.top = rect.bottom + 10;
        style.left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
        break;
      case 'top':
        style.top = rect.top - tooltipHeight - 10;
        style.left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
        break;
      case 'right':
        style.top = rect.top + (rect.height / 2) - (tooltipHeight / 2);
        style.left = rect.right + 10;
        break;
      case 'left':
        style.top = rect.top + (rect.height / 2) - (tooltipHeight / 2);
        style.left = rect.left - tooltipWidth - 10;
        break;
      default:
        style.top = '50%';
        style.left = '50%';
        style.transform = 'translate(-50%, -50%)';
    }

    // Ensure tooltip stays within viewport
    if (style.left < 10) style.left = 10;
    if (style.left + tooltipWidth > window.innerWidth - 10) {
      style.left = window.innerWidth - tooltipWidth - 10;
    }
    if (style.top < 10) style.top = 10;
    if (style.top + tooltipHeight > window.innerHeight - 10) {
      style.top = window.innerHeight - tooltipHeight - 10;
    }

    return style;
  };

  // Highlight target element
  useEffect(() => {
    if (!currentStepData?.target || !currentStepData.highlight) return;

    const targetElement = document.querySelector(currentStepData.target);
    if (targetElement) {
      targetElement.style.position = 'relative';
      targetElement.style.zIndex = '9999';
      targetElement.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.5)';
      targetElement.style.borderRadius = '8px';
    }

    return () => {
      if (targetElement) {
        targetElement.style.position = '';
        targetElement.style.zIndex = '';
        targetElement.style.boxShadow = '';
        targetElement.style.borderRadius = '';
      }
    };
  }, [currentStep, currentStepData]);

  if (!isVisible) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-[9998]"
        onClick={handleSkip}
      />

      {/* Tour Tooltip */}
      <div
        style={getTooltipPosition()}
        className="bg-white rounded-lg shadow-2xl border border-gray-200 p-6 max-w-sm"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">          <div className="flex items-center gap-2">
            <FaMapMarkerAlt className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-600">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSkip}
            className="p-1 h-6 w-6"
          >
            <FaTimes className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {currentStepData.title}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            {currentStepData.content}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Progress</span>
            <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSkip}
            className="text-gray-500"
          >
            Skip Tour
          </Button>

          <div className="flex items-center gap-2">            {currentStep > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevious}
                className="flex items-center gap-1"
              >
                <FaChevronLeft className="h-4 w-4" />
                Previous
              </Button>
            )}
            
            <Button
              size="sm"
              onClick={handleNext}
              className="flex items-center gap-1"
            >
              {currentStep === steps.length - 1 ? (
                <>
                  <FaCheckCircle className="h-4 w-4" />
                  Finish
                </>
              ) : (
                <>
                  Next
                  <FaChevronRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvitedUserTour;
