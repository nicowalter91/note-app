import axiosInstance from './axiosInstance';

const API_BASE_URL = '/api/trainer-mood';

export const getTodaysMood = async () => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/today`);
    return response.data;
  } catch (error) {
    console.error('Fehler beim Abrufen der heutigen Stimmung:', error);
    throw error;
  }
};

export const updateMoodEntry = async (id, data) => {
  try {
    const response = await axiosInstance.put(`${API_BASE_URL}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Fehler beim Aktualisieren der Stimmung:', error);
    throw error;
  }
};

export const getMoodAnalytics = async (days = 30) => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/analytics?days=${days}`);
    return response.data;
  } catch (error) {
    console.error('Fehler beim Abrufen der Stimmungs-Analytik:', error);
    throw error;
  }
};

export const getRecentMoodEntries = async (limit = 10) => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/recent?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Fehler beim Abrufen der letzten Stimmungs-Einträge:', error);
    throw error;
  }
};

export const getMoodEntry = async (id) => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Fehler beim Abrufen der Stimmung:', error);
    throw error;
  }
};

export const deleteMoodEntry = async (id) => {
  try {
    const response = await axiosInstance.delete(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Fehler beim Löschen der Stimmung:', error);
    throw error;
  }
};
