import React, { useState, useEffect } from 'react';
import { 
    FaTimes, 
    FaFutbol, 
    FaCalendarAlt, 
    FaClock, 
    FaMapMarkerAlt, 
    FaUsers,
    FaPlus,
    FaHome,
    FaPlane,
    FaDrawPolygon
} from 'react-icons/fa';
import axiosInstance from '../../utils/axiosInstance';

const AddMatchDay = ({ isOpen, onClose, onMatchAdded }) => {
    const [formData, setFormData] = useState({
        title: '',
        opponent: '',
        date: '',
        time: '',
        location: '',
        isHome: true,
        description: '',
        matchType: 'league', // league, friendly, cup, tournament
        importance: 'normal', // low, normal, high
        preparation: {
            formation: '',
            tactics: [],
            notes: ''
        }
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [currentStep, setCurrentStep] = useState(1); // 1: Basic Info, 2: Details & Preparation

    const matchTypes = [
        { value: 'league', label: 'Liga-Spiel', color: 'blue' },
        { value: 'cup', label: 'Pokal-Spiel', color: 'purple' },
        { value: 'friendly', label: 'Freundschaftsspiel', color: 'green' },
        { value: 'tournament', label: 'Turnier', color: 'orange' }
    ];

    const importanceLevels = [
        { value: 'low', label: 'Niedrig', color: 'gray' },
        { value: 'normal', label: 'Normal', color: 'blue' },
        { value: 'high', label: 'Hoch', color: 'red' }
    ];

    const formations = [
        '4-4-2', '4-3-3', '3-5-2', '4-2-3-1', '3-4-3', '5-3-2', '4-5-1'
    ];

    const tacticsOptions = [
        { id: 'pressing', label: 'Pressing', category: 'Defensiv' },
        { id: 'counter', label: 'Konter', category: 'Offensiv' },
        { id: 'possession', label: 'Ballbesitz', category: 'Aufbau' },
        { id: 'wing_play', label: 'Flügelspiel', category: 'Offensiv' },
        { id: 'long_ball', label: 'Lange Bälle', category: 'Aufbau' },
        { id: 'park_bus', label: 'Defensiv-Block', category: 'Defensiv' },
        { id: 'quick_passing', label: 'Schnelles Passspiel', category: 'Aufbau' },
        { id: 'set_pieces', label: 'Standard-Situationen', category: 'Spezial' }
    ];

    useEffect(() => {
        if (isOpen) {
            resetForm();
            setCurrentStep(1);
        }
    }, [isOpen]);

    const resetForm = () => {
        setFormData({
            title: '',
            opponent: '',
            date: '',
            time: '',
            location: '',
            isHome: true,
            description: '',
            matchType: 'league',
            importance: 'normal',
            preparation: {
                formation: '',
                tactics: [],
                notes: ''
            }
        });
        setError('');
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name.startsWith('preparation.')) {
            const prepField = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                preparation: {
                    ...prev.preparation,
                    [prepField]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const handleTacticsChange = (tacticId) => {
        setFormData(prev => ({
            ...prev,
            preparation: {
                ...prev.preparation,
                tactics: prev.preparation.tactics.includes(tacticId)
                    ? prev.preparation.tactics.filter(t => t !== tacticId)
                    : [...prev.preparation.tactics, tacticId]
            }
        }));
    };

    const validateStep1 = () => {
        if (!formData.title.trim()) {
            setError('Bitte geben Sie einen Spieltitel ein');
            return false;
        }
        if (!formData.opponent.trim()) {
            setError('Bitte geben Sie den Gegner ein');
            return false;
        }
        if (!formData.date) {
            setError('Bitte wählen Sie ein Datum aus');
            return false;
        }
        if (!formData.time) {
            setError('Bitte geben Sie eine Uhrzeit ein');
            return false;
        }
        return true;
    };

    const handleNextStep = () => {
        if (validateStep1()) {
            setError('');
            setCurrentStep(2);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateStep1()) {
            setCurrentStep(1);
            return;
        }

        setLoading(true);
        setError('');

        try {
            const matchData = {
                title: formData.title,
                type: 'match',
                date: formData.date,
                time: formData.time,
                location: formData.location,
                description: formData.description,
                isHome: formData.isHome,
                opponent: formData.opponent,
                matchType: formData.matchType,
                importance: formData.importance,
                matchData: {
                    formation: formData.preparation.formation,
                    tactics: formData.preparation.tactics,
                    notes: formData.preparation.notes,
                    isHome: formData.isHome
                }
            };

            await axiosInstance.post('/add-event', matchData);
            
            onMatchAdded();
            onClose();
            resetForm();
        } catch (err) {
            console.error('Fehler beim Erstellen des Spiels:', err);
            setError(err.response?.data?.message || 'Fehler beim Erstellen des Spiels');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                            <FaFutbol className="text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                                Neues Spiel erstellen
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Schritt {currentStep} von 2
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <FaTimes className="text-xl" />
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="px-6 pt-4">
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="flex items-center space-x-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                currentStep >= 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                            }`}>
                                1
                            </div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Grunddaten</span>
                        </div>
                        <div className={`flex-1 h-1 rounded-full ${
                            currentStep >= 2 ? 'bg-blue-500' : 'bg-gray-200'
                        }`} />
                        <div className="flex items-center space-x-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                currentStep >= 2 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                            }`}>
                                2
                            </div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Vorbereitung</span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="px-6 pb-6">
                        {error && (
                            <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg">
                                {error}
                            </div>
                        )}

                        {currentStep === 1 && (
                            <div className="space-y-6">
                                {/* Basic Information */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Spieltitel *
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            placeholder="z.B. vs. FC Bayern München"
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Gegner *
                                        </label>
                                        <input
                                            type="text"
                                            name="opponent"
                                            value={formData.opponent}
                                            onChange={handleInputChange}
                                            placeholder="Name des Gegners"
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Datum *
                                        </label>
                                        <input
                                            type="date"
                                            name="date"
                                            value={formData.date}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Anpfiff *
                                        </label>
                                        <input
                                            type="time"
                                            name="time"
                                            value={formData.time}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Spielort
                                    </label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        placeholder="Stadion/Platz"
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    />
                                </div>

                                {/* Match Type Selection */}
                                <div className="space-y-3">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Spieltyp
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {matchTypes.map(type => (
                                            <button
                                                key={type.value}
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, matchType: type.value }))}
                                                className={`p-3 rounded-lg border-2 text-sm font-medium transition-colors ${
                                                    formData.matchType === type.value
                                                        ? `border-${type.color}-500 bg-${type.color}-50 text-${type.color}-700`
                                                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                                                }`}
                                            >
                                                {type.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Home/Away Selection */}
                                <div className="space-y-3">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Heim- oder Auswärtsspiel
                                    </label>
                                    <div className="flex space-x-4">
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, isHome: true }))}
                                            className={`flex items-center space-x-2 px-4 py-3 rounded-lg border-2 transition-colors ${
                                                formData.isHome
                                                    ? 'border-green-500 bg-green-50 text-green-700'
                                                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                                            }`}
                                        >
                                            <FaHome />
                                            <span>Heimspiel</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, isHome: false }))}
                                            className={`flex items-center space-x-2 px-4 py-3 rounded-lg border-2 transition-colors ${
                                                !formData.isHome
                                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                                            }`}
                                        >
                                            <FaPlane />
                                            <span>Auswärtsspiel</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Importance Level */}
                                <div className="space-y-3">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Spielwichtigkeit
                                    </label>
                                    <div className="flex space-x-3">
                                        {importanceLevels.map(level => (
                                            <button
                                                key={level.value}
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, importance: level.value }))}
                                                className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                                                    formData.importance === level.value
                                                        ? `border-${level.color}-500 bg-${level.color}-50 text-${level.color}-700`
                                                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                                                }`}
                                            >
                                                {level.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className="space-y-6">
                                {/* Formation Selection */}
                                <div className="space-y-3">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        <FaUsers className="inline mr-2" />
                                        Geplante Formation
                                    </label>
                                    <select
                                        name="preparation.formation"
                                        value={formData.preparation.formation}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    >
                                        <option value="">Formation auswählen</option>
                                        {formations.map(formation => (
                                            <option key={formation} value={formation}>
                                                {formation}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Tactics Selection */}
                                <div className="space-y-3">                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        <FaDrawPolygon className="inline mr-2" />
                                        Taktische Ausrichtung
                                    </label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {tacticsOptions.map(tactic => (
                                            <div key={tactic.id} className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id={tactic.id}
                                                    checked={formData.preparation.tactics.includes(tactic.id)}
                                                    onChange={() => handleTacticsChange(tactic.id)}
                                                    className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                />
                                                <label htmlFor={tactic.id} className="text-sm text-gray-700 dark:text-gray-300">
                                                    <span className="font-medium">{tactic.label}</span>
                                                    <span className="text-gray-500 ml-2">({tactic.category})</span>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Preparation Notes */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Vorbereitungsnotizen
                                    </label>
                                    <textarea
                                        name="preparation.notes"
                                        value={formData.preparation.notes}
                                        onChange={handleInputChange}
                                        rows={4}
                                        placeholder="Spezielle Vorbereitungen, Schwerpunkte, etc..."
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    />
                                </div>

                                {/* General Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Allgemeine Beschreibung
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows={3}
                                        placeholder="Zusätzliche Informationen zum Spiel..."
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between px-6 py-4 bg-gray-50 dark:bg-gray-700 rounded-b-xl">
                        <div className="flex space-x-3">
                            {currentStep > 1 && (
                                <button
                                    type="button"
                                    onClick={() => setCurrentStep(currentStep - 1)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white transition-colors"
                                >
                                    Zurück
                                </button>
                            )}
                        </div>
                        <div className="flex space-x-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white transition-colors"
                            >
                                Abbrechen
                            </button>
                            {currentStep === 1 ? (
                                <button
                                    type="button"
                                    onClick={handleNextStep}
                                    className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center space-x-2"
                                >
                                    <span>Weiter</span>
                                    <FaPlus className="text-sm" />
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-lg transition-colors flex items-center space-x-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                                            <span>Erstelle...</span>
                                        </>
                                    ) : (
                                        <>
                                            <FaFutbol className="text-sm" />
                                            <span>Spiel erstellen</span>
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddMatchDay;
