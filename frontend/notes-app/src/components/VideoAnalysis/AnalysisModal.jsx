import React, { useState, useRef } from 'react';
import { FaTimes, FaBookmark, FaTrash, FaEdit, FaEye } from 'react-icons/fa';
import VideoPlayer from './VideoPlayer';

const AnalysisModal = ({ video, onClose }) => {
  const videoPlayerRef = useRef(null);
  const [annotations, setAnnotations] = useState([
    {
      id: 1,
      timestamp: 120,
      title: 'Gute Kombination',
      description: 'Schöne Passfolge über 3 Stationen',
      category: 'highlight',
      createdAt: new Date()
    },
    {
      id: 2,
      timestamp: 300,
      title: 'Pressing-Fehler',
      description: 'Zu spätes Anlaufen, Gegner kann sich lösen',
      category: 'mistake',
      createdAt: new Date()
    }
  ]);
  
  const [selectedAnnotation, setSelectedAnnotation] = useState(null);
  const [activeTab, setActiveTab] = useState('annotations');

  const categoryColors = {
    general: 'gray',
    tactics: 'blue',
    technique: 'green',
    mistake: 'red',
    highlight: 'yellow'
  };

  const categoryLabels = {
    general: 'Allgemein',
    tactics: 'Taktik',
    technique: 'Technik',
    mistake: 'Fehler',
    highlight: 'Highlight'
  };

  const handleAddAnnotation = (annotationData) => {
    const newAnnotation = {
      id: Date.now(),
      ...annotationData,
      createdAt: new Date()
    };
    setAnnotations(prev => [...prev, newAnnotation]);
  };

  const handleDeleteAnnotation = (id) => {
    if (window.confirm('Annotation wirklich löschen?')) {
      setAnnotations(prev => prev.filter(ann => ann.id !== id));
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const sortedAnnotations = [...annotations].sort((a, b) => a.timestamp - b.timestamp);

  const handleAnnotationClick = (annotation) => {
    setSelectedAnnotation(annotation);
    // Jump to the annotation timestamp
    if (videoPlayerRef.current) {
      videoPlayerRef.current.seekToTime(annotation.timestamp);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-7xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div>            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {video.title}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {video.uploadDate ? new Date(video.uploadDate).toLocaleDateString('de-DE') : 'Unbekannt'} • {categoryLabels[video.category]}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Video Player */}
          <div className="flex-1 flex flex-col bg-black">            <VideoPlayer
              ref={videoPlayerRef}
              video={video}
              annotations={annotations}
              onAddAnnotation={handleAddAnnotation}
              className="flex-1"
            />
          </div>

          {/* Sidebar */}
          <div className="w-80 border-l border-gray-200 dark:border-gray-700 flex flex-col bg-white dark:bg-gray-800">
            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex">
                <button
                  onClick={() => setActiveTab('annotations')}
                  className={`flex-1 py-3 px-4 text-sm font-medium ${
                    activeTab === 'annotations'
                      ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <FaBookmark className="inline mr-2" size={14} />
                  Annotationen ({annotations.length})
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {activeTab === 'annotations' && (
                <div className="space-y-4">
                  {sortedAnnotations.length === 0 ? (
                    <div className="text-center py-8">
                      <FaBookmark className="mx-auto text-4xl text-gray-300 dark:text-gray-600 mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">
                        Noch keine Annotationen vorhanden
                      </p>
                      <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                        Klicke auf "Notiz" im Video-Player, um eine Annotation hinzuzufügen
                      </p>
                    </div>
                  ) : (
                    sortedAnnotations.map(annotation => (
                      <div
                        key={annotation.id}
                        className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                          selectedAnnotation?.id === annotation.id
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                        onClick={() => handleAnnotationClick(annotation)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 text-xs rounded-full bg-${categoryColors[annotation.category]}-100 dark:bg-${categoryColors[annotation.category]}-900/20 text-${categoryColors[annotation.category]}-700 dark:text-${categoryColors[annotation.category]}-300`}>
                              {categoryLabels[annotation.category]}
                            </span>                            <span className="text-sm font-mono text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 cursor-pointer font-semibold">
                              {formatTime(annotation.timestamp)}
                            </span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteAnnotation(annotation.id);
                            }}
                            className="text-red-400 hover:text-red-600 dark:hover:text-red-300"
                          >
                            <FaTrash size={12} />
                          </button>
                        </div>
                        
                        <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                          {annotation.title}
                        </h4>
                        
                        {annotation.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                            {annotation.description}
                          </p>
                        )}
                        
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                          {annotation.createdAt.toLocaleString('de-DE')}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Annotation Details */}
            {selectedAnnotation && (
              <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  Annotation Details
                </h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Zeit: </span>
                    <span className="font-mono">{formatTime(selectedAnnotation.timestamp)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Kategorie: </span>
                    <span className={`px-2 py-1 text-xs rounded bg-${categoryColors[selectedAnnotation.category]}-100 dark:bg-${categoryColors[selectedAnnotation.category]}-900/20 text-${categoryColors[selectedAnnotation.category]}-700 dark:text-${categoryColors[selectedAnnotation.category]}-300`}>
                      {categoryLabels[selectedAnnotation.category]}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Titel: </span>
                    <span>{selectedAnnotation.title}</span>
                  </div>
                  {selectedAnnotation.description && (
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Beschreibung: </span>
                      <p className="mt-1">{selectedAnnotation.description}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisModal;
