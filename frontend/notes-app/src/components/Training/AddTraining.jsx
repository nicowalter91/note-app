import React, { useState, useEffect } from 'react';
import TrainingTemplates from './TrainingTemplates';
import { 
    FaTimes, 
    FaDumbbell, 
    FaCalendarAlt, 
    FaClock, 
    FaMapMarkerAlt, 
    FaUsers,
    FaClipboardList,
    FaPlus,
    FaTrash
} from 'react-icons/fa';
import { HiCalendar, HiClock, HiLocationMarker } from 'react-icons/hi';
import axiosInstance from '../../utils/axiosInstance';

const AddTraining = ({ isOpen, onClose, onTrainingAdded }) => {
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        time: '',
        duration: 90,
        location: '',
        description: '',
        exercises: [],
        playerAttendance: []
    });
    const [availableExercises, setAvailableExercises] = useState([]);    const [availablePlayers, setAvailablePlayers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [currentStep, setCurrentStep] = useState(1); // 1: Template, 2: Details
    const [selectedTemplate, setSelectedTemplate] = useState(null);

    useEffect(() => {
        if (isOpen) {
            fetchExercises();
            fetchPlayers();
        }
    }, [isOpen]);

    const fetchExercises = async () => {
        try {
            const response = await axiosInstance.get('/get-all-exercises');
            setAvailableExercises(response.data.exercises || []);
        } catch (err) {
            console.error('Fehler beim Laden der Übungen:', err);
        }
    };

    const fetchPlayers = async () => {
        try {
            const response = await axiosInstance.get('/players');
            setAvailablePlayers(response.data.players || []);
        } catch (err) {
            console.error('Fehler beim Laden der Spieler:', err);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const addExercise = (exercise) => {
        if (!formData.exercises.find(ex => ex.exerciseId === exercise._id)) {
            setFormData(prev => ({
                ...prev,
                exercises: [...prev.exercises, {
                    exerciseId: exercise._id,
                    title: exercise.title,
                    duration: 15,
                    sets: 1,
                    notes: ''
                }]
            }));
        }
    };

    const removeExercise = (exerciseId) => {
        setFormData(prev => ({
            ...prev,
            exercises: prev.exercises.filter(ex => ex.exerciseId !== exerciseId)
        }));
    };

    const updateExerciseDetails = (exerciseId, field, value) => {
        setFormData(prev => ({
            ...prev,
            exercises: prev.exercises.map(ex => 
                ex.exerciseId === exerciseId 
                    ? { ...ex, [field]: value }
                    : ex
            )
        }));
    };

    const togglePlayerAttendance = (playerId) => {
        setFormData(prev => {
            const isSelected = prev.playerAttendance.some(p => p.playerId === playerId);
            if (isSelected) {
                return {
                    ...prev,
                    playerAttendance: prev.playerAttendance.filter(p => p.playerId !== playerId)
                };
            } else {
                return {
                    ...prev,
                    playerAttendance: [...prev.playerAttendance, {
                        playerId: playerId,
                        status: 'expected',
                        notes: ''
                    }]
                };
            }        });
    };

    const handleTemplateSelect = (template) => {
        setSelectedTemplate(template);
        if (template.id !== 'custom') {
            setFormData(prev => ({
                ...prev,
                title: template.title,
                duration: template.duration,
                exercises: template.exercises.map(ex => ({
                    exerciseId: `template_${ex.title}`,
                    title: ex.title,
                    duration: ex.duration,
                    sets: 1,
                    notes: ex.category
                }))
            }));
        }
    };

    const nextStep = () => {
        if (currentStep === 1 && !selectedTemplate) {
            setError('Bitte wählen Sie eine Trainingsvorlage aus.');
            return;
        }
        setError('');
        setCurrentStep(currentStep + 1);
    };

    const prevStep = () => {
        setCurrentStep(currentStep - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!formData.title || !formData.date || !formData.time) {
            setError('Bitte füllen Sie alle Pflichtfelder aus.');
            setLoading(false);
            return;
        }

        try {
            const trainingData = {
                title: formData.title,
                type: 'training',
                date: formData.date,
                time: formData.time,
                duration: formData.duration,
                location: formData.location,
                description: formData.description,
                trainingData: {
                    exercises: formData.exercises,
                    focus: formData.focus || 'Allgemein',
                    intensity: formData.intensity || 'medium'
                },
                playerAttendance: formData.playerAttendance
            };

            await axiosInstance.post('/add-event', trainingData);
              // Reset form
            setFormData({
                title: '',
                date: '',
                time: '',
                duration: 90,
                location: '',
                description: '',
                exercises: [],
                playerAttendance: []
            });
            setCurrentStep(1);
            setSelectedTemplate(null);
            
            onTrainingAdded();
            onClose();
        } catch (err) {
            console.error('Fehler beim Erstellen des Trainings:', err);
            setError('Fehler beim Erstellen des Trainings. Bitte versuchen Sie es erneut.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                            <FaDumbbell className="text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                                {currentStep === 1 ? 'Trainingsvorlage wählen' : 'Training konfigurieren'}
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Schritt {currentStep} von 2
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                        <FaTimes className="text-gray-600 dark:text-gray-300" />
                    </button>
                </div>                {/* Step 1: Template Selection */}
                {currentStep === 1 && (
                    <>
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                                {error}
                            </div>
                        )}
                        <TrainingTemplates onSelectTemplate={handleTemplateSelect} />
                        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            >
                                Abbrechen
                            </button>
                            <button
                                type="button"
                                onClick={nextStep}
                                className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center space-x-2"
                            >
                                <span>Weiter</span>
                                <FaPlus className="rotate-90" />
                            </button>
                        </div>
                    </>
                )}

                {/* Step 2: Training Details */}
                {currentStep === 2 && (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                                {error}
                            </div>
                        )}

                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Trainingstitel *
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                placeholder="z.B. Konditionstraining, Taktik-Schulung..."
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Datum *
                            </label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Uhrzeit *
                            </label>
                            <input
                                type="time"
                                name="time"
                                value={formData.time}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Dauer (Minuten)
                            </label>
                            <input
                                type="number"
                                name="duration"
                                value={formData.duration}
                                onChange={handleInputChange}
                                min="15"
                                max="180"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Trainingsort
                            </label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                placeholder="z.B. Hauptplatz, Sporthalle..."
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Beschreibung
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                placeholder="Zusätzliche Informationen zum Training..."
                            />
                        </div>
                    </div>

                    {/* Exercises Section */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                            <FaClipboardList className="text-green-500 mr-2" />
                            Übungen hinzufügen
                        </h3>
                        
                        {/* Available Exercises */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Verfügbare Übungen
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-40 overflow-y-auto">
                                {availableExercises.map(exercise => (
                                    <button
                                        key={exercise._id}
                                        type="button"
                                        onClick={() => addExercise(exercise)}
                                        className="text-left p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                        disabled={formData.exercises.some(ex => ex.exerciseId === exercise._id)}
                                    >
                                        <p className="font-medium text-gray-800 dark:text-white text-sm">{exercise.title}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{exercise.category}</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Selected Exercises */}
                        {formData.exercises.length > 0 && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Ausgewählte Übungen ({formData.exercises.length})
                                </label>
                                <div className="space-y-3">
                                    {formData.exercises.map(exercise => (
                                        <div key={exercise.exerciseId} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-medium text-gray-800 dark:text-white">{exercise.title}</h4>
                                                <button
                                                    type="button"
                                                    onClick={() => removeExercise(exercise.exerciseId)}
                                                    className="text-red-500 hover:text-red-700 transition-colors"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                                                        Dauer (Min)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={exercise.duration}
                                                        onChange={(e) => updateExerciseDetails(exercise.exerciseId, 'duration', parseInt(e.target.value))}
                                                        min="5"
                                                        max="60"
                                                        className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                                                        Sätze/Runden
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={exercise.sets}
                                                        onChange={(e) => updateExerciseDetails(exercise.exerciseId, 'sets', parseInt(e.target.value))}
                                                        min="1"
                                                        max="10"
                                                        className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Players Section */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                            <FaUsers className="text-blue-500 mr-2" />
                            Spieler einladen
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-40 overflow-y-auto">
                            {availablePlayers.map(player => (
                                <label
                                    key={player._id}
                                    className="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        checked={formData.playerAttendance.some(p => p.playerId === player._id)}
                                        onChange={() => togglePlayerAttendance(player._id)}
                                        className="mr-3 text-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <div>
                                        <p className="font-medium text-gray-800 dark:text-white text-sm">{player.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {player.position} • #{player.jerseyNumber}
                                        </p>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>                        {/* Submit Buttons */}
                        <div className="flex justify-between space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <button
                                type="button"
                                onClick={prevStep}
                                className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2"
                            >
                                <FaPlus className="rotate-180" />
                                <span>Zurück</span>
                            </button>
                            <div className="flex space-x-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Abbrechen
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-2 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white rounded-lg transition-colors flex items-center space-x-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            <span>Erstelle...</span>
                                        </>
                                    ) : (
                                        <>
                                            <FaPlus />
                                            <span>Training erstellen</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default AddTraining;
