  import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import ExerciseCard from '../../components/Cards/ExerciseCard';
import { FaPlus, FaSearch, FaTimes, FaFilter, FaExclamation, FaListUl, FaThLarge, FaCalendarAlt, FaClipboardList, FaStar } from 'react-icons/fa';
import { MdOutlinePushPin, MdCategory } from 'react-icons/md';
import Modal from "react-modal";
import Layout from '../../components/Layout/Layout';
import AddEditExercise from './AddEditExercises';
import Toast from '../../components/ToastMessage/Toast';

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
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        {/* Header section with view toggles */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Übungsverwaltung</h1>
          <div className="flex gap-2">
            <div className="flex items-center bg-gray-100 rounded-lg p-1 mr-3">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                title="Grid-Ansicht"
              >
                <FaThLarge size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                title="Listen-Ansicht"
              >
                <FaListUl size={16} />
              </button>
              <button
                onClick={() => setGroupByCategory(!groupByCategory)}
                className={`p-2 rounded ${groupByCategory ? 'bg-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                title={groupByCategory ? "Gruppierung aufheben" : "Nach Kategorien gruppieren"}
              >
                <MdCategory size={18} />
              </button>
            </div>
            
            {/* Trainingsplan-Button */}
            <button
              onClick={() => {
                if (selectedExercises.length === 0) {
                  showToast('Bitte wählen Sie zuerst Übungen aus, indem Sie auf die Sternchen klicken', 'info');
                } else {
                  setShowTrainingPlanModal(true);
                }
              }}
              className={`px-4 py-2 text-white font-medium rounded-lg transition-colors flex items-center gap-2 ${
                selectedExercises.length > 0 ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
              }`}
              title="Trainingsplan erstellen"
            >
              <FaCalendarAlt />
              {selectedExercises.length > 0 ? `Plan erstellen (${selectedExercises.length})` : 'Trainingsplan'}
            </button>
            
            <button
              onClick={exportExercises}
              className="px-4 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
              disabled={loading || allExercises.length === 0}
            >
              <FaClipboardList /> Export
            </button>
            <button
              onClick={() => openModal('add')}
              className="px-4 py-2 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
              disabled={loading}
            >
              <FaPlus /> Übung hinzufügen
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 flex items-center">
            <FaExclamation className="mr-2" />
            {error}
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex justify-center items-center my-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            <span className="ml-3 text-gray-700">Lädt Übungen...</span>
          </div>
        )}

        {/* Statistics */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-full">
                  <FaFilter className="text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-500">Gesamt</p>
                  <p className="text-lg font-semibold">{allExercises.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="bg-yellow-100 p-3 rounded-full">
                  <MdOutlinePushPin className="text-yellow-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-500">Gepinnt</p>
                  <p className="text-lg font-semibold">{allExercises.filter(ex => ex.isPinned).length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-full">
                  <FaSearch className="text-green-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-500">Mit Tags</p>
                  <p className="text-lg font-semibold">{allExercises.filter(ex => ex.tags && ex.tags.length > 0).length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <div className="bg-purple-100 p-3 rounded-full">
                  <FaPlus className="text-purple-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-500">Diese Woche</p>
                  <p className="text-lg font-semibold">
                    {allExercises.filter(ex => {
                      const exerciseDate = new Date(ex.date);
                      const oneWeekAgo = new Date();
                      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                      return exerciseDate >= oneWeekAgo;
                    }).length}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Additional Category Statistics Row */}
            <div className="bg-white p-4 rounded-lg shadow-sm border md:col-span-4">
              <div className="flex items-center mb-3">
                <div className="bg-indigo-100 p-3 rounded-full">
                  <FaFilter className="text-indigo-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-500">Kategorien-Verteilung</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {(() => {
                  const categories = ['Allgemein', 'Technik', 'Taktik', 'Kondition', 'Koordination', 'Torwart', 'Aufwärmen', 'Abschluss', 'Passspiel', 'Verteidigung', 'Angriff', 'Standards', 'Spielformen'];
                  
                  return categories.map(category => {
                    const count = allExercises.filter(ex => ex.category === category).length;
                    if (count === 0) return null;
                    return (
                      <span key={category} className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                        {categoryEmojis[category]} {category}: {count}
                      </span>
                    );
                  }).filter(Boolean);
                })()}
              </div>
            </div>
          </div>
        )}

        {/* Search and Filter */}
        <div className="bg-white shadow-sm rounded-xl p-4 mb-8">
          <div className="flex items-center border-b border-gray-200 pb-4 mb-4">
            <FaSearch className="text-gray-400 mr-3" />
            <input
              type="text"
              placeholder="Übung suchen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full focus:outline-none text-gray-700"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onSearchExercise(searchQuery);
                }
              }}
            />
            {searchQuery && (
              <button 
                onClick={() => {
                  setSearchQuery('');
                  onSearchExercise('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes />
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-500 mr-2">Filter:</span>
            <button 
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                activeFilter === 'all' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              Alle ({allExercises.length})
            </button>
            <button 
              onClick={() => setActiveFilter('pinned')}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                activeFilter === 'pinned' 
                  ? 'bg-yellow-500 text-white' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              📌 Gepinnt ({allExercises.filter(ex => ex.isPinned).length})
            </button>
            <button 
              onClick={() => setActiveFilter('recent')}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                activeFilter === 'recent' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              🆕 Diese Woche ({allExercises.filter(ex => {
                const exerciseDate = new Date(ex.date);
                const oneWeekAgo = new Date();
                oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                return exerciseDate >= oneWeekAgo;
              }).length})
            </button>
            <button 
              onClick={() => setActiveFilter('tagged')}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                activeFilter === 'tagged' 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              🏷️ Mit Tags ({allExercises.filter(ex => ex.tags && ex.tags.length > 0).length})
            </button>
            
            {/* Favoriten Filter Button */}
            <button 
              onClick={() => setActiveFilter('favorites')}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                activeFilter === 'favorites' 
                  ? 'bg-amber-500 text-white' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              ⭐ Favoriten ({allExercises.filter(ex => favoriteExercises.includes(ex._id)).length})
            </button>
            
            {/* Dynamic Category Filter Buttons */}
            {(() => {
              const categories = [
                'Allgemein', 'Technik', 'Taktik', 'Kondition', 'Koordination', 
                'Torwart', 'Aufwärmen', 'Abschluss', 'Passspiel', 'Verteidigung', 
                'Angriff', 'Standards', 'Spielformen'
              ];
              
              // Get categories that actually have exercises
              const categoriesWithExercises = categories.filter(category => 
                allExercises.some(ex => ex.category === category)
              );
              
              return categoriesWithExercises.map(category => {
                const count = allExercises.filter(ex => ex.category === category).length;
                const colors = categoryColors[category] || { bg: 'bg-gray-100', text: 'text-gray-800', hover: 'hover:bg-gray-200' };
                return (
                  <button
                    key={category}
                    onClick={() => setActiveFilter(category)}
                    className={`px-3 py-1 text-xs rounded-full transition-colors ${
                      activeFilter === category
                        ? 'bg-indigo-500 text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {categoryEmojis[category]} {category} ({count})
                  </button>
                );
              });
            })()}
          </div>
        </div>

        {/* Exercises Display - Either grouped by category or flat list */}
        {!loading && currentExercises.length > 0 ? (
          <>
            {/* Selected Exercises Bar */}
            {selectedExercises.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 flex justify-between items-center">
                <div className="flex items-center">
                  <span className="text-blue-700 font-medium mr-2">
                    {selectedExercises.length} {selectedExercises.length === 1 ? 'Übung' : 'Übungen'} ausgewählt
                  </span>
                  <button 
                    onClick={() => setSelectedExercises([])}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Auswahl zurücksetzen
                  </button>
                </div>
                <button
                  onClick={() => setShowTrainingPlanModal(true)}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                >
                  Als Trainingsplan speichern
                </button>
              </div>
            )}
            
            {groupByCategory && exercisesByCategory ? (
              // Grouped by category view
              <div className="space-y-8">
                {Object.keys(exercisesByCategory).map(category => (
                  <div key={category} className="bg-white rounded-xl shadow-sm p-4">
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
                      <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'} gap-6`}>                      {exercisesByCategory[category].map(exercise => (
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
                  </div>
                ))}
              </div>            ) : (
              // Regular view (not grouped)
              <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'} gap-6`}>                {currentExercises.map((exercise) => (
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
          <div className="bg-white rounded-xl p-10 flex flex-col items-center justify-center shadow-sm mt-6">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FaSearch className="text-gray-400" size={24} />
            </div>
            <h3 className="text-xl font-medium text-gray-700">Keine Übungen gefunden</h3>
            <p className="text-gray-500 text-center mt-2">
              Versuchen Sie Ihre Suche anzupassen oder fügen Sie neue Übungen hinzu.
            </p>
          </div>
        )}

        {/* Pagination */}
        {allExercises.length > exercisesPerPage && (
          <div className="flex justify-center items-center mt-8 space-x-2">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Vorherige
            </button>
            <span className="px-4 py-2 text-sm text-gray-700">
              Seite {currentPage} von {totalPages}
            </span>
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Nächste
            </button>
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
        </Modal>

        {/* Trainingsplan Modal */}
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
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Trainingsplan erstellen</h2>
              <button
                onClick={() => setShowTrainingPlanModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full"
              >
                <FaTimes />
              </button>
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
                    <ul className="space-y-2">
                      {selectedExercises.map(id => {
                        const exercise = allExercises.find(ex => ex._id === id);
                        return exercise ? (
                          <li key={id} className="flex items-center justify-between">
                            <div>
                              <span className="font-medium">{exercise.title}</span>
                              <span className="text-xs text-gray-500 ml-2">{exercise.category}</span>
                            </div>
                            <button
                              onClick={() => toggleExerciseSelection(id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <FaTimes size={14} />
                            </button>
                          </li>
                        ) : null;
                      })}
                    </ul>
                  ) : (
                    <p className="text-gray-500 text-center py-2">Keine Übungen ausgewählt</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowTrainingPlanModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Abbrechen
              </button>
              <button
                onClick={saveTrainingPlan}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                disabled={trainingPlanName.trim() === '' || selectedExercises.length === 0}
              >
                Trainingsplan speichern
              </button>
            </div>
          </div>
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
