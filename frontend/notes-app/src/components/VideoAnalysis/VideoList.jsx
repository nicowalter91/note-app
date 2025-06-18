import React from 'react';
import { FaPlay, FaCalendarDay, FaTags, FaEye, FaTrash, FaVideo } from 'react-icons/fa';

const VideoList = ({ 
  videos, 
  onVideoSelect, 
  onVideoDelete, 
  className = '',
  showActions = true 
}) => {
  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (videos.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <FaVideo className="mx-auto text-4xl text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Keine Videos gefunden
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Lade dein erstes Video hoch, um mit der Analyse zu beginnen.
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {videos.map(video => (
        <div
          key={video.id}
          className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div className="flex">
            {/* Thumbnail */}
            <div className="relative w-48 h-32 flex-shrink-0">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all flex items-center justify-center">
                <button
                  onClick={() => onVideoSelect(video)}
                  className="opacity-0 hover:opacity-100 transition-opacity bg-white bg-opacity-90 rounded-full p-3 text-gray-900"
                >
                  <FaPlay size={16} />
                </button>
              </div>
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                {formatDuration(video.duration)}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900 dark:text-white text-lg line-clamp-2">
                  {video.title}
                </h3>
                {showActions && (
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => onVideoSelect(video)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 p-2 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      title="Analysieren"
                    >
                      <FaEye size={16} />
                    </button>
                    <button
                      onClick={() => onVideoDelete(video.id)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 p-2 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                      title="Löschen"
                    >
                      <FaTrash size={16} />
                    </button>
                  </div>
                )}
              </div>

              {/* Metadata */}
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                <span className="flex items-center">
                  <FaCalendarDay className="mr-1" size={12} />
                  {formatDate(video.uploadDate)}
                </span>
                <span>{video.size}</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  video.category === 'match' ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300' :
                  video.category === 'training' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' :
                  video.category === 'tactics' ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300' :
                  'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300'
                }`}>
                  {video.category === 'match' ? 'Spiel' :
                   video.category === 'training' ? 'Training' :
                   video.category === 'tactics' ? 'Taktik' : 'Einzelanalyse'}
                </span>
              </div>

              {/* Description (if available) */}
              {video.description && (
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                  {video.description}
                </p>
              )}

              {/* Tags and Annotations */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm">
                  <span className="flex items-center text-blue-600 dark:text-blue-400">
                    <FaTags className="mr-1" size={12} />
                    {video.annotations} Annotationen
                  </span>
                  
                  {video.tags && video.tags.length > 0 && (
                    <div className="flex space-x-1">
                      {video.tags.slice(0, 3).map((tag, index) => (
                        <span 
                          key={index}
                          className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                      {video.tags.length > 3 && (
                        <span className="text-gray-500 dark:text-gray-400 text-xs">
                          +{video.tags.length - 3} mehr
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VideoList;
