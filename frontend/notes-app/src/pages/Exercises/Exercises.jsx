import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import ExerciseCard from '../../components/Cards/ExerciseCard';
import { FaPlus, FaSearch, FaTimes, FaFilter, FaExclamation, FaListUl, FaThLarge, FaCalendarAlt, FaClipboardList, FaStar, FaDumbbell } from 'react-icons/fa';
import { MdOutlinePushPin, MdCategory } from 'react-icons/md';
import Modal from "react-modal";
import Layout from '../../components/Layout/Layout';
import AddEditExercise from './AddEditExercises';
import Toast from '../../components/ToastMessage/Toast';

// Import Design System Components
import {
  PageHeader,
  Card,
  Button,
  Badge,
  LoadingSpinner,
  EmptyState,
  StatsGrid
} from '../../components/UI/DesignSystem';

// Set app element for react-modal
Modal.setAppElement('#root');

// Kategorie-Farbmapping für bessere visuelle Unterscheidung
const categoryColors = {
  'Allgemein': { bg: 'bg-gray-100', text: 'text-gray-800', hover: 'hover:bg-gray-200', active: 'bg-gray-600' },
  'Technik': { bg: 'bg-blue-100', text: 'text-blue-800', hover: 'hover:bg-blue-200', active: 'bg-blue-600' },
  'Taktik': { bg: 'bg-indigo-100', text: 'text-indigo-800', hover: 'hover:bg-indigo-200', active: 'bg-indigo-600' },
  'Kondition': { bg: 'bg-red-100', text: 'text-red-800', hover: 'hover:bg-red-200', active: 'bg-red-600' },
  'Koordination': { bg: 'bg-orange-100', text: 'text-orange-800', hover: 'hover:bg-orange-200', active: 'bg-orange-600' },
  'Torwart': { bg: 'bg-yellow-100', text: 'text-yellow-800', hover: 'hover:bg-yellow-200', active: 'bg-yellow-600' },
  'Aufwärmen': { bg: 'bg-green-100', text: 'text-green-800', hover: 'hover:bg-green-200', active: 'bg-green-600' },
  'Abschluss': { bg: 'bg-teal-100', text: 'text-teal-800', hover: 'hover:bg-teal-200', active: 'bg-teal-600' },
  'Passspiel': { bg: 'bg-cyan-100', text: 'text-cyan-800', hover: 'hover:bg-cyan-200', active: 'bg-cyan-600' },
  'Verteidigung': { bg: 'bg-purple-100', text: 'text-purple-800', hover: 'hover:bg-purple-200', active: 'bg-purple-600' },
  'Angriff': { bg: 'bg-pink-100', text: 'text-pink-800', hover: 'hover:bg-pink-200', active: 'bg-pink-600' },
  'Standards': { bg: 'bg-rose-100', text: 'text-rose-800', hover: 'hover:bg-rose-200', active: 'bg-rose-600' },
  'Spielformen': { bg: 'bg-violet-100', text: 'text-violet-800', hover: 'hover:bg-violet-200', active: 'bg-violet-600' }
};

// Kategorie-Emoji-Mapping
const categoryEmojis = {
  'Allgemein': '📋', 'Technik': '⚽', 'Taktik': '🧠', 'Kondition': '💪', 'Koordination': '🤸',
  'Torwart': '🥅', 'Aufwärmen': '🏃', 'Abschluss': '🎯', 'Passspiel': '👥', 'Verteidigung': '🛡️',
  'Angriff': '⚡', 'Standards': '📐', 'Spielformen': '🎮'
};

