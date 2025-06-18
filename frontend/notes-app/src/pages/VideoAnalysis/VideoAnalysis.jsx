import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import { 
  PageHeader, 
  Card, 
  Button, 
  Badge,
  LoadingSpinner,
  EmptyState,
  StatsGrid,
  Input,
  Textarea,
  Select,
  FormGroup,
  Modal
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
import { 
  getVideos, 
  deleteVideo as deleteVideoAPI, 
  uploadVideo as uploadVideoAPI,
  updateVideo as updateVideoAPI,
  getVideoAnalytics 
} from '../../utils/videoService';

const VideoAnalysis = () => {
  const navigate = useNavigate();  const [videos, setVideos] = useState([]);  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
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
    navigate(`/video-analysis/${video._id}`);
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
      />      {/* Statistics Cards */}
      <StatsGrid stats={[
        {
          icon: FaVideo,
          value: analytics?.totalVideos || 0,
          label: 'Videos',
          change: null
        },
        {
          icon: FaUsers,
          value: videos.filter(v => v.category === 'match').length,
          label: 'Spiele',
          change: null
        },
        {
          icon: FaChartLine,
          value: videos.filter(v => v.category === 'training').length,
          label: 'Training',
          change: null
        },
        {
          icon: FaTags,
          value: analytics?.totalAnnotations || 0,
          label: 'Annotationen',
          change: null
        }
      ]} />

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
            </div>            {/* Content */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 flex-1">
                  {video.title}
                </h3>
                <Badge variant="info" size="sm" className="ml-2 shrink-0">
                  {categories.find(cat => cat.id === video.category)?.label || video.category}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-3">
                <span className="flex items-center">
                  <FaCalendarDay className="mr-1" size={12} />
                  {video.uploadDate ? new Date(video.uploadDate).toLocaleDateString('de-DE') : 'Unbekannt'}
                </span>
                <span>{video.size}</span>
              </div>              <div className="flex items-center justify-between text-sm">
                <Badge variant="success" size="sm">
                  <FaTags className="mr-1" size={10} />
                  {video.annotationCount || 0} Annotationen
                </Badge>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleVideoSelect(video)}
                    className="p-1"
                    title="Analysieren"
                  >
                    <FaEye size={14} />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleEditVideo(video)}
                    className="p-1"
                    title="Bearbeiten"
                  >
                    <FaEdit size={14} />
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDeleteVideo(video._id || video.id)}
                    className="p-1"
                    title="Löschen"
                  >
                    <FaTrash size={14} />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>      {/* Empty State */}
      {filteredVideos.length === 0 && (
        <EmptyState
          icon={FaVideo}
          title="Keine Videos gefunden"
          description={
            activeCategory === 'all' 
              ? 'Lade dein erstes Video hoch, um mit der Analyse zu beginnen.'
              : 'Keine Videos in dieser Kategorie gefunden.'
          }
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
      )}

      {/* Upload Modal */}
      {showUpload && (
        <VideoUpload
          onUpload={handleVideoUpload}
          onCancel={() => setShowUpload(false)}
        />      )}      {/* Edit Modal */}
      <Modal
        isOpen={!!editingVideo}
        onClose={handleCancelEdit}
        title="Video bearbeiten"
        size="default"
      >
        <FormGroup>
          <Input
            label="Titel"
            value={editForm.title}
            onChange={(e) => setEditForm({...editForm, title: e.target.value})}
            placeholder="Video-Titel"
            error={!editForm.title.trim() ? 'Titel ist erforderlich' : null}
          />

          <Textarea
            label="Beschreibung"
            value={editForm.description}
            onChange={(e) => setEditForm({...editForm, description: e.target.value})}
            placeholder="Beschreibung (optional)"
            rows={3}
          />

          <Select
            label="Kategorie"
            value={editForm.category}
            onChange={(e) => setEditForm({...editForm, category: e.target.value})}
            options={[
              { value: 'training', label: 'Training' },
              { value: 'match', label: 'Spiel' },
              { value: 'tactics', label: 'Taktik' },
              { value: 'individual', label: 'Einzelanalyse' }
            ]}
          />
        </FormGroup>

        <div className="flex justify-end space-x-3 mt-6">
          <Button
            variant="secondary"
            onClick={handleCancelEdit}
            disabled={loading}
          >
            Abbrechen
          </Button>
          <Button
            variant="primary"
            onClick={handleSaveEdit}
            disabled={loading || !editForm.title.trim()}
            loading={loading}
          >
            Speichern
          </Button>
        </div>
      </Modal>
    </Layout>
  );
};

export default VideoAnalysis;
