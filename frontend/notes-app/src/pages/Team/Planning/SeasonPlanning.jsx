import React, { useState, useEffect } from 'react';
import Layout from '../../../components/Layout/Layout';
import Modal from 'react-modal';
import { getAllPlayers } from '../../../utils/playerService';
import axiosInstance from '../../../utils/axiosInstance';
import AddEditExercise from '../../Exercises/AddEditExercises';
import TrainingSpecificFields from './TrainingSpecificFields';
import * as eventService from '../../../utils/eventService';
import { 
  FaCalendarAlt, 
  FaPlus, 
  FaChevronLeft, 
  FaChevronRight,
  FaFilter,
  FaBullseye,
  FaRunning,
  FaUsers,
  FaList,
  FaTh,
  FaCalendarWeek,
  FaTimes,
  FaSave,
  FaEdit,
  FaTrash,
  FaClock,
  FaMapMarkerAlt,
  FaFootballBall,
  FaFlag,
  FaHome,
  FaPlane,
  FaArrowUp,  FaArrowDown,
  FaUserCheck,
  FaUserTimes,
  FaUserClock,
  FaSearch,
  FaExternalLinkAlt
} from 'react-icons/fa';
import { MdSports, MdEvent, MdFitnessCenter } from 'react-icons/md';

// Set the app element for React Modal to prevent warnings
Modal.setAppElement('#root');

