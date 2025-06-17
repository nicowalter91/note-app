import axiosInstance from './axiosInstance';

const API_BASE_URL = '/api/tactics';

// Get all tactics
export const getAllTactics = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    
    if (filters.category) {
      params.append('category', filters.category);
    }
    if (filters.includeTemplates) {
      params.append('includeTemplates', filters.includeTemplates);
    }

    const response = await axiosInstance.get(`${API_BASE_URL}?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tactics:', error);
    throw error;
  }
};

// Get single tactic
export const getTactic = async (tacticId) => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/${tacticId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tactic:', error);
    throw error;
  }
};

// Create new tactic
export const createTactic = async (tacticData) => {
  try {
    const response = await axiosInstance.post(API_BASE_URL, tacticData);
    return response.data;
  } catch (error) {
    console.error('Error creating tactic:', error);
    throw error;
  }
};

// Update tactic
export const updateTactic = async (tacticId, tacticData) => {
  try {
    const response = await axiosInstance.put(`${API_BASE_URL}/${tacticId}`, tacticData);
    return response.data;
  } catch (error) {
    console.error('Error updating tactic:', error);
    throw error;
  }
};

// Delete tactic
export const deleteTactic = async (tacticId) => {
  try {
    const response = await axiosInstance.delete(`${API_BASE_URL}/${tacticId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting tactic:', error);
    throw error;
  }
};

// Create tactic from template
export const createFromTemplate = async (templateId, customizations = {}) => {
  try {
    const response = await axiosInstance.post(`${API_BASE_URL}/from-template`, {
      templateId,
      customizations
    });
    return response.data;
  } catch (error) {
    console.error('Error creating tactic from template:', error);
    throw error;  }
};