const Exercises = () => {
  const [allExercises, setAllExercises] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' oder 'list'
  const exercisesPerPage = 12;
  const navigate = useNavigate();

  // Toast state
  const [toast, setToast] = useState({
    isShown: false,
    message: '',
    type: 'success'
  });
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [exerciseData, setExerciseData] = useState(null);
  
  // Filter state
  const [activeFilter, setActiveFilter] = useState('all');
  
  // Category grouping state
  const [groupByCategory, setGroupByCategory] = useState(false);
  
  // Kategorien mit Übungen
  const [availableCategories, setAvailableCategories] = useState([]);

  // Trainingsplan State
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [showTrainingPlanModal, setShowTrainingPlanModal] = useState(false);
  const [trainingPlanName, setTrainingPlanName] = useState('');
  const [trainingPlanDescription, setTrainingPlanDescription] = useState('');
  const [savedTrainingPlans, setSavedTrainingPlans] = useState([]);
  
  // Favoriten
  const [favoriteExercises, setFavoriteExercises] = useState([]);

  // Get all exercises
  const getAllExercises = async () => {
    console.log('=== getAllExercises called ===');
    try {
      setLoading(true);
      const response = await axiosInstance.get("/get-all-exercises");
      console.log('getAllExercises response:', response.data);
      
      if (response.data && response.data.exercises) {
        console.log('Setting exercises:', response.data.exercises);
        setAllExercises(response.data.exercises);
        setError(null);
      } else {
        console.log('No exercises found in response');
        setAllExercises([]);
      }
    } catch (error) {
      console.error("Detailed error:", error.response || error);
      if (error.response?.status === 401) {
        setError("Sie sind nicht authentifiziert. Bitte loggen Sie sich ein.");
        // Redirect to login if needed
        // navigate('/login');
      } else if (error.response?.status === 404) {
        setError("Exercise-Endpunkt nicht gefunden. Bitte kontaktieren Sie den Administrator.");
      } else {
        setError("Fehler beim Laden der Übungen. Bitte versuchen Sie es später erneut.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Search exercises
  const onSearchExercise = async (query) => {
    if (!query.trim()) {
      setIsSearch(false);
      getAllExercises();
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.get("/search-exercises", {
        params: { query },
      });
      if (response.data && response.data.exercises) {
        setIsSearch(true);
        setAllExercises(response.data.exercises);
      }
    } catch (error) {
      console.error("Search error:", error.response || error);
      if (error.response?.status === 401) {
        setError("Sie sind nicht authentifiziert. Bitte loggen Sie sich ein.");
      } else if (error.response?.status === 404) {
        setError("Such-Endpunkt nicht gefunden. Bitte kontaktieren Sie den Administrator.");
      } else {
        setError("Fehler bei der Suche. Bitte versuchen Sie es später erneut.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Toggle exercise selection for training plan
  const toggleExerciseSelection = (exerciseId) => {
    if (selectedExercises.includes(exerciseId)) {
      setSelectedExercises(selectedExercises.filter(id => id !== exerciseId));
    } else {
      setSelectedExercises([...selectedExercises, exerciseId]);
    }
  };

  // Save training plan
  const saveTrainingPlan = () => {
    if (trainingPlanName.trim() === '') {
      showToast('Bitte geben Sie einen Namen für den Trainingsplan ein', 'error');
      return;
    }
    
    if (selectedExercises.length === 0) {
      showToast('Bitte wählen Sie mindestens eine Übung aus', 'error');
      return;
    }

    const newPlan = {
      id: Date.now().toString(),
      name: trainingPlanName,
      description: trainingPlanDescription,
      exercises: selectedExercises,
      date: new Date().toISOString(),
    };

    // In Produktion würde dies mit einer API gespeichert werden
    const updatedPlans = [...savedTrainingPlans, newPlan];
    setSavedTrainingPlans(updatedPlans);
    
    // Speichern im localStorage für Persistenz
    localStorage.setItem('trainingPlans', JSON.stringify(updatedPlans));
    
    // Reset state
    setTrainingPlanName('');
    setTrainingPlanDescription('');
    setSelectedExercises([]);
    setShowTrainingPlanModal(false);
    
    showToast('Trainingsplan erfolgreich gespeichert!', 'success');
  };

  // Load saved training plans from localStorage
  useEffect(() => {
    const savedPlans = localStorage.getItem('trainingPlans');
    if (savedPlans) {
      setSavedTrainingPlans(JSON.parse(savedPlans));
    }
    
    const savedFavorites = localStorage.getItem('favoriteExercises');
    if (savedFavorites) {
      setFavoriteExercises(JSON.parse(savedFavorites));
    }
  }, []);

  // Toggle favorite status
  const toggleFavorite = (exerciseId) => {
    let updatedFavorites;
    
    if (favoriteExercises.includes(exerciseId)) {
      updatedFavorites = favoriteExercises.filter(id => id !== exerciseId);
    } else {
      updatedFavorites = [...favoriteExercises, exerciseId];
    }
    
    setFavoriteExercises(updatedFavorites);
    localStorage.setItem('favoriteExercises', JSON.stringify(updatedFavorites));
    showToast(
      favoriteExercises.includes(exerciseId) 
        ? 'Übung aus Favoriten entfernt' 
        : 'Übung zu Favoriten hinzugefügt', 
      'success'
    );
  };

  // Filtered exercises including favorites
  const filteredExercises = useMemo(() => {
    let filtered = allExercises;
    
    switch (activeFilter) {
      case 'pinned':
        filtered = allExercises.filter(ex => ex.isPinned);
        break;
      case 'recent':
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        filtered = allExercises.filter(ex => new Date(ex.date) >= oneWeekAgo);
        break;
      case 'tagged':
        filtered = allExercises.filter(ex => ex.tags && ex.tags.length > 0);
        break;
      case 'favorites':
        filtered = allExercises.filter(ex => favoriteExercises.includes(ex._id));
        break;
      default:
        // Check if it's a category filter
        if (activeFilter !== 'all') {
          filtered = allExercises.filter(ex => ex.category === activeFilter);
        } else {
          filtered = allExercises;
        }
    }
    
    return filtered.sort((a, b) => {
      // Priorisiere Favoriten
      const aIsFavorite = favoriteExercises.includes(a._id);
      const bIsFavorite = favoriteExercises.includes(b._id);
      
      if (aIsFavorite && !bIsFavorite) return -1;
      if (!aIsFavorite && bIsFavorite) return 1;
      
      // Dann priorisiere angepinnte Übungen
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      
      // Dann nach Datum sortieren
      return new Date(b.date) - new Date(a.date);
    });
  }, [allExercises, activeFilter, favoriteExercises]);

  // Pagination with filtering
  const indexOfLastExercise = currentPage * exercisesPerPage;
  const indexOfFirstExercise = indexOfLastExercise - exercisesPerPage;
  const currentExercises = filteredExercises.slice(indexOfFirstExercise, indexOfLastExercise);
  const totalPages = Math.ceil(filteredExercises.length / exercisesPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Modal Handling
  const openModal = (type, data = null) => {
    setModalType(type);
    setExerciseData(data);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setExerciseData(null);
  };

  // Show toast function
  const showToast = (message, type = 'success') => {
    setToast({
      isShown: true,
      message,
      type
    });
  };

  // Close toast function
  const closeToast = () => {
    setToast({
      isShown: false,
      message: '',
      type: 'success'
    });
  };

  // Delete exercise
  const deleteExercise = async (exerciseId) => {
    try {
      const response = await axiosInstance.delete(`/delete-exercise/${exerciseId}`);
      
      if (response.data && response.data.success) {
        showToast('Übung erfolgreich gelöscht!', 'success');
        getAllExercises(); // Refresh the list
      } else {
        showToast('Fehler beim Löschen der Übung.', 'error');
      }
    } catch (error) {
      console.error("Delete error:", error);
      showToast('Fehler beim Löschen der Übung.', 'error');
    }
  };

  // Pin/Unpin exercise
  const updateExercisePinned = async (exerciseId, isPinned) => {
    try {
      const response = await axiosInstance.put(`/update-exercise-pinned/${exerciseId}`, {
        isPinned: !isPinned
      });

      if (response.data && response.data.exercise) {
        const updatedExercises = allExercises.map(exercise =>
          exercise._id === exerciseId 
            ? { ...exercise, isPinned: !isPinned }
            : exercise
        );
        setAllExercises(updatedExercises);
        showToast(
          !isPinned ? 'Übung angepinnt!' : 'Übung losgelöst!', 
          'success'
        );
      }
    } catch (error) {
      console.error("Pin update error:", error);
      showToast('Fehler beim Aktualisieren der Pinnwand.', 'error');
    }
  };

  // Export exercises to JSON
  const exportExercises = () => {
    try {
      const dataStr = JSON.stringify(allExercises, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `exercises_${new Date().toISOString().split('T')[0]}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      showToast('Übungen exportiert!', 'success');
    } catch (error) {
      console.error('Export error:', error);
      showToast('Fehler beim Exportieren.', 'error');
    }
  };

  useEffect(() => {
    getAllExercises();
  }, []);

  useEffect(() => {
    // Reset to first page when filter changes
    setCurrentPage(1);
  }, [activeFilter]);

  // Update the categories list whenever exercises change
  useEffect(() => {
    if (allExercises.length > 0) {
      const categories = [...new Set(allExercises.map(ex => ex.category))];
      setAvailableCategories(categories);
    }
  }, [allExercises]);

  // Gruppieren der Übungen nach Kategorien
  const exercisesByCategory = useMemo(() => {
    if (!groupByCategory) return null;
    
    // Create an object with categories as keys
    const grouped = {};
    
    // First process pinned exercises regardless of category if we're not filtering by a specific category
    if (activeFilter === 'all' || activeFilter === 'pinned') {
      const pinnedExercises = filteredExercises.filter(ex => ex.isPinned);
      if (pinnedExercises.length > 0) {
        grouped['Gepinnt'] = pinnedExercises;
      }
    }
    
    // Then process by categories
    filteredExercises.forEach(exercise => {
      // Skip pinned exercises if we already grouped them separately
      if (activeFilter === 'all' && exercise.isPinned && grouped['Gepinnt']) {
        return;
      }
      
      if (!grouped[exercise.category]) {
        grouped[exercise.category] = [];
      }
      grouped[exercise.category].push(exercise);
    });
    
    return grouped;
  }, [filteredExercises, groupByCategory, activeFilter]);
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-6">
        {/* Page Header */}
        <PageHeader
          title="Übungen"
          subtitle="Verwalten Sie Ihre Trainingsübungen und erstellen Sie Trainingspläne"
          icon={FaDumbbell}
          action={
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  if (selectedExercises.length === 0) {
                    showToast('Bitte wählen Sie zuerst Übungen aus', 'info');
                  } else {
                    setShowTrainingPlanModal(true);
                  }
                }}
                variant={selectedExercises.length > 0 ? "success" : "secondary"}
                icon={FaCalendarAlt}
                disabled={loading}
              >
                {selectedExercises.length > 0 ? `Plan erstellen (${selectedExercises.length})` : 'Trainingsplan'}
              </Button>
              
              <Button
                onClick={exportExercises}
                variant="secondary"
                icon={FaClipboardList}
                disabled={loading || allExercises.length === 0}
              >
                Export
              </Button>
              
              <Button
                onClick={() => openModal('add')}
                variant="primary"
                icon={FaPlus}
                disabled={loading}
              >
                Neue Übung
              </Button>
            </div>
          }
        >
          {/* View Mode Toggle */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center bg-white rounded-lg p-1 shadow-sm">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                title="Grid-Ansicht"
              >
                <FaThLarge size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                title="Listen-Ansicht"
              >
                <FaListUl size={16} />
              </button>
              <button
                onClick={() => setGroupByCategory(!groupByCategory)}
                className={`p-2 rounded transition-colors ${
                  groupByCategory 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                title={groupByCategory ? "Gruppierung aufheben" : "Nach Kategorien gruppieren"}
              >
                <MdCategory size={18} />
              </button>
            </div>
            
            {/* Exercise Statistics */}
            <div className="text-sm text-gray-600">
              {filteredExercises.length} {filteredExercises.length === 1 ? 'Übung' : 'Übungen'}
              {selectedExercises.length > 0 && (
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                  {selectedExercises.length} ausgewählt
                </span>
              )}
            </div>
          </div>
        </PageHeader>

        {/* Error Display */}
        {error && (
          <Card className="border-red-200 bg-red-50 mb-6">
            <div className="flex items-center text-red-700">
              <FaExclamation className="mr-2" />
              {error}
            </div>
          </Card>
        )}

        {/* Loading State */}
        {loading && <LoadingSpinner text="Lade Übungen..." />}

        {/* Exercise Statistics Grid */}
        {!loading && allExercises.length > 0 && (
          <div className="mb-6">
            <StatsGrid
              stats={[
                {
                  icon: FaDumbbell,
                  value: allExercises.length,
                  label: 'Gesamt Übungen'
                },
                {
                  icon: MdCategory,
                  value: availableCategories.length,
                  label: 'Kategorien'
                },
                {
                  icon: FaStar,
                  value: favoriteExercises.length,
                  label: 'Favoriten'
                },
                {
                  icon: FaCalendarAlt,
                  value: savedTrainingPlans.length,
                  label: 'Trainingspläne'
                }
              ]}
            />
          </div>
        )}        {/* Search and Filters */}
        <Card className="mb-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Übungen durchsuchen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && onSearchExercise(searchQuery)}
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setIsSearch(false);
                    getAllExercises();
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FaTimes />
                </button>
              )}
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-gray-500 mr-2">Filter:</span>
              
              {/* Basic Filters */}
              <Badge
                variant={activeFilter === 'all' ? 'primary' : 'secondary'}
                onClick={() => setActiveFilter('all')}
                className="cursor-pointer"
              >
                Alle ({allExercises.length})
              </Badge>
              
              <Badge
                variant={activeFilter === 'pinned' ? 'warning' : 'secondary'}
                onClick={() => setActiveFilter('pinned')}
                className="cursor-pointer"
              >
                📌 Gepinnt ({allExercises.filter(ex => ex.isPinned).length})
              </Badge>
              
              <Badge
                variant={activeFilter === 'favorites' ? 'info' : 'secondary'}
                onClick={() => setActiveFilter('favorites')}
                className="cursor-pointer"
              >
                ⭐ Favoriten ({favoriteExercises.length})
              </Badge>
              
              <Badge
                variant={activeFilter === 'recent' ? 'success' : 'secondary'}
                onClick={() => setActiveFilter('recent')}
                className="cursor-pointer"
              >
                🆕 Diese Woche ({allExercises.filter(ex => {
                  const exerciseDate = new Date(ex.date);
                  const oneWeekAgo = new Date();
                  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                  return exerciseDate >= oneWeekAgo;
                }).length})
              </Badge>
              
              <Badge
                variant={activeFilter === 'tagged' ? 'primary' : 'secondary'}
                onClick={() => setActiveFilter('tagged')}
                className="cursor-pointer"
              >
                🏷️ Mit Tags ({allExercises.filter(ex => ex.tags && ex.tags.length > 0).length})
              </Badge>
              
              {/* Category Filters */}
              {availableCategories.map(category => {
                const categoryCount = allExercises.filter(ex => ex.category === category).length;
                
                return (
                  <Badge
                    key={category}
                    variant={activeFilter === category ? 'primary' : 'secondary'}
                    onClick={() => setActiveFilter(category)}
                    className="cursor-pointer flex items-center space-x-1"
                  >
                    <span>{categoryEmojis[category]}</span>
                    <span>{category} ({categoryCount})</span>
                  </Badge>
                );
              })}
            </div>
          </div>
        </Card>        {/* Selected Exercises Bar */}
        {selectedExercises.length > 0 && (
          <Card className="mb-6 bg-blue-50 border-blue-200">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Badge variant="info" className="mr-3">
                  {selectedExercises.length} {selectedExercises.length === 1 ? 'Übung' : 'Übungen'} ausgewählt
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedExercises([])}
                >
                  Auswahl zurücksetzen
                </Button>
              </div>
              <Button
                variant="success"
                size="sm"
                onClick={() => setShowTrainingPlanModal(true)}
                icon={FaCalendarAlt}
              >
                Als Trainingsplan speichern
              </Button>
            </div>
          </Card>
        )}

        {/* Exercises Display - Either grouped by category or flat list */}
        {!loading && currentExercises.length > 0 ? (
          <>
            {groupByCategory && exercisesByCategory ? (
              // Grouped by category view
              <div className="space-y-8">
                {Object.keys(exercisesByCategory).map(category => (
                  <Card key={category}>
                    <div className="flex items-center mb-4">
                      <div className={`p-2 rounded-lg mr-3 ${
                        category === 'Gepinnt' 
                          ? 'bg-yellow-100'
                          : categoryColors[category]?.bg || 'bg-gray-100'
                      }`}>
                        {category === 'Gepinnt'
                          ? <MdOutlinePushPin className="text-yellow-600" size={20} />
                          : <span className="text-xl">{categoryEmojis[category] || '📋'}</span>
                        }
                      </div>
                      <h2 className="text-xl font-semibold text-gray-800">
                        {category} ({exercisesByCategory[category].length})
                      </h2>
                    </div>
                    <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'} gap-6`}>
                      {exercisesByCategory[category].map(exercise => (
                        <ExerciseCard
                          key={exercise._id}
                          exerciseData={exercise}
                          onEdit={() => openModal('edit', exercise)}
                          onDelete={() => {
                            if(window.confirm('Möchten Sie diese Übung wirklich löschen?')) {
                              deleteExercise(exercise._id);
                            }
                          }}
                          onPinExercise={() => updateExercisePinned(exercise._id, exercise.isPinned)}
                          viewMode={viewMode}
                          isSelected={selectedExercises.includes(exercise._id)}
                          onToggleSelect={() => toggleExerciseSelection(exercise._id)}
                          isFavorite={favoriteExercises.includes(exercise._id)}
                          onToggleFavorite={() => toggleFavorite(exercise._id)}
                        />
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              // Regular view (not grouped)
              <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'} gap-6`}>
                {currentExercises.map((exercise) => (
                  <ExerciseCard
                    key={exercise._id}
                    exerciseData={exercise}
                    onEdit={() => openModal('edit', exercise)}
                    onDelete={() => {
                      if(window.confirm('Möchten Sie diese Übung wirklich löschen?')) {
                        deleteExercise(exercise._id);
                      }
                    }}
                    onPinExercise={() => updateExercisePinned(exercise._id, exercise.isPinned)}
                    viewMode={viewMode}
                    isSelected={selectedExercises.includes(exercise._id)}
                    onToggleSelect={() => toggleExerciseSelection(exercise._id)}
                    isFavorite={favoriteExercises.includes(exercise._id)}
                    onToggleFavorite={() => toggleFavorite(exercise._id)}
                  />
                ))}
              </div>
            )}
          </>
        ) : !loading && (
          <EmptyState
            icon={FaSearch}
            title="Keine Übungen gefunden"
            description={
              activeFilter === 'all' 
                ? "Erstellen Sie Ihre erste Übung, um zu beginnen."
                : "Versuchen Sie Ihre Suche anzupassen oder fügen Sie neue Übungen hinzu."
            }
            action={
              <Button
                variant="primary"
                icon={FaPlus}
                onClick={() => openModal('add')}
              >
                Neue Übung erstellen
              </Button>
            }
          />
        )}        {/* Pagination */}
        {!groupByCategory && allExercises.length > exercisesPerPage && (
          <div className="flex justify-center items-center mt-8 space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={prevPage}
              disabled={currentPage === 1}
            >
              Vorherige
            </Button>
            <span className="px-4 py-2 text-sm text-gray-700">
              Seite {currentPage} von {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={nextPage}
              disabled={currentPage === totalPages}
            >
              Nächste
            </Button>
          </div>
        )}

        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          style={{
            overlay: {
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              zIndex: 1000,
            },
            content: {
              top: '50%',
              left: '50%',
              right: 'auto',
              bottom: 'auto',
              marginRight: '-50%',
              transform: 'translate(-50%, -50%)',
              border: 'none',
              borderRadius: '12px',
              padding: '0',
              width: '90%',
              maxWidth: '600px',
              maxHeight: '90vh',
              overflow: 'auto',
            },
          }}
        >
          <AddEditExercise
            exerciseData={exerciseData}
            type={modalType}
            onClose={closeModal}
            getAllExercises={getAllExercises}
            showToast={showToast}
          />
        </Modal>        {/* Trainingsplan Modal */}
        <Modal
          isOpen={showTrainingPlanModal}
          onRequestClose={() => setShowTrainingPlanModal(false)}
          style={{
            overlay: {
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              zIndex: 1000,
            },
            content: {
              top: '50%',
              left: '50%',
              right: 'auto',
              bottom: 'auto',
              marginRight: '-50%',
              transform: 'translate(-50%, -50%)',
              border: 'none',
              borderRadius: '12px',
              padding: '0',
              width: '90%',
              maxWidth: '600px',
              maxHeight: '90vh',
              overflow: 'auto',
            },
          }}
        >
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Trainingsplan erstellen</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTrainingPlanModal(false)}
                icon={FaTimes}
              />
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name des Trainingsplans</label>
                <input
                  type="text"
                  value={trainingPlanName}
                  onChange={(e) => setTrainingPlanName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="z.B. Passspiel-Training Jugend U17"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Beschreibung (optional)</label>
                <textarea
                  value={trainingPlanDescription}
                  onChange={(e) => setTrainingPlanDescription(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[100px]"
                  placeholder="Beschreiben Sie den Zweck oder die Ziele dieses Trainingsplans"
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ausgewählte Übungen ({selectedExercises.length})</label>
                <div className="border border-gray-200 rounded-lg p-3 max-h-[200px] overflow-y-auto">
                  {selectedExercises.length > 0 ? (
                    <div className="space-y-2">
                      {selectedExercises.map(id => {
                        const exercise = allExercises.find(ex => ex._id === id);
                        return exercise ? (
                          <div key={id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div>
                              <span className="font-medium">{exercise.title}</span>
                              <Badge variant="secondary" className="ml-2">{exercise.category}</Badge>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleExerciseSelection(id)}
                              icon={FaTimes}
                            />
                          </div>
                        ) : null;
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-2">Keine Übungen ausgewählt</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowTrainingPlanModal(false)}
              >
                Abbrechen
              </Button>
              <Button
                variant="primary"
                onClick={saveTrainingPlan}
                disabled={trainingPlanName.trim() === '' || selectedExercises.length === 0}
              >
                Trainingsplan speichern
              </Button>
            </div>
          </Card>
        </Modal>
        
        {/* Saved Training Plans Modal - würde in einer vollständigen Implementierung hinzugefügt werden */}

        {/* Toast */}
        <Toast
          isShown={toast.isShown}
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />
      </div>
    </Layout>
  );
};

export default Exercises;
