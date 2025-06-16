import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import ExerciseCard from '../../components/Cards/ExerciseCard';
import { FaPlus, FaSearch, FaTimes, FaFilter, FaExclamation } from 'react-icons/fa';
import { MdOutlinePushPin } from 'react-icons/md';
import Modal from "react-modal";
import Layout from '../../components/Layout/Layout';
import AddEditExercise from './AddEditExercises';
import Toast from '../../components/ToastMessage/Toast';

// Set app element for react-modal
Modal.setAppElement('#root');

// Force reload to fix import issue

const Exercises = () => {
  const [allExercises, setAllExercises] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  // Filter exercises based on active filter with useMemo for performance
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
      default:
        // Check if it's a category filter
        if (activeFilter !== 'all') {
          filtered = allExercises.filter(ex => ex.category === activeFilter);
        } else {
          filtered = allExercises;
        }
    }
    
    return filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.date) - new Date(a.date);
    });
  }, [allExercises, activeFilter]);

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

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        {/* Header section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Übungsverwaltung</h1>
          <div className="flex gap-2">
            <button
              onClick={exportExercises}
              className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              disabled={loading || allExercises.length === 0}
            >
              📄 Export
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
                  const categoryEmojis = {
                    'Allgemein': '📋', 'Technik': '⚽', 'Taktik': '🧠', 'Kondition': '💪', 'Koordination': '🤸',
                    'Torwart': '🥅', 'Aufwärmen': '🏃', 'Abschluss': '🎯', 'Passspiel': '👥', 'Verteidigung': '🛡️',
                    'Angriff': '⚡', 'Standards': '📐', 'Spielformen': '🎮'
                  };
                  
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
              
              const categoryEmojis = {
                'Allgemein': '📋',
                'Technik': '⚽',
                'Taktik': '🧠',
                'Kondition': '💪',
                'Koordination': '🤸',
                'Torwart': '🥅',
                'Aufwärmen': '🏃',
                'Abschluss': '🎯',
                'Passspiel': '👥',
                'Verteidigung': '🛡️',
                'Angriff': '⚡',
                'Standards': '📐',
                'Spielformen': '🎮'
              };
              
              return categoriesWithExercises.map(category => {
                const count = allExercises.filter(ex => ex.category === category).length;
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

        {/* Exercises Grid */}
        {!loading && currentExercises.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
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
              />
            ))}
          </div>
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
