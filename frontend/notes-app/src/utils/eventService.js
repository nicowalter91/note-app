import axiosInstance from './axiosInstance';

// Add a new event
export const addEvent = async (eventData) => {
  try {
    const response = await axiosInstance.post('/add-event', eventData);
    return response.data;
  } catch (error) {
    console.error('Error adding event:', error);
    throw error;
  }
};

// Add recurring training sessions
export const addRecurringTraining = async (trainingData) => {
  try {
    const response = await axiosInstance.post('/add-recurring-training', trainingData);
    return response.data;
  } catch (error) {
    console.error('Error adding recurring training:', error);
    throw error;
  }
};

// Edit an existing event
export const editEvent = async (eventId, eventData) => {
  try {
    const response = await axiosInstance.put(`/edit-event/${eventId}`, eventData);
    return response.data;
  } catch (error) {
    console.error('Error editing event:', error);
    throw error;
  }
};

// Get all events
export const getAllEvents = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    
    if (filters.startDate) {
      params.append('startDate', filters.startDate);
    }
    if (filters.endDate) {
      params.append('endDate', filters.endDate);
    }
    if (filters.type) {
      params.append('type', filters.type);
    }
    
    const url = `/get-all-events${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.error('Error getting events:', error);
    throw error;
  }
};

// Get a single event
export const getEvent = async (eventId) => {
  try {
    const response = await axiosInstance.get(`/get-event/${eventId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting event:', error);
    throw error;
  }
};

// Delete an event
export const deleteEvent = async (eventId) => {
  try {
    const response = await axiosInstance.delete(`/delete-event/${eventId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};

// Update player attendance
export const updatePlayerAttendance = async (eventId, playerAttendance) => {
  try {
    const response = await axiosInstance.put(`/update-attendance/${eventId}`, {
      playerAttendance
    });
    return response.data;
  } catch (error) {
    console.error('Error updating attendance:', error);
    throw error;
  }
};

// Get event statistics
export const getEventStats = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    
    if (filters.year) {
      params.append('year', filters.year);
    }
    if (filters.month) {
      params.append('month', filters.month);
    }
    
    const url = `/event-stats${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.error('Error getting event stats:', error);
    throw error;
  }
};

// Helper function to format event data for the API
export const formatEventForAPI = (formData, type, gameData, trainingData, eventData, playerAttendance) => {
  return {
    title: formData.title,
    type: type,
    date: formData.date,
    time: formData.time,
    duration: parseInt(formData.duration) || 90,
    location: formData.location || '',
    description: formData.description || '',
    gameData: type === 'game' ? gameData : undefined,
    trainingData: type === 'training' ? {
      ...trainingData,
      exercises: trainingData.exercises || []
    } : undefined,
    eventData: type === 'event' ? eventData : undefined,
    playerAttendance: Object.entries(playerAttendance || {}).map(([playerId, status]) => ({
      playerId,
      status
    }))
  };
};

// Helper function to format API event data for the frontend
export const formatEventFromAPI = (apiEvent) => {
  if (!apiEvent) return null;
  
  // Convert playerAttendance array back to object format
  const playerAttendance = {};
  if (apiEvent.playerAttendance) {
    apiEvent.playerAttendance.forEach(attendance => {
      playerAttendance[attendance.playerId._id || attendance.playerId] = attendance.status;
    });
  }
  
  return {
    ...apiEvent,
    date: new Date(apiEvent.date).toISOString().split('T')[0], // Format for input[type="date"]
    playerAttendance,
    // Extract training exercises if they exist
    trainingExercises: apiEvent.trainingData?.exercises?.map(exercise => ({
      id: exercise.exerciseId._id || exercise.exerciseId,
      exerciseId: exercise.exerciseId._id || exercise.exerciseId,
      title: exercise.title || exercise.exerciseId.title,
      category: exercise.category || exercise.exerciseId.category,
      duration: exercise.duration,
      order: exercise.order,
      // Include full exercise data if populated
      ...(exercise.exerciseId.organisation && {
        organisation: exercise.exerciseId.organisation,
        durchfuehrung: exercise.exerciseId.durchfuehrung,
        coaching: exercise.exerciseId.coaching,
        variante: exercise.exerciseId.variante,
        tags: exercise.exerciseId.tags
      })
    })) || []
  };
};
