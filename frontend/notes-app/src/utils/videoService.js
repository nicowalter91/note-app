import axiosInstance from './axiosInstance';

const VIDEO_API_PATH = '/api/videos';

// Get all videos
export const getVideos = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    
    if (filters.category && filters.category !== 'all') {
      params.append('category', filters.category);
    }
    if (filters.search) {
      params.append('search', filters.search);
    }
    if (filters.page) {
      params.append('page', filters.page);
    }
    if (filters.limit) {
      params.append('limit', filters.limit);
    }

    const response = await axiosInstance.get(`${VIDEO_API_PATH}?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching videos:', error);
    throw error.response?.data || error;
  }
};

// Get single video
export const getVideo = async (videoId) => {
  try {
    const response = await axiosInstance.get(`${VIDEO_API_PATH}/${videoId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching video:', error);
    throw error.response?.data || error;
  }
};

// Upload video
export const uploadVideo = async (videoData, onProgress) => {
  try {
    console.log('Starting video upload...', videoData);
    
    const formData = new FormData();
    formData.append('video', videoData.file);
    formData.append('title', videoData.title);
    formData.append('category', videoData.category);
    
    if (videoData.description) {
      formData.append('description', videoData.description);
    }
    
    if (videoData.tags && videoData.tags.length > 0) {
      formData.append('tags', JSON.stringify(videoData.tags));
    }

    // Get token for logging
    const token = localStorage.getItem('token');
    console.log('Auth token exists:', !!token);
    
    if (!token) {
      throw new Error('Nicht angemeldet. Bitte logge dich erneut ein.');
    }
    
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log('Upload progress:', percentCompleted + '%');
          onProgress(percentCompleted);
        }
      }
    };

    console.log('Making API call to:', `${VIDEO_API_PATH}/upload`);
    const response = await axiosInstance.post(`${VIDEO_API_PATH}/upload`, formData, config);
    
    console.log('Upload successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Upload error details:', error);
    
    if (error.code === 'ERR_NETWORK') {
      throw new Error('Netzwerk-Fehler: Backend nicht erreichbar. Ist der Server gestartet?');
    }
    
    if (error.response) {
      console.error('Server response:', error.response.data);
      throw new Error(error.response.data.message || 'Server-Fehler beim Upload');
    }
    
    throw new Error(error.message || 'Unbekannter Upload-Fehler');
  }
};

// Delete video
export const deleteVideo = async (videoId) => {
  try {
    const response = await axiosInstance.delete(`${VIDEO_API_PATH}/${videoId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting video:', error);
    throw error.response?.data || error;
  }
};

// Add annotation to video
export const addAnnotation = async (videoId, annotationData) => {
  try {
    const response = await axiosInstance.post(
      `${VIDEO_API_PATH}/${videoId}/annotations`,
      annotationData
    );
    return response.data;
  } catch (error) {
    console.error('Error adding annotation:', error);
    throw error.response?.data || error;
  }
};

// Update annotation
export const updateAnnotation = async (videoId, annotationId, updateData) => {
  try {
    const response = await axiosInstance.put(
      `${VIDEO_API_PATH}/${videoId}/annotations/${annotationId}`,
      updateData
    );
    return response.data;
  } catch (error) {
    console.error('Error updating annotation:', error);
    throw error.response?.data || error;
  }
};

// Delete annotation
export const deleteAnnotation = async (videoId, annotationId) => {
  try {
    const response = await axiosInstance.delete(
      `${VIDEO_API_PATH}/${videoId}/annotations/${annotationId}`
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting annotation:', error);
    throw error.response?.data || error;
  }
};

// Get video analytics
export const getVideoAnalytics = async () => {
  try {
    const response = await axiosInstance.get(`${VIDEO_API_PATH}/analytics`);
    return response.data;
  } catch (error) {
    console.error('Error fetching video analytics:', error);
    throw error.response?.data || error;
  }
};

// Get video stream URL
export const getVideoStreamUrl = (videoId) => {
  const token = localStorage.getItem('token');
  return `http://localhost:8000${VIDEO_API_PATH}/stream/${videoId}?token=${token}`;
};

// Get thumbnail URL
export const getThumbnailUrl = (videoId) => {
  return `http://localhost:8000${VIDEO_API_PATH}/thumbnail/${videoId}`;
};

// Update video
export const updateVideo = async (videoId, videoData) => {
  try {
    const response = await axiosInstance.put(`${VIDEO_API_PATH}/${videoId}`, videoData);
    return response.data;
  } catch (error) {
    console.error('Error updating video:', error);
    throw new Error(error.response?.data?.message || 'Failed to update video');
  }
};
