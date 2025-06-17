import axiosInstance from './axiosInstance';

const API_BASE_URL = '/api/team-members';

// Get all team members
export const getTeamMembers = async () => {
  try {
    const response = await axiosInstance.get(API_BASE_URL);
    return response.data;
  } catch (error) {
    console.error('Fehler beim Abrufen der Team-Mitglieder:', error);
    throw error;
  }
};

// Invite a new team member
export const inviteTeamMember = async (memberData) => {
  try {
    const response = await axiosInstance.post(`${API_BASE_URL}/invite`, memberData);
    return response.data;
  } catch (error) {
    console.error('Fehler beim Einladen des Team-Mitglieds:', error);
    throw error;
  }
};

// Accept team invitation
export const acceptInvitation = async (token) => {
  try {
    const response = await axiosInstance.post(`${API_BASE_URL}/accept/${token}`);
    return response.data;
  } catch (error) {
    console.error('Fehler beim Annehmen der Einladung:', error);
    throw error;
  }
};

// Update team member
export const updateTeamMember = async (memberId, updateData) => {
  try {
    const response = await axiosInstance.put(`${API_BASE_URL}/${memberId}`, updateData);
    return response.data;
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Team-Mitglieds:', error);
    throw error;
  }
};

// Remove team member
export const removeTeamMember = async (memberId) => {
  try {
    const response = await axiosInstance.delete(`${API_BASE_URL}/${memberId}`);
    return response.data;
  } catch (error) {
    console.error('Fehler beim Entfernen des Team-Mitglieds:', error);
    throw error;
  }
};
