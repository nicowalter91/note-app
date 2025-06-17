import axiosInstance from './axiosInstance';

const API_BASE_URL = '/api/formations';

// Get all formations
export const getAllFormations = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    
    if (filters.includeTemplates) {
      params.append('includeTemplates', filters.includeTemplates);
    }

    const response = await axiosInstance.get(`${API_BASE_URL}?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching formations:', error);
    throw error;
  }
};

// Create new formation
export const createFormation = async (formationData) => {
  try {
    const response = await axiosInstance.post(API_BASE_URL, formationData);
    return response.data;
  } catch (error) {
    console.error('Error creating formation:', error);
    throw error;
  }
};

// Create formation from template
export const createFromTemplate = async (templateFormation, customizations = {}) => {
  try {
    const response = await axiosInstance.post(`${API_BASE_URL}/from-template`, {
      templateFormation,
      customizations
    });
    return response.data;
  } catch (error) {
    console.error('Error creating formation from template:', error);
    throw error;
  }
};

// Get position assignments for a formation
export const getPositionsForFormation = (formationId) => {
  // Default formation positions
  const defaultPositions = {
    '4-4-2': {
      positions: [
        { id: 1, name: 'Torwart', x: 50, y: 85, role: 'GK', color: 'blue' },
        { id: 2, name: 'Rechter Verteidiger', x: 25, y: 65, role: 'RB', color: 'green' },
        { id: 3, name: 'Innenverteidiger (R)', x: 40, y: 65, role: 'CB', color: 'green' },
        { id: 4, name: 'Innenverteidiger (L)', x: 60, y: 65, role: 'CB', color: 'green' },
        { id: 5, name: 'Linker Verteidiger', x: 75, y: 65, role: 'LB', color: 'green' },
        { id: 6, name: 'Rechtes Mittelfeld', x: 25, y: 40, role: 'RM', color: 'yellow' },
        { id: 7, name: 'Defensives Mittelfeld (R)', x: 40, y: 40, role: 'CDM', color: 'yellow' },
        { id: 8, name: 'Defensives Mittelfeld (L)', x: 60, y: 40, role: 'CDM', color: 'yellow' },
        { id: 9, name: 'Linkes Mittelfeld', x: 75, y: 40, role: 'LM', color: 'yellow' },
        { id: 10, name: 'Stürmer (R)', x: 40, y: 15, role: 'ST', color: 'red' },
        { id: 11, name: 'Stürmer (L)', x: 60, y: 15, role: 'ST', color: 'red' }
      ]
    }
  };

  return defaultPositions[formationId] || defaultPositions['4-4-2'];
};
