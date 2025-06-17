import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../../../components/Layout/Layout';
import { PageHeader, Card, Button, Badge, LoadingSpinner } from '../../../components/UI/DesignSystem';
import { 
    FaDumbbell, 
    FaPlus, 
    FaClock, 
    FaUsers, 
    FaClipboardList,
    FaPlay,
    FaCheckCircle,
    FaArrowLeft,
    FaEdit,
    FaTrash,
    FaSave,
    FaFlag,
    FaTimes,
    FaImage,
    FaUpload,
    FaSearch,
    FaFilter
} from 'react-icons/fa';
import axiosInstance from '../../../utils/axiosInstance';

const TrainingPlan = () => {
    const navigate = useNavigate();
    const { id } = useParams();
      const [training, setTraining] = useState(null);
    const [availableExercises, setAvailableExercises] = useState([]);
    const [selectedExercises, setSelectedExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentStep, setCurrentStep] = useState(1); // 1: Planung, 2: Übungen, 3: Durchführung, 4: Analyse
    const [showCreateExercise, setShowCreateExercise] = useState(false);
    const [exerciseSearchTerm, setExerciseSearchTerm] = useState('');
    const [exerciseFilterCategory, setExerciseFilterCategory] = useState('');
    const [exerciseLimit, setExerciseLimit] = useState(12); // Anfangs 12 Übungen anzeigen
    const [showAllExercises, setShowAllExercises] = useState(false);    const [newExercise, setNewExercise] = useState({
        title: '',
        description: '',
        category: '',
        duration: 15,
        difficulty: 'medium',
        equipment: '',
        instructions: '',
        image: null
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [trainingData, setTrainingData] = useState({
        title: '',
        date: '',
        time: '',
        duration: '',
        location: '',
        focus: '',
        goals: '',
        notes: '',
        players: []
    });    // Trainings-Fokus Optionen
    const focusOptions = [
        { value: 'technik', label: 'Technik', icon: '⚽', color: 'bg-blue-500' },
        { value: 'taktik', label: 'Taktik', icon: '🧠', color: 'bg-indigo-500' },
        { value: 'kondition', label: 'Kondition', icon: '💪', color: 'bg-red-500' },
        { value: 'koordination', label: 'Koordination', icon: '🤸', color: 'bg-orange-500' },
        { value: 'spielformen', label: 'Spielformen', icon: '🎮', color: 'bg-green-500' },
        { value: 'standards', label: 'Standards', icon: '📐', color: 'bg-purple-500' }
    ];

    // Übungskategorien
    const exerciseCategories = [
        { value: 'aufwaermen', label: 'Aufwärmen' },
        { value: 'technik', label: 'Technik' },
        { value: 'taktik', label: 'Taktik' },
        { value: 'kondition', label: 'Kondition' },
        { value: 'koordination', label: 'Koordination' },
        { value: 'spielformen', label: 'Spielformen' },
        { value: 'standards', label: 'Standards' },
        { value: 'abschluss', label: 'Abschluss' }
    ];

    useEffect(() => {
        if (id) {
            fetchTraining();
        } else {
            setTraining({});
            setLoading(false);
        }
        fetchExercises();
    }, [id]);

    const fetchTraining = async () => {
        try {
            const response = await axiosInstance.get(`/get-event/${id}`);
            const trainingData = response.data.event;
            setTraining(trainingData);
            setTrainingData({
                title: trainingData.title || '',
                date: trainingData.date || '',
                time: trainingData.time || '',
                duration: trainingData.duration || '',
                location: trainingData.location || '',
                focus: trainingData.focus || '',
                goals: trainingData.goals || '',
                notes: trainingData.notes || '',
                players: trainingData.players || []
            });
            setSelectedExercises(trainingData.exercises || []);
        } catch (err) {
            console.error('Fehler beim Laden des Trainings:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchExercises = async () => {
        try {
            const response = await axiosInstance.get('/get-all-exercises');
            setAvailableExercises(response.data.exercises || []);
        } catch (err) {
            console.error('Fehler beim Laden der Übungen:', err);
        }
    };

    const handleInputChange = (field, value) => {
        setTrainingData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const addExerciseToTraining = (exercise) => {
        setSelectedExercises(prev => [...prev, {
            ...exercise,
            plannedDuration: 15,
            actualDuration: 0,
            intensity: 'medium',
            completed: false,
            notes: ''
        }]);
    };

    const removeExerciseFromTraining = (exerciseId) => {
        setSelectedExercises(prev => prev.filter(ex => ex.id !== exerciseId));
    };

    const updateExercise = (exerciseId, updates) => {
        setSelectedExercises(prev => 
            prev.map(ex => ex.id === exerciseId ? { ...ex, ...updates } : ex)
        );
    };    const saveTraining = async () => {
        try {
            const payload = {
                ...trainingData,
                exercises: selectedExercises,
                type: 'training'
            };

            if (id) {
                await axiosInstance.put(`/update-event/${id}`, payload);
            } else {
                await axiosInstance.post('/create-event', payload);
            }
            
            navigate('/team/training');
        } catch (err) {
            console.error('Fehler beim Speichern:', err);
        }
    };    const handleNewExerciseChange = (field, value) => {
        setNewExercise(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Validierung: nur Bilder erlauben
            if (!file.type.startsWith('image/')) {
                alert('Bitte wählen Sie eine Bilddatei aus.');
                return;
            }

            // Größenbegrenzung: max 5MB
            if (file.size > 5 * 1024 * 1024) {
                alert('Bild ist zu groß. Maximale Größe: 5MB');
                return;
            }

            setNewExercise(prev => ({
                ...prev,
                image: file
            }));

            // Vorschau erstellen
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setNewExercise(prev => ({
            ...prev,
            image: null
        }));
        setImagePreview(null);
    };const resetNewExercise = () => {
        setNewExercise({
            title: '',
            description: '',
            category: '',
            duration: 15,
            difficulty: 'medium',
            equipment: '',
            instructions: '',
            image: null
        });
        setImagePreview(null);
    };    const createAndAddExercise = async () => {
        if (!newExercise.title || !newExercise.category) {
            alert('Bitte füllen Sie mindestens Titel und Kategorie aus.');
            return;
        }

        try {
            // Erstelle neue Übung mit temporärer ID für lokale Verwendung
            const tempId = 'temp_' + Date.now();
            const exerciseToAdd = {
                ...newExercise,
                id: tempId,
                isTemporary: true,
                plannedDuration: newExercise.duration,
                actualDuration: 0,
                intensity: 'medium',
                completed: false,
                notes: '',
                imagePreview: imagePreview // Für lokale Anzeige
            };

            // Füge zur ausgewählten Liste hinzu
            setSelectedExercises(prev => [...prev, exerciseToAdd]);
            
            // Speichere in der Übungsdatenbank mit Bild-Upload
            try {
                let exerciseData = { ...newExercise };
                let imageUrl = null;

                // Wenn ein Bild vorhanden ist, lade es hoch
                if (newExercise.image) {
                    const formData = new FormData();
                    formData.append('exercise', newExercise.image);
                    formData.append('exerciseId', tempId);

                    try {
                        const uploadResponse = await axiosInstance.post('/upload-exercise-image', formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                            },
                        });
                        
                        if (uploadResponse.data && uploadResponse.data.imageUrl) {
                            imageUrl = uploadResponse.data.imageUrl;
                            exerciseData.imageUrl = imageUrl;
                        }
                    } catch (uploadError) {
                        console.log('Bild-Upload fehlgeschlagen:', uploadError);
                        // Übung wird trotzdem ohne Bild gespeichert
                    }
                }

                // Entferne das File-Objekt vor dem Senden
                delete exerciseData.image;

                const response = await axiosInstance.post('/create-exercise', exerciseData);
                
                // Aktualisiere die ID mit der echten ID aus der Datenbank
                if (response.data && response.data.exercise) {
                    const dbExercise = response.data.exercise;
                    setSelectedExercises(prev => 
                        prev.map(ex => 
                            ex.id === tempId 
                                ? { 
                                    ...ex, 
                                    id: dbExercise._id, 
                                    isTemporary: false,
                                    imageUrl: dbExercise.imageUrl || imageUrl
                                  }
                                : ex
                        )
                    );
                    // Füge zur verfügbaren Liste hinzu
                    setAvailableExercises(prev => [...prev, dbExercise]);
                }
            } catch (dbError) {
                console.log('Übung nicht in Datenbank gespeichert, wird nur lokal verwendet:', dbError);
            }

            // Reset form und schließe Modal
            resetNewExercise();
            setShowCreateExercise(false);
        } catch (err) {
            console.error('Fehler beim Erstellen der Übung:', err);
        }    };

    // Hilfsfunktion für Bild-URLs in verfügbaren Übungen
    const getExerciseImageUrl = (exercise) => {
        if (exercise.imageUrl) {
            return exercise.imageUrl;
        } else if (exercise.image) {
            return `http://localhost:8000/uploads/exercises/${exercise.image}`;
        }
        return null;
    };    const exerciseHasImage = (exercise) => {
        return exercise.imageUrl || exercise.image;
    };

    // Filter- und Suchfunktionen für Übungen
    const getFilteredExercises = () => {
        let filtered = availableExercises.filter(ex => !selectedExercises.find(sel => sel.id === ex.id));

        // Suchfilter
        if (exerciseSearchTerm) {
            const searchLower = exerciseSearchTerm.toLowerCase();
            filtered = filtered.filter(exercise => 
                exercise.title?.toLowerCase().includes(searchLower) ||
                exercise.description?.toLowerCase().includes(searchLower) ||
                exercise.tags?.some(tag => tag.toLowerCase().includes(searchLower))
            );
        }

        // Kategoriefilter
        if (exerciseFilterCategory) {
            filtered = filtered.filter(exercise => 
                exercise.category?.toLowerCase() === exerciseFilterCategory.toLowerCase()
            );
        }

        return filtered;
    };

    const getDisplayedExercises = () => {
        const filtered = getFilteredExercises();
        return showAllExercises ? filtered : filtered.slice(0, exerciseLimit);
    };

    const resetExerciseFilters = () => {
        setExerciseSearchTerm('');
        setExerciseFilterCategory('');
        setShowAllExercises(false);
    };

    const getStepContent = () => {
        switch (currentStep) {
            case 1: return renderPlanningStep();
            case 2: return renderExerciseSelection();
            case 3: return renderTrainingExecution();
            case 4: return renderTrainingAnalysis();
            default: return renderPlanningStep();
        }
    };

    const renderPlanningStep = () => (
        <div className="space-y-6">
            <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FaFlag className="text-blue-500" />
                    Trainingsplanung
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Trainingstitel
                        </label>
                        <input
                            type="text"
                            value={trainingData.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="z.B. Techniktraining - Ballkontrolle"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Trainingsort
                        </label>
                        <input
                            type="text"
                            value={trainingData.location}
                            onChange={(e) => handleInputChange('location', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="z.B. Sportplatz A"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Datum
                        </label>
                        <input
                            type="date"
                            value={trainingData.date}
                            onChange={(e) => handleInputChange('date', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Uhrzeit
                        </label>
                        <input
                            type="time"
                            value={trainingData.time}
                            onChange={(e) => handleInputChange('time', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Dauer (Minuten)
                        </label>
                        <input
                            type="number"
                            value={trainingData.duration}
                            onChange={(e) => handleInputChange('duration', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="90"
                        />
                    </div>
                </div>

                <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Trainingsfokus
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {focusOptions.map(option => (
                            <button
                                key={option.value}
                                onClick={() => handleInputChange('focus', option.value)}
                                className={`p-3 rounded-lg border-2 text-left transition-all ${
                                    trainingData.focus === option.value
                                        ? `${option.color} text-white border-transparent`
                                        : 'border-gray-200 hover:border-gray-300 bg-white'
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    <span className="text-xl">{option.icon}</span>
                                    <span className="font-medium">{option.label}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Trainingsziele
                    </label>
                    <textarea
                        value={trainingData.goals}
                        onChange={(e) => handleInputChange('goals', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Was soll in diesem Training erreicht werden?"
                    />
                </div>
            </Card>
        </div>
    );

    const renderExerciseSelection = () => (
        <div className="space-y-6">
            <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FaClipboardList className="text-green-500" />
                    Übungsauswahl ({selectedExercises.length} Übungen)
                </h3>
                
                {selectedExercises.length > 0 && (
                    <div className="mb-6">
                        <h4 className="font-medium text-gray-700 mb-3">Ausgewählte Übungen:</h4>
                        <div className="space-y-3">                            {selectedExercises.map((exercise, index) => (
                                <div key={exercise.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3">
                                            <span className="w-6 h-6 bg-blue-500 text-white text-sm rounded-full flex items-center justify-center">
                                                {index + 1}
                                            </span>                                            {(exercise.imageUrl || exercise.imagePreview || exercise.image) && (
                                                <img
                                                    src={exercise.imageUrl || exercise.imagePreview || getExerciseImageUrl(exercise)}
                                                    alt={exercise.title}
                                                    className="w-12 h-12 object-cover rounded border border-gray-300"
                                                />
                                            )}
                                            <div>
                                                <h5 className="font-medium">{exercise.title}</h5>
                                                <p className="text-sm text-gray-600">{exercise.category}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-2">
                                            <FaClock className="text-gray-400" />
                                            <input
                                                type="number"
                                                value={exercise.plannedDuration}
                                                onChange={(e) => updateExercise(exercise.id, { plannedDuration: parseInt(e.target.value) })}
                                                className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                                            />
                                            <span className="text-sm text-gray-500">min</span>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            icon={FaTrash}
                                            onClick={() => removeExerciseFromTraining(exercise.id)}
                                            className="text-red-600 hover:text-red-700"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}                <div>
                    <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium text-gray-700">Verfügbare Übungen:</h4>
                        <Button
                            variant="secondary"
                            size="sm"
                            icon={FaPlus}
                            onClick={() => setShowCreateExercise(!showCreateExercise)}
                        >
                            {showCreateExercise ? 'Abbrechen' : 'Neue Übung erstellen'}
                        </Button>
                    </div>

                    {/* Neue Übung erstellen Form */}
                    {showCreateExercise && (
                        <div className="mb-6 p-4 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50">
                            <h5 className="font-medium text-blue-800 mb-4">Neue Übung erstellen</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Titel *
                                    </label>
                                    <input
                                        type="text"
                                        value={newExercise.title}
                                        onChange={(e) => handleNewExerciseChange('title', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="z.B. Ballkontrolle im Quadrat"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Kategorie *
                                    </label>
                                    <select
                                        value={newExercise.category}
                                        onChange={(e) => handleNewExerciseChange('category', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Kategorie wählen...</option>
                                        {exerciseCategories.map(cat => (
                                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Dauer (Minuten)
                                    </label>
                                    <input
                                        type="number"
                                        value={newExercise.duration}
                                        onChange={(e) => handleNewExerciseChange('duration', parseInt(e.target.value))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        min="1"
                                        max="120"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Schwierigkeit
                                    </label>
                                    <select
                                        value={newExercise.difficulty}
                                        onChange={(e) => handleNewExerciseChange('difficulty', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="easy">Einfach</option>
                                        <option value="medium">Mittel</option>
                                        <option value="hard">Schwer</option>
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Beschreibung
                                    </label>
                                    <textarea
                                        value={newExercise.description}
                                        onChange={(e) => handleNewExerciseChange('description', e.target.value)}
                                        rows={2}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Kurze Beschreibung der Übung..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Benötigte Ausrüstung
                                    </label>
                                    <input
                                        type="text"
                                        value={newExercise.equipment}
                                        onChange={(e) => handleNewExerciseChange('equipment', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="z.B. 4 Hütchen, 1 Ball pro Spieler"
                                    />
                                </div>                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Durchführung
                                    </label>
                                    <textarea
                                        value={newExercise.instructions}
                                        onChange={(e) => handleNewExerciseChange('instructions', e.target.value)}
                                        rows={2}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Schritt-für-Schritt Anleitung..."
                                    />
                                </div>
                            </div>

                            {/* Bild-Upload Bereich */}
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Übungsbild (optional)
                                </label>
                                
                                {!imagePreview ? (
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                                        <FaImage className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                                        <div className="text-sm text-gray-600 mb-2">
                                            Bild hochladen (max. 5MB)
                                        </div>
                                        <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                                            <FaUpload />
                                            Bild wählen
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <img
                                            src={imagePreview}
                                            alt="Übungsvorschau"
                                            className="w-full h-32 object-cover rounded-lg border border-gray-300"
                                        />
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                                        >
                                            <FaTimes className="text-xs" />
                                        </button>
                                        <div className="mt-2 text-sm text-gray-600">
                                            Bild erfolgreich hochgeladen. Klicken Sie auf X zum Entfernen.
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-3 mt-4">
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={createAndAddExercise}
                                    disabled={!newExercise.title || !newExercise.category}
                                >
                                    Übung erstellen und hinzufügen
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        resetNewExercise();
                                        setShowCreateExercise(false);
                                    }}
                                >
                                    Abbrechen
                                </Button>
                            </div>
                        </div>                    )}

                    {/* Such- und Filterbereich */}
                    <div className="mb-4 space-y-3">
                        <div className="flex flex-wrap gap-3">
                            {/* Suchfeld */}
                            <div className="flex-1 min-w-64">
                                <div className="relative">
                                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        value={exerciseSearchTerm}
                                        onChange={(e) => setExerciseSearchTerm(e.target.value)}
                                        placeholder="Übungen durchsuchen..."
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                            
                            {/* Kategoriefilter */}
                            <div className="min-w-48">
                                <select
                                    value={exerciseFilterCategory}
                                    onChange={(e) => setExerciseFilterCategory(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Alle Kategorien</option>
                                    {exerciseCategories.map(cat => (
                                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                                    ))}
                                </select>
                            </div>
                            
                            {/* Filter zurücksetzen */}
                            {(exerciseSearchTerm || exerciseFilterCategory) && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    icon={FaTimes}
                                    onClick={resetExerciseFilters}
                                >
                                    Filter zurücksetzen
                                </Button>
                            )}
                        </div>
                        
                        {/* Ergebnisanzeige */}
                        <div className="flex justify-between items-center text-sm text-gray-600">
                            <span>
                                {getFilteredExercises().length} Übung(en) gefunden
                                {!showAllExercises && getFilteredExercises().length > exerciseLimit && 
                                    ` (${exerciseLimit} angezeigt)`}
                            </span>
                            {getFilteredExercises().length > exerciseLimit && !showAllExercises && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowAllExercises(true)}
                                >
                                    Alle {getFilteredExercises().length} anzeigen
                                </Button>
                            )}
                        </div>
                    </div>                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                        {getDisplayedExercises().length > 0 ? (
                            getDisplayedExercises().map(exercise => (
                                <div key={exercise.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                                    {exerciseHasImage(exercise) && (
                                        <img
                                            src={getExerciseImageUrl(exercise)}
                                            alt={exercise.title}
                                            className="w-full h-32 object-cover rounded mb-3"
                                        />
                                    )}
                                    <div className="flex justify-between items-start mb-2">
                                        <h5 className="font-medium">{exercise.title}</h5>
                                        <Badge variant="secondary">{exercise.category}</Badge>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-3">{exercise.description}</p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500">
                                            <FaClock className="inline mr-1" />
                                            {exercise.duration || '15'} min
                                        </span>
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            icon={FaPlus}
                                            onClick={() => addExerciseToTraining(exercise)}
                                        >
                                            Hinzufügen
                                        </Button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-2 text-center py-8">
                                <FaSearch className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Keine Übungen gefunden</h3>
                                <p className="text-gray-500 mb-4">
                                    {exerciseSearchTerm || exerciseFilterCategory 
                                        ? 'Versuchen Sie andere Suchbegriffe oder Filter.'
                                        : 'Erstellen Sie Ihre erste Übung oder laden Sie Übungen hoch.'}
                                </p>
                                {(exerciseSearchTerm || exerciseFilterCategory) && (
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={resetExerciseFilters}
                                    >
                                        Filter zurücksetzen
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );

    const renderTrainingExecution = () => (
        <div className="space-y-6">
            <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FaPlay className="text-orange-500" />
                    Training durchführen
                </h3>
                <div className="space-y-4">
                    {selectedExercises.map((exercise, index) => (
                        <div key={exercise.id} className="p-4 border border-gray-200 rounded-lg">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${exercise.completed ? 'bg-green-500' : 'bg-gray-400'}`}>
                                        {exercise.completed ? <FaCheckCircle /> : index + 1}
                                    </span>
                                    <div>
                                        <h5 className="font-medium">{exercise.title}</h5>
                                        <p className="text-sm text-gray-600">{exercise.category}</p>
                                    </div>
                                </div>
                                <Button
                                    variant={exercise.completed ? "success" : "primary"}
                                    size="sm"
                                    onClick={() => updateExercise(exercise.id, { completed: !exercise.completed })}
                                >
                                    {exercise.completed ? 'Abgeschlossen' : 'Als abgeschlossen markieren'}
                                </Button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tatsächliche Dauer (min)
                                    </label>
                                    <input
                                        type="number"
                                        value={exercise.actualDuration}
                                        onChange={(e) => updateExercise(exercise.id, { actualDuration: parseInt(e.target.value) })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                        placeholder={exercise.plannedDuration}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Intensität
                                    </label>
                                    <select
                                        value={exercise.intensity}
                                        onChange={(e) => updateExercise(exercise.id, { intensity: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                    >
                                        <option value="low">Niedrig</option>
                                        <option value="medium">Mittel</option>
                                        <option value="high">Hoch</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Bewertung
                                    </label>
                                    <select
                                        value={exercise.rating || ''}
                                        onChange={(e) => updateExercise(exercise.id, { rating: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                    >
                                        <option value="">Bewerten...</option>
                                        <option value="5">⭐⭐⭐⭐⭐ Sehr gut</option>
                                        <option value="4">⭐⭐⭐⭐ Gut</option>
                                        <option value="3">⭐⭐⭐ Okay</option>
                                        <option value="2">⭐⭐ Schlecht</option>
                                        <option value="1">⭐ Sehr schlecht</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div className="mt-3">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Notizen zur Übung
                                </label>
                                <textarea
                                    value={exercise.notes}
                                    onChange={(e) => updateExercise(exercise.id, { notes: e.target.value })}
                                    rows={2}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                    placeholder="Wie lief die Übung? Besonderheiten, Anpassungen..."
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );

    const renderTrainingAnalysis = () => {
        const completedExercises = selectedExercises.filter(ex => ex.completed);
        const totalPlannedTime = selectedExercises.reduce((sum, ex) => sum + (ex.plannedDuration || 0), 0);
        const totalActualTime = selectedExercises.reduce((sum, ex) => sum + (ex.actualDuration || 0), 0);
        const averageRating = completedExercises.length > 0 
            ? completedExercises.reduce((sum, ex) => sum + (parseInt(ex.rating) || 0), 0) / completedExercises.length 
            : 0;

        return (
            <div className="space-y-6">
                <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <FaCheckCircle className="text-purple-500" />
                        Trainingsanalyse
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">{completedExercises.length}</div>
                            <div className="text-sm text-gray-600">Übungen abgeschlossen</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">{totalActualTime}min</div>
                            <div className="text-sm text-gray-600">Tatsächliche Dauer</div>
                        </div>
                        <div className="text-center p-4 bg-yellow-50 rounded-lg">
                            <div className="text-2xl font-bold text-yellow-600">
                                {totalPlannedTime ? Math.round((totalActualTime / totalPlannedTime) * 100) : 0}%
                            </div>
                            <div className="text-sm text-gray-600">Zeitplan-Effizienz</div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <div className="text-2xl font-bold text-purple-600">
                                {averageRating ? averageRating.toFixed(1) : 'N/A'}⭐
                            </div>
                            <div className="text-sm text-gray-600">Durchschnittsbewertung</div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Gesamtbewertung des Trainings
                            </label>
                            <select
                                value={trainingData.overallRating || ''}
                                onChange={(e) => handleInputChange('overallRating', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            >
                                <option value="">Training bewerten...</option>
                                <option value="5">⭐⭐⭐⭐⭐ Sehr erfolgreich</option>
                                <option value="4">⭐⭐⭐⭐ Erfolgreich</option>
                                <option value="3">⭐⭐⭐ Zufriedenstellend</option>
                                <option value="2">⭐⭐ Verbesserungsbedarf</option>
                                <option value="1">⭐ Nicht erfolgreich</option>
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Trainingsnotizen & Fazit
                            </label>
                            <textarea
                                value={trainingData.analysis}
                                onChange={(e) => handleInputChange('analysis', e.target.value)}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                placeholder="Wie ist das Training gelaufen? Was war besonders gut/schlecht? Verbesserungsvorschläge für nächste Trainings..."
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nächste Schritte
                            </label>
                            <textarea
                                value={trainingData.nextSteps}
                                onChange={(e) => handleInputChange('nextSteps', e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                placeholder="Was sollte im nächsten Training fokussiert werden? Welche Bereiche brauchen mehr Aufmerksamkeit?"
                            />
                        </div>
                    </div>
                </Card>
            </div>
        );
    };

    if (loading) {
        return (
            <Layout>
                <div className="min-h-screen bg-gray-50 p-6">
                    <LoadingSpinner text="Lade Training..." />
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50 p-6">
                <PageHeader
                    title={id ? "Training bearbeiten" : "Neues Training planen"}
                    subtitle="Vollständige Trainingsplanung mit Übungsauswahl und Analyse"
                    icon={FaDumbbell}
                    actions={
                        <div className="flex gap-3">
                            <Button
                                variant="secondary"
                                icon={FaArrowLeft}
                                onClick={() => navigate('/team/training')}
                            >
                                Zurück
                            </Button>
                            <Button
                                variant="primary"
                                icon={FaSave}
                                onClick={saveTraining}
                            >
                                Speichern
                            </Button>
                        </div>
                    }
                />

                {/* Step Navigation */}
                <Card className="p-4 mb-6">
                    <div className="flex items-center justify-between">
                        {[
                            { step: 1, label: 'Planung', icon: FaFlag },
                            { step: 2, label: 'Übungen', icon: FaClipboardList },
                            { step: 3, label: 'Durchführung', icon: FaPlay },
                            { step: 4, label: 'Analyse', icon: FaCheckCircle }
                        ].map(({ step, label, icon: Icon }) => (
                            <button
                                key={step}
                                onClick={() => setCurrentStep(step)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                                    currentStep === step
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                <Icon />
                                <span className="hidden md:inline">{label}</span>
                            </button>
                        ))}
                    </div>
                </Card>

                {/* Step Content */}
                {getStepContent()}

                {/* Navigation Buttons */}
                <Card className="p-4 mt-6">
                    <div className="flex justify-between">
                        <Button
                            variant="secondary"
                            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                            disabled={currentStep === 1}
                        >
                            Zurück
                        </Button>
                        <Button
                            variant="primary"
                            onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
                            disabled={currentStep === 4}
                        >
                            Weiter
                        </Button>
                    </div>
                </Card>
            </div>
        </Layout>
    );
};

export default TrainingPlan;