const SeasonPlanning = () => {
  // State Management
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // 'month', 'week', 'season'
  const [selectedFilter, setSelectedFilter] = useState('all'); // 'all', 'games', 'training', 'events'
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'game', 'training', 'event'
  const [editingEvent, setEditingEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [availableExercises, setAvailableExercises] = useState([]);
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [exerciseSearchQuery, setExerciseSearchQuery] = useState('');
  const [loadingExercises, setLoadingExercises] = useState(false);
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [playerAttendance, setPlayerAttendance] = useState({});
  const [trainingExercises, setTrainingExercises] = useState([]);
  const [isRecurringTraining, setIsRecurringTraining] = useState(false);
  const [recurrencePattern, setRecurrencePattern] = useState({
    startDate: '',
    endDate: '',
    daysOfWeek: [],
    frequency: 1
  });

  // Load events from database
  const loadEvents = async (filters = {}) => {
    try {
      setLoading(true);
      const response = await eventService.getAllEvents(filters);
      console.log('Loaded events:', response);
      
      if (response && response.events) {
        // Format events for frontend use
        const formattedEvents = response.events.map(event => eventService.formatEventFromAPI(event));
        setEvents(formattedEvents);
      } else {
        setEvents([]);
      }
    } catch (error) {
      console.error('Error loading events:', error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  // Load exercises from database
  const loadExercises = async () => {
    try {
      setLoadingExercises(true);
      const response = await axiosInstance.get("/get-all-exercises");
      console.log('Loaded exercises:', response.data);
      
      if (response.data && response.data.exercises) {
        // Map API exercises to our format
        const mappedExercises = response.data.exercises.map(exercise => ({
          id: exercise._id,
          _id: exercise._id,
          title: exercise.title,
          category: exercise.category || 'Allgemein',
          defaultDuration: 15, // Default duration in minutes
          ageGroup: exercise.ageGroup || 'alle',
          difficulty: exercise.difficulty || 'medium',
          playersNeeded: exercise.playersNeeded || 8,
          fieldSize: exercise.fieldSize || '20x20',
          focusAreas: exercise.tags || [exercise.category || 'Allgemein'],
          equipment: exercise.equipment || 'Bälle',
          goalkeepersNeeded: exercise.goalkeepersNeeded || false,
          description: exercise.organisation || exercise.durchfuehrung || 'Keine Beschreibung verfügbar',
          organisation: exercise.organisation,
          durchfuehrung: exercise.durchfuehrung,
          coaching: exercise.coaching,
          variante: exercise.variante,
          tags: exercise.tags,
          image: exercise.image
        }));
        setAvailableExercises(mappedExercises);
      } else {
        setAvailableExercises([]);
      }
    } catch (error) {
      console.error('Error loading exercises:', error);
      setAvailableExercises([]);
    } finally {
      setLoadingExercises(false);
    }
  };

  // Load players from database
  const loadPlayers = async () => {
    try {
      const players = await getAllPlayers();
      console.log('Loaded players:', players);
      setAvailablePlayers(players);
      
      // Initialize player attendance
      const initialAttendance = {};
      players.forEach(player => {
        initialAttendance[player._id] = 'unknown';
      });
      setPlayerAttendance(initialAttendance);
    } catch (error) {
      console.error('Error loading players:', error);
      setAvailablePlayers([]);
    }
  };

  // Initialize data on component mount
  useEffect(() => {
    loadEvents();
    loadExercises();
    loadPlayers();
  }, []);

  // Handle different modal types
  const openModal = (type, selectedDate = null) => {
    setModalType(type);
    setEditingEvent(null);
    setTrainingExercises([]);
    
    // Reset player attendance for new events
    if (availablePlayers.length > 0) {
      const initialAttendance = {};
      availablePlayers.forEach(player => {
        initialAttendance[player._id] = 'unknown';
      });
      setPlayerAttendance(initialAttendance);
    }
    setShowAddModal(true);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setModalType('');
    setEditingEvent(null);
    setTrainingExercises([]);
    setIsRecurringTraining(false);
    setRecurrencePattern({
      startDate: '',
      endDate: '',
      daysOfWeek: [],
      frequency: 1
    });
    // Reset player attendance
    const initialAttendance = {};
    availablePlayers.forEach(player => {
      initialAttendance[player._id] = 'unknown';
    });
    setPlayerAttendance(initialAttendance);
  };

  const saveEvent = async (formData, type, gameData, trainingData, eventData) => {
    try {
      setLoading(true);
      
      // Check if this is a recurring training
      if (type === 'training' && isRecurringTraining && !editingEvent) {
        // Handle recurring training creation
        const recurringData = {
          title: formData.title,
          time: formData.time,
          duration: formData.duration,
          location: formData.location,
          description: formData.description,
          trainingData: trainingData,
          playerAttendance: Object.entries(playerAttendance).map(([playerId, status]) => ({
            playerId,
            status
          })),
          recurrencePattern: recurrencePattern
        };
        
        const response = await eventService.addRecurringTraining(recurringData);
        
        if (response && !response.error) {
          console.log('Recurring training created successfully:', response);
          alert(`${response.count} Trainingstermine erfolgreich erstellt!`);
          await loadEvents();
          closeModal();
        } else {
          console.error('Error creating recurring training:', response);
          alert('Fehler beim Erstellen der Trainingsserie: ' + (response?.message || 'Unbekannter Fehler'));
        }
      } else {
        // Handle single event creation/update
        const apiEventData = eventService.formatEventForAPI(
          formData, 
          type, 
          gameData, 
          trainingData, 
          eventData, 
          playerAttendance
        );
        
        let response;
        if (editingEvent) {
          // Update existing event
          response = await eventService.editEvent(editingEvent._id || editingEvent.id, apiEventData);
        } else {
          // Add new event
          response = await eventService.addEvent(apiEventData);
        }
        
        if (response && !response.error) {
          console.log('Event saved successfully:', response);
          // Reload events to get updated data
          await loadEvents();
          closeModal();
        } else {
          console.error('Error saving event:', response);
          alert('Fehler beim Speichern des Events: ' + (response?.message || 'Unbekannter Fehler'));
        }
      }
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Fehler beim Speichern des Events: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (eventId) => {
    if (window.confirm('Sind Sie sicher, dass Sie diese Aktivität löschen möchten?')) {
      try {
        setLoading(true);
        const response = await eventService.deleteEvent(eventId);
        
        if (response && !response.error) {
          console.log('Event deleted successfully');
          // Reload events to get updated data
          await loadEvents();
        } else {
          console.error('Error deleting event:', response);
          alert('Fehler beim Löschen des Events: ' + (response?.message || 'Unbekannter Fehler'));
        }
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Fehler beim Löschen des Events: ' + (error.response?.data?.message || error.message));
      } finally {
        setLoading(false);
      }
    }
  };

  // Edit event handler
  const editEvent = (event) => {
    setEditingEvent(event);
    setModalType(event.type);
    
    // Set training exercises if this is a training event
    if (event.type === 'training' && event.trainingData && event.trainingData.exercises) {
      setTrainingExercises(event.trainingData.exercises.map(ex => ({
        id: ex.exerciseId || ex.id || Date.now().toString(),
        exerciseId: ex.exerciseId || ex.id,
        title: ex.title,
        category: ex.category,
        duration: ex.duration,
        order: ex.order || 0
      })));
    }
    
    // Set player attendance if available
    if (event.playerAttendance && Array.isArray(event.playerAttendance)) {
      const attendanceMap = {};
      event.playerAttendance.forEach(attendance => {
        attendanceMap[attendance.playerId] = attendance.status;
      });
      setPlayerAttendance(attendanceMap);
    }
    
    setShowAddModal(true);
  };

  // Kalender Navigation
  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const navigateWeek = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction * 7));
    setCurrentDate(newDate);
  };

  // Event Type Colors
  const getEventTypeColor = (type) => {
    switch(type) {
      case 'game': return 'bg-green-100 border-green-300 text-green-800';
      case 'training': return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'event': return 'bg-purple-100 border-purple-300 text-purple-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  // Filter events based on current filter
  const filteredEvents = events.filter(event => {
    if (selectedFilter === 'all') return true;
    return event.type === selectedFilter;
  });

  // Get events for current period (month or week)
  const getCurrentPeriodEvents = () => {
    const start = new Date(currentDate);
    const end = new Date(currentDate);
    
    if (viewMode === 'month') {
      start.setDate(1);
      end.setMonth(end.getMonth() + 1);
      end.setDate(0);
    } else if (viewMode === 'week') {
      const dayOfWeek = start.getDay();
      const startOfWeek = start.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
      start.setDate(startOfWeek);
      end.setDate(start.getDate() + 6);
    }
    
    return filteredEvents.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= start && eventDate <= end;
    });
  };

  const currentPeriodEvents = getCurrentPeriodEvents();

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => viewMode === 'week' ? navigateWeek(-1) : navigateMonth(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaChevronLeft />
              </button>
              
              <div className="text-lg font-semibold text-gray-800 min-w-[200px] text-center">
                {viewMode === 'week' ? (
                  `Woche vom ${currentDate.toLocaleDateString('de-DE')}`
                ) : viewMode === 'month' ? (
                  currentDate.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })
                ) : (
                  'Saison 2024/2025'
                )}
              </div>
              
              <button
                onClick={() => viewMode === 'week' ? navigateWeek(1) : navigateMonth(1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaChevronRight />
              </button>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-500" />
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Alle Aktivitäten</option>
                <option value="games">Spiele</option>
                <option value="training">Training</option>
                <option value="events">Events</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Spiele dieser {viewMode === 'week' ? 'Woche' : 'Monat'}</p>
                <p className="text-2xl font-bold text-green-600">
                  {currentPeriodEvents.filter(e => e.type === 'game').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <MdSports className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Trainings</p>
                <p className="text-2xl font-bold text-blue-600">
                  {currentPeriodEvents.filter(e => e.type === 'training').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <MdFitnessCenter className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Events</p>
                <p className="text-2xl font-bold text-purple-600">
                  {currentPeriodEvents.filter(e => e.type === 'event').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <MdEvent className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Gesamt</p>
                <p className="text-2xl font-bold text-gray-800">
                  {currentPeriodEvents.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <FaCalendarAlt className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <WeekView 
            events={currentPeriodEvents}
            currentDate={currentDate}
            onEditEvent={editEvent}
            onDeleteEvent={deleteEvent}
            getEventTypeColor={getEventTypeColor}
          />
        </div>

        {/* Floating Action Buttons */}
        <div className="fixed bottom-6 right-6 flex flex-col gap-3">
          <button 
            onClick={() => openModal('game')}
            className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-lg transition-colors"
            title="Neues Spiel"
          >
            <MdSports className="w-6 h-6" />
          </button>
          <button 
            onClick={() => openModal('training')}
            className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-colors"
            title="Neues Training"
          >
            <MdFitnessCenter className="w-6 h-6" />
          </button>
          <button 
            onClick={() => openModal('event')}
            className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full shadow-lg transition-colors"
            title="Neues Event"
          >
            <MdEvent className="w-6 h-6" />
          </button>
        </div>

        {/* Add/Edit Modal */}
        {showAddModal && !showExerciseModal && (
          <ActivityModal
            type={modalType}
            event={editingEvent}
            availableExercises={availableExercises}
            availablePlayers={availablePlayers}
            playerAttendance={playerAttendance}
            setPlayerAttendance={setPlayerAttendance}
            trainingExercises={trainingExercises}
            setTrainingExercises={setTrainingExercises}
            loading={loading}
            onSave={saveEvent}
            onClose={closeModal}
            exerciseSearchQuery={exerciseSearchQuery}
            setExerciseSearchQuery={setExerciseSearchQuery}
            loadingExercises={loadingExercises}
            setShowExerciseModal={setShowExerciseModal}
            isRecurringTraining={isRecurringTraining}
            setIsRecurringTraining={setIsRecurringTraining}
            recurrencePattern={recurrencePattern}
            setRecurrencePattern={setRecurrencePattern}
          />
        )}

        {/* Exercise Creation Modal */}
        {showExerciseModal && (
          <ExerciseCreationModal 
            isOpen={showExerciseModal}
            onClose={() => setShowExerciseModal(false)}
            loadExercises={loadExercises}
          />
        )}
      </div>
    </Layout>
  );
};

// Week View Component
const WeekView = ({ events, currentDate, onEditEvent, onDeleteEvent, getEventTypeColor }) => {
  // Get start of week (Monday)
  const startOfWeek = new Date(currentDate);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
  startOfWeek.setDate(diff);

  // Generate week days
  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    weekDays.push(date);
  }

  // Group events by date
  const eventsByDate = {};
  events.forEach(event => {
    const eventDate = new Date(event.date).toDateString();
    if (!eventsByDate[eventDate]) {
      eventsByDate[eventDate] = [];
    }
    eventsByDate[eventDate].push(event);
  });

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Wochenübersicht</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
        {weekDays.map(date => {
          const dateString = date.toDateString();
          const dayEvents = eventsByDate[dateString] || [];
          const isToday = date.toDateString() === new Date().toDateString();
          
          return (
            <div key={dateString} className={`bg-gray-50 rounded-lg p-4 min-h-[200px] ${isToday ? 'ring-2 ring-blue-500' : ''}`}>
              <div className="text-center mb-3">
                <div className="text-sm text-gray-500">
                  {date.toLocaleDateString('de-DE', { weekday: 'short' })}
                </div>
                <div className={`text-lg font-semibold ${isToday ? 'text-blue-600' : 'text-gray-800'}`}>
                  {date.getDate()}
                </div>
              </div>
              
              <div className="space-y-2">
                {dayEvents.length > 0 ? dayEvents.map(event => (
                  <div
                    key={event._id || event.id}
                    className={`p-2 rounded border cursor-pointer group hover:shadow-md transition-shadow ${getEventTypeColor(event.type)}`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{event.title}</p>
                        <p className="text-xs opacity-75">{event.time}</p>
                        {event.type === 'game' && event.gameData && (
                          <p className="text-xs opacity-75">
                            {event.gameData.isHome ? '🏠 vs.' : '✈️ @'} {event.gameData.opponent}
                          </p>
                        )}
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 ml-2">
                        <button
                          onClick={() => onEditEvent(event)}
                          className="text-blue-500 hover:text-blue-700 p-1"
                        >
                          <FaEdit size={12} />
                        </button>
                        <button
                          onClick={() => onDeleteEvent(event._id || event.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="text-center text-gray-400 text-sm py-8">
                    Keine Termine
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Activity Modal Component
const ActivityModal = ({
  type, 
  event,
  availableExercises, 
  availablePlayers,
  playerAttendance,
  setPlayerAttendance,
  trainingExercises,
  setTrainingExercises,
  loading,
  onSave, 
  onClose,
  exerciseSearchQuery,
  setExerciseSearchQuery,
  loadingExercises,
  setShowExerciseModal,
  isRecurringTraining,
  setIsRecurringTraining,
  recurrencePattern,
  setRecurrencePattern
}) => {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    duration: 90,
    location: '',
    description: '',
    ...event
  });

  const [gameData, setGameData] = useState({
    opponent: '',
    isHome: true,
    competition: '',
    importance: 'medium',
    preparation: {
      arrival: '',
      warmup: '',
      briefing: ''
    },
    ...event?.gameData
  });

  const [trainingData, setTrainingData] = useState({
    intensity: 'medium',
    weatherConditions: 'outdoor',
    participants: [],
    ageGroup: 'U17+',
    difficulty: 'medium',
    focusAreas: [],
    requiredEquipment: '',
    goalkeepersNeeded: false,
    coachingNotes: '',
    trainingObjectives: '',
    ...event?.trainingData
  });

  const [eventData, setEventData] = useState({
    attendees: [],
    ...event?.eventData
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate recurring training if selected
    if (type === 'training' && isRecurringTraining && !event) {
      if (!recurrencePattern.startDate || !recurrencePattern.endDate) {
        alert('Bitte geben Sie Start- und Enddatum für die Trainingsserie ein.');
        return;
      }
      
      if (recurrencePattern.daysOfWeek.length === 0) {
        alert('Bitte wählen Sie mindestens einen Trainingstag aus.');
        return;
      }
      
      if (new Date(recurrencePattern.startDate) >= new Date(recurrencePattern.endDate)) {
        alert('Das Enddatum muss nach dem Startdatum liegen.');
        return;
      }
    }
    
    // Add training exercises to trainingData if this is a training
    const finalTrainingData = type === 'training' ? {
      ...trainingData,
      exercises: trainingExercises.map(ex => ({
        exerciseId: ex.exerciseId || ex.id,
        title: ex.title,
        category: ex.category,
        duration: ex.duration,
        order: ex.order || trainingExercises.indexOf(ex)
      }))
    } : trainingData;
    
    // Call onSave with all the necessary parameters
    onSave(formData, type, gameData, finalTrainingData, eventData);
  };

  const getModalTitle = () => {
    if (event) {
      return type === 'game' ? 'Spiel bearbeiten' : 
             type === 'training' ? 'Training bearbeiten' : 'Event bearbeiten';
    }
    if (type === 'training' && isRecurringTraining) {
      return 'Trainingsserie erstellen';
    }
    return type === 'game' ? 'Neues Spiel' : 
           type === 'training' ? 'Neues Training' : 'Neues Event';
  };

  return (
    <Modal
      isOpen={true}
      onRequestClose={onClose}
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
          maxWidth: '800px',
          maxHeight: '90vh',
          overflow: 'auto',
        },
      }}
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            {type === 'game' ? <MdSports className="text-green-600" /> :
             type === 'training' ? <MdFitnessCenter className="text-blue-600" /> :
             <MdEvent className="text-purple-600" />}
            {getModalTitle()}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FaTimes className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titel *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ort *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Datum * {type === 'training' && isRecurringTraining && '(wird automatisch gesetzt)'}
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                required={!(type === 'training' && isRecurringTraining)}
                disabled={type === 'training' && isRecurringTraining}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Uhrzeit *
              </label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({...formData, time: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dauer (Min.)
              </label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="15"
                step="15"
              />
            </div>
          </div>

          {/* Game-specific fields */}
          {type === 'game' && (
            <GameSpecificFields gameData={gameData} setGameData={setGameData} />
          )}

          {/* Training-specific fields */}
          {type === 'training' && (
            <TrainingSpecificFields 
              trainingData={trainingData} 
              setTrainingData={setTrainingData}
              availableExercises={availableExercises}
              availablePlayers={availablePlayers}
              playerAttendance={playerAttendance}
              setPlayerAttendance={setPlayerAttendance}
              trainingExercises={trainingExercises}
              setTrainingExercises={setTrainingExercises}
              loading={loading}
              exerciseSearchQuery={exerciseSearchQuery}
              setExerciseSearchQuery={setExerciseSearchQuery}
              loadingExercises={loadingExercises}
              setShowExerciseModal={setShowExerciseModal}
              isRecurringTraining={isRecurringTraining}
              setIsRecurringTraining={setIsRecurringTraining}
              recurrencePattern={recurrencePattern}
              setRecurrencePattern={setRecurrencePattern}
            />
          )}

          {/* Event-specific fields */}
          {type === 'event' && (
            <EventSpecificFields eventData={eventData} setEventData={setEventData} />
          )}

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Beschreibung / Notizen
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Zusätzliche Informationen..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className={`px-6 py-2 text-white rounded-lg transition-colors flex items-center gap-2 ${
                type === 'game' ? 'bg-green-600 hover:bg-green-700' :
                type === 'training' ? 'bg-blue-600 hover:bg-blue-700' :
                'bg-purple-600 hover:bg-purple-700'
              }`}
            >
              <FaSave />
              {event ? 'Aktualisieren' : 
               (type === 'training' && isRecurringTraining) ? 'Trainingsserie erstellen' : 'Erstellen'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

// Game-specific fields component
const GameSpecificFields = ({ gameData, setGameData }) => (
  <div className="bg-green-50 p-4 rounded-lg space-y-4">
    <h3 className="font-semibold text-green-800 flex items-center gap-2">
      <FaFootballBall /> Spiel-Details
    </h3>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Gegner *
        </label>
        <input
          type="text"
          value={gameData.opponent}
          onChange={(e) => setGameData({...gameData, opponent: e.target.value})}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="z.B. FC Beispiel"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Spielort
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setGameData({...gameData, isHome: true})}
            className={`flex-1 p-3 rounded-lg border transition-colors flex items-center justify-center gap-2 ${
              gameData.isHome 
                ? 'bg-green-100 border-green-300 text-green-800' 
                : 'border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FaHome /> Heimspiel
          </button>
          <button
            type="button"
            onClick={() => setGameData({...gameData, isHome: false})}
            className={`flex-1 p-3 rounded-lg border transition-colors flex items-center justify-center gap-2 ${
              !gameData.isHome 
                ? 'bg-green-100 border-green-300 text-green-800' 
                : 'border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FaPlane /> Auswärtsspiel
          </button>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Wettbewerb
        </label>
        <select
          value={gameData.competition}
          onChange={(e) => setGameData({...gameData, competition: e.target.value})}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="">Wettbewerb wählen</option>
          <option value="Liga">Liga</option>
          <option value="Pokal">Pokal</option>
          <option value="Freundschaftsspiel">Freundschaftsspiel</option>
          <option value="Turnier">Turnier</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Wichtigkeit
        </label>
        <select
          value={gameData.importance}
          onChange={(e) => setGameData({...gameData, importance: e.target.value})}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="low">Niedrig</option>
          <option value="medium">Mittel</option>
          <option value="high">Hoch</option>
          <option value="critical">Kritisch</option>
        </select>
      </div>
    </div>

    {/* Game Preparation Schedule */}
    <div>
      <h4 className="font-medium text-gray-700 mb-3">Spielvorbereitung</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Ankunft</label>
          <input
            type="time"
            value={gameData.preparation?.arrival || ''}
            onChange={(e) => setGameData({
              ...gameData, 
              preparation: {...gameData.preparation, arrival: e.target.value}
            })}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Aufwärmen</label>
          <input
            type="time"
            value={gameData.preparation?.warmup || ''}
            onChange={(e) => setGameData({
              ...gameData, 
              preparation: {...gameData.preparation, warmup: e.target.value}
            })}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Besprechung</label>
          <input
            type="time"
            value={gameData.preparation?.briefing || ''}
            onChange={(e) => setGameData({
              ...gameData, 
              preparation: {...gameData.preparation, briefing: e.target.value}
            })}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-green-500"
          />
        </div>
      </div>
    </div>
  </div>
);

// Event-specific fields component
const EventSpecificFields = ({ eventData, setEventData }) => (
  <div className="bg-purple-50 p-4 rounded-lg space-y-4">
    <h3 className="font-semibold text-purple-800 flex items-center gap-2">
      <MdEvent /> Event-Details
    </h3>
    
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Teilnehmer
      </label>
      <input
        type="text"
        value={eventData.attendees?.join(', ') || ''}
        onChange={(e) => setEventData({
          ...eventData, 
          attendees: e.target.value.split(',').map(a => a.trim()).filter(a => a)
        })}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        placeholder="Alle Spieler, Trainer, Eltern (komma-getrennt)"
      />
    </div>
  </div>
);

// Exercise Creation/Edit Modal
const ExerciseCreationModal = ({ 
  isOpen, 
  onClose, 
  loadExercises 
}) => {
  const [showToastMessage, setShowToastMessage] = useState(null);

  const handleExerciseCreated = async () => {
    // Reload exercises after creating a new one
    await loadExercises();
    onClose();
    setShowToastMessage({
      type: 'success',
      message: 'Übung erfolgreich erstellt!'
    });
    
    // Hide toast after 3 seconds
    setTimeout(() => {
      setShowToastMessage(null);
    }, 3000);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        className="fixed inset-0 flex items-center justify-center p-4 z-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-40"
      >
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-800">Neue Übung erstellen</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FaTimes className="text-gray-500" />
            </button>
          </div>
          <div className="p-6">
            <AddEditExercise 
              isQuickAdd={true}
              onExerciseCreated={handleExerciseCreated}
            />
          </div>
        </div>
      </Modal>

      {/* Toast Message */}
      {showToastMessage && (
        <div className="fixed top-4 right-4 z-50">
          <div className={`px-6 py-3 rounded-lg shadow-lg ${
            showToastMessage.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          }`}>
            {showToastMessage.message}
          </div>
        </div>
      )}
    </>
  );
};

export default SeasonPlanning;
