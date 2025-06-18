import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaBookmark, FaTrash, FaEdit, FaEye } from 'react-icons/fa';
import Layout from '../../components/Layout/Layout';
import { 
  PageHeader, 
  Card, 
  Button, 
  Badge,
  LoadingSpinner, 
  EmptyState
} from '../../components/UI/DesignSystem';
import VideoPlayer from '../../components/VideoAnalysis/VideoPlayer';
import { getVideoById, addAnnotation, deleteAnnotation } from '../../utils/videoService';

const VideoDetail = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const videoPlayerRef = useRef(null);
  
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
    const [annotations, setAnnotations] = useState([]);
  
  const [selectedAnnotation, setSelectedAnnotation] = useState(null);
  const [activeTab, setActiveTab] = useState('annotations');
  const categoryColors = {
    general: 'default',
    tactics: 'info',
    highlight: 'success',
    mistake: 'danger',
    fitness: 'warning'
  };

  const categoryLabels = {
    general: 'Allgemein',
    tactics: 'Taktik',
    highlight: 'Highlight',
    mistake: 'Fehler',
    fitness: 'Fitness'
  };
  useEffect(() => {
    const loadVideo = async () => {
      try {
        setLoading(true);
        const videoData = await getVideoById(videoId);
        setVideo(videoData);
        
        // Load annotations from video data
        if (videoData.annotations && Array.isArray(videoData.annotations)) {
          setAnnotations(videoData.annotations);
        }
      } catch (err) {
        console.error('Error loading video:', err);
        setError('Video konnte nicht geladen werden');
      } finally {
        setLoading(false);
      }
    };

    if (videoId) {
      loadVideo();
    }
  }, [videoId]);
  const handleAddAnnotation = async (annotationData) => {
    try {
      const response = await addAnnotation(videoId, annotationData);
      if (response.success) {
        setAnnotations(prev => [...prev, response.annotation]);
      }
    } catch (error) {
      console.error('Error adding annotation:', error);
      // TODO: Show error message to user
    }
  };

  const handleDeleteAnnotation = async (annotationId) => {
    try {
      const response = await deleteAnnotation(videoId, annotationId);
      if (response.success) {
        setAnnotations(prev => prev.filter(ann => ann._id !== annotationId));
      }
    } catch (error) {
      console.error('Error deleting annotation:', error);
      // TODO: Show error message to user
    }
  };

  const handleAnnotationClick = (annotation) => {
    setSelectedAnnotation(annotation);
    // Jump to the annotation timestamp
    if (videoPlayerRef.current) {
      videoPlayerRef.current.seekToTime(annotation.timestamp);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const sortedAnnotations = annotations.sort((a, b) => a.timestamp - b.timestamp);
  if (loading) {
    return (
      <Layout>
        <LoadingSpinner size="lg" text="Video wird geladen..." />
      </Layout>
    );
  }

  if (error || !video) {
    return (
      <Layout>
        <EmptyState
          icon={FaEye}
          title="Video nicht gefunden"
          description={error || 'Das angeforderte Video konnte nicht geladen werden.'}
          action={
            <Button onClick={() => navigate('/video-analysis')}>
              Zurück zur Übersicht
            </Button>
          }
        />
      </Layout>
    );
  }
  return (
    <Layout>
      <div className="h-full flex flex-col">
        {/* Header */}
        <PageHeader
          title={video.title}
          subtitle={`📅 ${video.uploadDate ? new Date(video.uploadDate).toLocaleDateString('de-DE') : 'Unbekannt'} • 🏷️ ${categoryLabels[video.category]} • 📝 ${annotations.length} Annotationen`}
          icon={FaEye}
          action={
            <div className="flex items-center space-x-3">
              <Badge variant="info">
                � Klicke auf das Video für Annotationen
              </Badge>
              <Button
                variant="secondary"
                icon={FaArrowLeft}
                onClick={() => navigate('/video-analysis')}
              >
                Zurück
              </Button>
            </div>
          }
        />{/* Main Content */}
        <div className="flex-1 flex overflow-hidden bg-gray-50 dark:bg-gray-900">
          {/* Video Player Section */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 bg-black rounded-lg m-4 overflow-hidden shadow-2xl">
              <VideoPlayer
                ref={videoPlayerRef}
                video={video}
                annotations={annotations}
                onAddAnnotation={handleAddAnnotation}
                className="flex-1"
              />
            </div>
          </div>          {/* Sidebar */}
          <div className="w-96 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col shadow-xl">
            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <nav className="flex">
                <button
                  onClick={() => setActiveTab('annotations')}
                  className={`flex-1 py-4 px-6 text-sm font-medium transition-all duration-200 ${
                    activeTab === 'annotations'
                      ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >                  <div className="flex items-center justify-center space-x-2">
                    <FaBookmark size={14} />
                    <span>Annotationen</span>
                    <Badge variant="info" size="sm">
                      {annotations.length}
                    </Badge>
                  </div>
                </button>
              </nav>
            </div>            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto">
              {/* Stats Header */}
              {annotations.length > 0 && (
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-b border-blue-100 dark:border-blue-800">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Gesamt</div>
                      <div className="font-semibold text-gray-900 dark:text-white">{annotations.length}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Mit Spieler</div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {annotations.filter(a => a.playerId).length}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Highlights</div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {annotations.filter(a => a.category === 'highlight').length}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="p-6">
                {activeTab === 'annotations' && (
                  <div className="space-y-3">
                    {sortedAnnotations.length === 0 ? (
                      <div className="text-center py-16">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                          <FaBookmark className="text-2xl text-blue-500 dark:text-blue-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                          Noch keine Annotationen
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-4">
                          Erstelle deine erste Annotation, um wichtige Momente zu markieren
                        </p>
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-sm text-blue-700 dark:text-blue-300">
                          💡 <strong>Tipp:</strong> Klicke auf das Video und dann auf das Bookmark-Icon, um eine Annotation hinzuzufügen
                        </div>
                      </div>
                    ) : (sortedAnnotations.map(annotation => (                      <div
                        key={annotation._id}
                        className={`border rounded-xl p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                          selectedAnnotation?._id === annotation._id
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg transform scale-[1.02]'
                            : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                        }`}
                        onClick={() => handleAnnotationClick(annotation)}
                      >                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <Badge variant={categoryColors[annotation.category]} size="sm">
                              {categoryLabels[annotation.category]}
                            </Badge>
                            <Badge variant="info" size="sm" className="font-mono">
                              {formatTime(annotation.timestamp)}
                            </Badge>
                          </div>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteAnnotation(annotation._id);
                            }}
                            className="p-1"
                            title="Annotation löschen"
                          >
                            <FaTrash size={12} />
                          </Button>
                        </div>
                        {annotation.playerId && (
                          <div className="flex items-center mb-3 p-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">
                              {annotation.playerId.jersey || '?'}
                            </div>
                            <div>
                              <div className="font-medium text-blue-900 dark:text-blue-100 text-sm">
                                {annotation.playerId.name}
                              </div>
                              {annotation.playerId.position && (
                                <div className="text-xs text-blue-700 dark:text-blue-300">
                                  {annotation.playerId.position}
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{annotation.title}</h4>
                          {annotation.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">
                            {annotation.description}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-600">
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            {new Date(annotation.createdAt).toLocaleString('de-DE')}
                          </p>
                          <div className="text-xs text-gray-400 dark:text-gray-500">
                            Klicken zum Springen
                          </div>
                        </div>
                      </div>                    ))
                  )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VideoDetail;
