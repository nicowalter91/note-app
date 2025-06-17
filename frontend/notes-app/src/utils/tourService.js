import axiosInstance from './axiosInstance';

// Complete tour for invited users
export const completeTour = async () => {
  try {
    const response = await axiosInstance.put('/complete-tour');
    return response.data;
  } catch (error) {
    console.error('Error completing tour:', error);
    throw error.response?.data || { message: 'Failed to complete tour' };
  }
};

// Export all tour-related functions
export default {
  completeTour
};
