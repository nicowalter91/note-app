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
    FaFlag
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
    });

    // Trainings-Fokus Optionen
    const focusOptions = [
        { value: 'technik', label: 'Technik', icon: '⚽', color: 'bg-blue-500' },
        { value: 'taktik', label: 'Taktik', icon: '🧠', color: 'bg-indigo-500' },
        { value: 'kondition', label: 'Kondition', icon: '💪', color: 'bg-red-500' },
        { value: 'koordination', label: 'Koordination', icon: '🤸', color: 'bg-orange-500' },
        { value: 'spielformen', label: 'Spielformen', icon: '🎮', color: 'bg-green-500' },
        { value: 'standards', label: 'Standards', icon: '📐', color: 'bg-purple-500' }
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
    };

    const saveTraining = async () => {
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
                        <div className="space-y-3">
                            {selectedExercises.map((exercise, index) => (
                                <div key={exercise.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3">
                                            <span className="w-6 h-6 bg-blue-500 text-white text-sm rounded-full flex items-center justify-center">
                                                {index + 1}
                                            </span>
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
                )}

                <div>
                    <h4 className="font-medium text-gray-700 mb-3">Verfügbare Übungen:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                        {availableExercises
                            .filter(ex => !selectedExercises.find(sel => sel.id === ex.id))
                            .map(exercise => (
                            <div key={exercise.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
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
                        ))}
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
