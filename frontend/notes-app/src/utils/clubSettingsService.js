import axiosInstance from './axiosInstance';

const API_BASE_URL = '/api/club-settings';

// Get club settings
export const getClubSettings = async () => {
  try {
    const response = await axiosInstance.get(API_BASE_URL);
    return response.data;
  } catch (error) {
    console.error('Fehler beim Abrufen der Vereinseinstellungen:', error);
    throw error;
  }
};

// Update club settings
export const updateClubSettings = async (settings) => {
  try {
    const response = await axiosInstance.put(API_BASE_URL, settings);
    return response.data;
  } catch (error) {
    console.error('Fehler beim Aktualisieren der Vereinseinstellungen:', error);
    throw error;
  }
};

// Upload club logo
export const uploadClubLogo = async (logoFile) => {
  try {
    const formData = new FormData();
    formData.append('logo', logoFile);
    
    const response = await axiosInstance.post(`${API_BASE_URL}/logo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Fehler beim Hochladen des Logos:', error);
    throw error;
  }
};
