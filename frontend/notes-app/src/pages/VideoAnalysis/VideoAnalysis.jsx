import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import { 
  PageHeader, 
  Card, 
  Button, 
  LoadingSpinner 
} from '../../components/UI/DesignSystem';
import { 
  FaVideo, 
  FaUpload, 
  FaPlay, 
  FaPause, 
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaCalendarDay,
  FaUsers,
  FaTags,
  FaChartLine
} from 'react-icons/fa';
import VideoPlayer from '../../components/VideoAnalysis/VideoPlayer';
import VideoUpload from '../../components/VideoAnalysis/VideoUpload';
import VideoList from '../../components/VideoAnalysis/VideoList';
import AnalysisModal from '../../components/VideoAnalysis/AnalysisModal';
import { 
  getVideos, 
  deleteVideo as deleteVideoAPI, 
  uploadVideo as uploadVideoAPI,
  updateVideo as updateVideoAPI,
  getVideoAnalytics 
} from '../../utils/videoService';

const VideoAnalysis = () => {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [analytics, setAnalytics] = useState(null);

  // State für Video-Bearbeitung
  const [editingVideo, setEditingVideo] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', description: '', category: '', tags: [] });

  const categories = [
    { id: 'all', label: 'Alle Videos', icon: FaVideo, color: 'gray' },
    { id: 'match', label: 'Spiele', icon: FaUsers, color: 'green' },
    { id: 'training', label: 'Training', icon: FaChartLine, color: 'blue' },
    { id: 'tactics', label: 'Taktik', icon: FaTags, color: 'purple' },
    { id: 'individual', label: 'Einzelanalyse', icon: FaEye, color: 'orange' }
  ];
  useEffect(() => {
    loadData();
  }, [activeCategory, searchTerm]);

  const loadData = async () => {
    try {      
      setLoading(true);
      console.log('Loading video data...');
      
      const [videosResponse, analyticsResponse] = await Promise.all([
        getVideos({ 
          category: activeCategory,
          search: searchTerm,
          limit: 50
        }),
        getVideoAnalytics()
      ]);      console.log('Videos Response:', videosResponse);
      console.log('Analytics Response:', analyticsResponse);

      setVideos(videosResponse.videos || []);
      setAnalytics(analyticsResponse.analytics || {});
      
      console.log('Video data loaded successfully');
    } catch (error) {
      console.error('Fehler beim Laden der Video-Daten:', error);
      // Fallback to empty data
      setVideos([]);
      setAnalytics({
        totalVideos: 0,
        totalViews: 0,
        totalSize: 0,
        totalDuration: 0,
        totalAnnotations: 0
      });
    } finally {
      setLoading(false);
    }
  };
  const handleVideoUpload = async (videoData) => {
    try {
      setLoading(true);
      console.log('Uploading video:', videoData);
      
      await uploadVideoAPI(videoData, (progress) => {
        console.log('Upload progress:', progress);
      });
      
      setShowUpload(false);
      await loadData(); // Reload data after upload
    } catch (error) {
      console.error('Fehler beim Upload:', error);
      alert('Fehler beim Video-Upload: ' + (error.message || 'Unbekannter Fehler'));
    } finally {
      setLoading(false);
    }
  };

  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
    setShowAnalysis(true);
  };
  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm('Video wirklich löschen?')) return;
    
    try {
      setLoading(true);
      console.log('Deleting video:', videoId);
      
      await deleteVideoAPI(videoId);
      await loadData(); // Reload data after deletion
    } catch (error) {
      console.error('Fehler beim Löschen:', error);
      alert('Fehler beim Löschen: ' + (error.message || 'Unbekannter Fehler'));
    } finally {
      setLoading(false);
    }
  };
  const filteredVideos = videos.filter(video => {
    const matchesCategory = activeCategory === 'all' || video.category === activeCategory;
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  // Video bearbeiten
  const handleEditVideo = (video) => {
    setEditingVideo(video);
    setEditForm({
      title: video.title,
      description: video.description || '',
      category: video.category,
      tags: video.tags || []
    });
  };

  const handleSaveEdit = async () => {
    if (!editingVideo) return;
    
    try {
      setLoading(true);
      await updateVideoAPI(editingVideo._id, editForm);
      await loadData(); // Reload data after update
      setEditingVideo(null);
      setEditForm({ title: '', description: '', category: '', tags: [] });
    } catch (error) {
      console.error('Fehler beim Bearbeiten:', error);
      alert('Fehler beim Bearbeiten: ' + (error.message || 'Unbekannter Fehler'));
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingVideo(null);
    setEditForm({ title: '', description: '', category: '', tags: [] });
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageHeader
        title="Videoanalyse"
        subtitle="Analysiere Spiele und Trainingseinheiten"
        icon={FaVideo}
        action={
          <Button
            variant="primary"
            icon={FaUpload}
            onClick={() => setShowUpload(true)}
          >
            Video hochladen
          </Button>
        }
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg mr-3">
              <FaVideo className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analytics?.totalVideos || 0}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Videos</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg mr-3">
              <FaUsers className="text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {videos.filter(v => v.category === 'match').length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Spiele</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg mr-3">
              <FaChartLine className="text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {videos.filter(v => v.category === 'training').length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Training</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg mr-3">
              <FaTags className="text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {analytics?.totalAnnotations || 0}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Annotationen</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filter and Search */}
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeCategory === category.id
                      ? `bg-${category.color}-100 dark:bg-${category.color}-900/20 text-${category.color}-700 dark:text-${category.color}-300`
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <Icon className="mr-2" size={14} />
                  {category.label}
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Videos suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-3 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </Card>

      {/* Video Grid */}      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map(video => (
          <Card key={video._id || video.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            {/* Thumbnail */}
            <div className="relative">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all flex items-center justify-center">
                <button
                  onClick={() => handleVideoSelect(video)}
                  className="opacity-0 hover:opacity-100 transition-opacity bg-white bg-opacity-90 rounded-full p-3 text-gray-900"
                >
                  <FaPlay size={20} />
                </button>
              </div>
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                {formatDuration(video.duration)}
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                {video.title}
              </h3>                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-3">
                <span className="flex items-center">
                  <FaCalendarDay className="mr-1" size={12} />
                  {video.uploadDate ? new Date(video.uploadDate).toLocaleDateString('de-DE') : 'Unbekannt'}
                </span>
                <span>{video.size}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center text-blue-600 dark:text-blue-400">
                  <FaTags className="mr-1" size={12} />
                  {video.annotations} Annotationen
                </span>
                  <div className="flex space-x-2">
                  <button
                    onClick={() => handleVideoSelect(video)}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                    title="Analysieren"
                  >
                    <FaEye size={14} />
                  </button>
                  <button
                    onClick={() => handleEditVideo(video)}
                    className="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-200"
                    title="Bearbeiten"
                  >
                    <FaEdit size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteVideo(video._id || video.id)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
                    title="Löschen"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredVideos.length === 0 && (
        <Card className="text-center py-12">
          <FaVideo className="mx-auto text-4xl text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Keine Videos gefunden
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {activeCategory === 'all' 
              ? 'Lade dein erstes Video hoch, um mit der Analyse zu beginnen.'
              : 'Keine Videos in dieser Kategorie gefunden.'
            }
          </p>
          <Button
            variant="primary"
            icon={FaUpload}
            onClick={() => setShowUpload(true)}
          >
            Video hochladen
          </Button>
        </Card>
      )}

      {/* Upload Modal */}
      {showUpload && (
        <VideoUpload
          onUpload={handleVideoUpload}
          onCancel={() => setShowUpload(false)}
        />
      )}

      {/* Analysis Modal */}
      {showAnalysis && selectedVideo && (
        <AnalysisModal
          video={selectedVideo}
          onClose={() => {
            setShowAnalysis(false);
            setSelectedVideo(null);
          }}
        />
      )}

      {/* Edit Modal */}
      {editingVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Video bearbeiten
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Titel
                </label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Video-Titel"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Beschreibung
                </label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Beschreibung (optional)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Kategorie
                </label>
                <select
                  value={editForm.category}
                  onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="training">Training</option>
                  <option value="match">Spiel</option>
                  <option value="tactics">Taktik</option>
                  <option value="individual">Einzelanalyse</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={handleCancelEdit}
                disabled={loading}
              >
                Abbrechen
              </Button>
              <Button
                onClick={handleSaveEdit}
                disabled={loading || !editForm.title.trim()}
              >
                {loading ? <LoadingSpinner size="small" /> : 'Speichern'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default VideoAnalysis;
