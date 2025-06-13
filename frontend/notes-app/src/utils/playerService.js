import axiosInstance from './axiosInstance';

// Funktion zum Abrufen aller Spieler
export const getAllPlayers = async () => {
  try {
    const response = await axiosInstance.get('/players');
    return response.data.players;
  } catch (error) {
    console.error('Fehler beim Abrufen der Spieler:', error);
    throw error;
  }
};

// Funktion zum Abrufen eines einzelnen Spielers
export const getPlayerById = async (id) => {
  try {
    const response = await axiosInstance.get(`/players/${id}`);
    return response.data.player;
  } catch (error) {
    console.error(`Fehler beim Abrufen des Spielers mit ID ${id}:`, error);
    throw error;
  }
};

// Funktion zum Hinzufügen eines neuen Spielers
export const addPlayer = async (playerData) => {
  try {
    const response = await axiosInstance.post('/players', playerData);
    return response.data.player;
  } catch (error) {
    console.error('Fehler beim Hinzufügen eines Spielers:', error);
    throw error;
  }
};

// Funktion zum Bearbeiten eines Spielers
export const updatePlayer = async (id, playerData) => {
  try {
    const response = await axiosInstance.put(`/players/${id}`, playerData);
    return response.data.player;
  } catch (error) {
    console.error(`Fehler beim Aktualisieren des Spielers mit ID ${id}:`, error);
    throw error;
  }
};

// Funktion zum Löschen eines Spielers
export const deletePlayer = async (id) => {
  try {
    const response = await axiosInstance.delete(`/players/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Fehler beim Löschen des Spielers mit ID ${id}:`, error);
    throw error;
  }
};

// Funktion zum Hochladen eines Profilbilds
export const uploadProfileImage = async (id, imageFile) => {
  try {
    // FormData für Dateiupload erstellen
    const formData = new FormData();
    formData.append('profileImage', imageFile);

    // Header-Konfiguration für Dateiupload
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };

    const response = await axiosInstance.post(`/players/${id}/profile-image`, formData, config);
    return response.data;
  } catch (error) {
    console.error(`Fehler beim Hochladen des Profilbilds für Spieler mit ID ${id}:`, error);
    throw error;
  }
};

// Funktion zum Löschen eines Profilbilds
export const deleteProfileImage = async (id) => {
  try {
    const response = await axiosInstance.delete(`/players/${id}/profile-image`);
    return response.data;
  } catch (error) {
    console.error(`Fehler beim Löschen des Profilbilds für Spieler mit ID ${id}:`, error);
    throw error;
  }
};

// Funktion zum Abrufen der Profilbild-URL
export const getProfileImageUrl = (id) => {
  return `${axiosInstance.defaults.baseURL}/players/${id}/profile-image`;
};
