import React, { useState, useEffect } from 'react';
import Layout from '../../../../components/Layout/Layout';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaTimes, FaStar } from 'react-icons/fa';
import { calculatePlayerScore, getScoreRating } from '../../../../utils/playerScoreUtils.jsx';
import { getPlayerById, updatePlayer } from '../../../../utils/playerService';
import ProfileImageUpload from '../../../../components/ProfileImageUpload/ProfileImageUpload';

const PlayerEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [player, setPlayer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({});
    const [activeTab, setActiveTab] = useState('basic');    const [isSaving, setIsSaving] = useState(false);

    // Simulating data fetch - in a real app, this would come from an API or props
    useEffect(() => {
        const fetchPlayerData = async () => {
            try {
                setLoading(true);
                const playerData = await getPlayerById(id);
                
                // Initialisiere Standardwerte für optionale Felder, falls sie nicht vorhanden sind
                const initializedPlayer = {
                    // Basis-Daten
                    name: playerData.name || '',
                    position: playerData.position || '',
                    age: playerData.age || 0,
                    number: playerData.number || 0,
                    status: playerData.status || 'Available',
                    dob: playerData.dob || '',
                    height: playerData.height || 0,
                    weight: playerData.weight || 0,
                    
                    // Physische Attribute
                    physicalAttributes: playerData.physicalAttributes || {
                        speed: 50,
                        strength: 50,
                        agility: 50,
                        endurance: 50,
                        fitness: 50
                    },
                    
                    // Skills
                    skills: playerData.skills || {},
                    
                    // Statistiken
                    stats: playerData.stats || {
                        games: 0,
                        goals: 0,
                        assists: 0,
                        yellowCards: 0,
                        redCards: 0,
                        minutesPlayed: 0,
                        cleanSheets: 0,
                        saves: 0,
                        savesPercentage: 0
                    },
                    
                    // Verletzungen
                    injuries: playerData.injuries || [],
                    
                    // Entwicklung
                    development: playerData.development || {
                        goals: [],
                        recentProgress: []
                    },
                    
                    // Persönliche Informationen
                    personalInfo: playerData.personalInfo || {
                        email: '',
                        phone: '',
                        emergencyContact: '',
                        school: '',
                        preferredFoot: ''
                    },
                    
                    // Training
                    training: playerData.training || {
                        attendance: 0,
                        recentPerformance: [],
                        specialProgram: ''
                    },
                    
                    // Dokumente
                    documents: playerData.documents || [],
                    
                    // Notizen
                    notes: playerData.notes || [],
                    
                    // Teamrolle
                    teamRole: playerData.teamRole || {
                        leadership: '',
                        preferredPartners: [],
                        chemistry: ''
                    }
                };
                
                setPlayer(initializedPlayer);
                setFormData(JSON.parse(JSON.stringify(initializedPlayer))); // Deep copy
            } catch (err) {
                console.error('Fehler beim Laden des Spielers:', err);
                // Fallback-Lösung bei Fehler - leeres Formular mit Standardwerten zeigen
                setPlayer(null);
                setFormData({
                    name: '',
                    position: '',
                    age: 0,
                    number: 0,
                    status: 'Available',
                    dob: '',
                    height: 0,
                    weight: 0,
                    physicalAttributes: {
                        speed: 50,
                        strength: 50,
                        agility: 50,
                        endurance: 50,
                        fitness: 50
                    },
                    skills: {},
                    stats: {
                        games: 0,
                        goals: 0,
                        assists: 0,
                        yellowCards: 0,
                        redCards: 0,
                        minutesPlayed: 0,
                        cleanSheets: 0,
                        saves: 0,
                        savesPercentage: 0
                    },
                    injuries: [],
                    development: {
                        goals: [],
                        recentProgress: []
                    },
                    personalInfo: {
                        email: '',
                        phone: '',
                        emergencyContact: '',
                        school: '',
                        preferredFoot: ''
                    },
                    training: {
                        attendance: 0,
                        recentPerformance: [],
                        specialProgram: ''
                    },
                    documents: [],
                    notes: [],
                    teamRole: {
                        leadership: '',
                        preferredPartners: [],
                        chemistry: ''
                    }
                });
            } finally {
                setLoading(false);
            }
        };
        
        fetchPlayerData();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleNestedInputChange = (section, field, value) => {
        setFormData({
            ...formData,
            [section]: {
                ...formData[section],
                [field]: value,
            },
        });
    };

    const handleSkillChange = (skill, value) => {
        setFormData({
            ...formData,
            skills: {
                ...formData.skills,
                [skill]: parseInt(value),
            },
        });
    };

    const handlePhysicalAttributeChange = (attribute, value) => {
        setFormData({
            ...formData,
            physicalAttributes: {
                ...formData.physicalAttributes,
                [attribute]: parseInt(value),
            },
        });
    };

    const handleStatChange = (stat, value) => {
        setFormData({
            ...formData,
            stats: {
                ...formData.stats,
                [stat]: parseInt(value),
            },
        });
    };
    
    const handleAddInjury = () => {
        setFormData({
            ...formData,
            injuries: [
                ...formData.injuries, 
                { type: '', date: '', duration: '', status: 'Aktiv' }
            ]
        });
    };

    const handleInjuryChange = (index, field, value) => {
        const updatedInjuries = [...formData.injuries];
        updatedInjuries[index] = { 
            ...updatedInjuries[index],
            [field]: value 
        };
        
        setFormData({
            ...formData,
            injuries: updatedInjuries
        });
    };

    const handleRemoveInjury = (index) => {
        const updatedInjuries = [...formData.injuries];
        updatedInjuries.splice(index, 1);
        
        setFormData({
            ...formData,
            injuries: updatedInjuries
        });
    };

    const handleAddNote = () => {
        const today = new Date().toLocaleDateString('de-DE');
        setFormData({
            ...formData,
            notes: [
                ...formData.notes,
                { author: 'Trainer', date: today, text: '' }
            ]
        });
    };

    const handleNoteChange = (index, field, value) => {
        const updatedNotes = [...formData.notes];
        updatedNotes[index] = { 
            ...updatedNotes[index],
            [field]: value 
        };
        
        setFormData({
            ...formData,
            notes: updatedNotes
        });
    };

    const handleRemoveNote = (index) => {
        const updatedNotes = [...formData.notes];
        updatedNotes.splice(index, 1);
        
        setFormData({
            ...formData,
            notes: updatedNotes
        });
    };

    const handleDevelopmentGoalChange = (index, value) => {
        const updatedGoals = [...formData.development.goals];
        updatedGoals[index] = value;
        
        setFormData({
            ...formData,
            development: {
                ...formData.development,
                goals: updatedGoals
            }
        });
    };

    const handleAddDevelopmentGoal = () => {
        setFormData({
            ...formData,
            development: {
                ...formData.development,
                goals: [...formData.development.goals, '']
            }
        });
    };

    const handleRemoveDevelopmentGoal = (index) => {
        const updatedGoals = [...formData.development.goals];
        updatedGoals.splice(index, 1);
        
        setFormData({
            ...formData,
            development: {
                ...formData.development,
                goals: updatedGoals
            }
        });
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        
        try {
            // API-Aufruf zum Speichern der Daten
            await updatePlayer(id, formData);
            console.log('Spieler erfolgreich aktualisiert:', formData);
            navigate(`/team/players/${id}`);
        } catch (err) {
            console.error('Fehler beim Speichern des Spielers:', err);
            alert('Fehler beim Speichern des Spielers. Bitte versuchen Sie es später erneut.');        } finally {
            setIsSaving(false);
        }
    };
    
    const savePlayer = async () => {
        setIsSaving(true);
        
        try {
            // API-Aufruf zum Speichern der Daten
            await updatePlayer(id, formData);
            console.log('Spieler erfolgreich aktualisiert:', formData);
            navigate(`/team/players/${id}`);
        } catch (err) {
            console.error('Fehler beim Speichern des Spielers:', err);
            alert('Fehler beim Speichern des Spielers. Bitte versuchen Sie es später erneut.');
        } finally {
            setIsSaving(false);
        }
    };

    // Berechne den aktuellen Spieler-Score basierend auf den Formular-Daten
    const playerScore = calculatePlayerScore(formData);
    const scoreRating = getScoreRating(playerScore);

    const renderTabContent = () => {
        if (!formData) return null;

        switch (activeTab) {            case 'basic':
                return (
                    <>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Profilbild</label>
                            <ProfileImageUpload 
                                playerId={id}
                                currentImage={formData.profileImage}
                                onImageUpdate={(newImagePath) => {
                                    setFormData({...formData, profileImage: newImagePath});
                                }}
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name || ''}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                                <select
                                    name="position"
                                    value={formData.position || ''}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Position auswählen</option>
                                    <option value="GK">Torhüter (GK)</option>
                                <option value="DF">Verteidiger (DF)</option>
                                <option value="CB">Innenverteidiger (CB)</option>
                                <option value="LB">Linksverteidiger (LB)</option>
                                <option value="RB">Rechtsverteidiger (RB)</option>
                                <option value="MF">Mittelfeld (MF)</option>
                                <option value="CM">Zentrales Mittelfeld (CM)</option>
                                <option value="LM">Linkes Mittelfeld (LM)</option>
                                <option value="RM">Rechtes Mittelfeld (RM)</option>
                                <option value="FW">Stürmer (FW)</option>
                                <option value="ST">Mittelstürmer (ST)</option>
                                <option value="LW">Linksaußen (LW)</option>
                                <option value="RW">Rechtsaußen (RW)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Alter</label>
                            <input
                                type="number"
                                name="age"
                                value={formData.age || ''}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Trikotnummer</label>
                            <input
                                type="number"
                                name="number"
                                value={formData.number || ''}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                                name="status"
                                value={formData.status || ''}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="Available">Verfügbar</option>
                                <option value="Injured">Verletzt</option>
                                <option value="Away">Abwesend</option>
                                <option value="Training">Im Training</option>
                                <option value="Suspended">Gesperrt</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Geburtsdatum</label>
                            <input
                                type="text"
                                name="dob"
                                placeholder="TT.MM.JJJJ"
                                value={formData.dob || ''}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Größe (cm)</label>
                            <input
                                type="number"
                                name="height"
                                value={formData.height || ''}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Gewicht (kg)</label>
                            <input
                                type="number"
                                name="weight"
                                value={formData.weight || ''}                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    </>
                );

            case 'physicalAttributes':
                return (
                    <div>
                        <h3 className="font-medium text-gray-800 mb-4">Körperliche Attribute</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Geschwindigkeit: {formData.physicalAttributes?.speed}
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={formData.physicalAttributes?.speed || 0}
                                    onChange={(e) => handlePhysicalAttributeChange('speed', e.target.value)}
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Stärke: {formData.physicalAttributes?.strength}
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={formData.physicalAttributes?.strength || 0}
                                    onChange={(e) => handlePhysicalAttributeChange('strength', e.target.value)}
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Beweglichkeit: {formData.physicalAttributes?.agility}
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={formData.physicalAttributes?.agility || 0}
                                    onChange={(e) => handlePhysicalAttributeChange('agility', e.target.value)}
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Ausdauer: {formData.physicalAttributes?.endurance}
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={formData.physicalAttributes?.endurance || 0}
                                    onChange={(e) => handlePhysicalAttributeChange('endurance', e.target.value)}
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Fitness: {formData.physicalAttributes?.fitness}
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={formData.physicalAttributes?.fitness || 0}
                                    onChange={(e) => handlePhysicalAttributeChange('fitness', e.target.value)}
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </div>
                );

            case 'skills':
                // Positionsabhängige Skills definieren
                let skillFields = [];
                
                if (formData.position === 'GK') {
                    skillFields = [
                        { key: 'goalkeeping', label: 'Torwartspiel' },
                        { key: 'reflexes', label: 'Reflexe' },
                        { key: 'handling', label: 'Ballkontrolle' },
                        { key: 'positioning', label: 'Positionsspiel' },
                        { key: 'passing', label: 'Passspiel' },
                        { key: 'communication', label: 'Kommunikation' },
                        { key: 'leadership', label: 'Führungsqualität' },
                        { key: 'decisionMaking', label: 'Entscheidungsfindung' }
                    ];
                } else if (['DF', 'CB', 'RB', 'LB'].includes(formData.position)) {
                    skillFields = [
                        { key: 'tackling', label: 'Zweikampf' },
                        { key: 'marking', label: 'Manndeckung' },
                        { key: 'heading', label: 'Kopfballspiel' },
                        { key: 'positioning', label: 'Positionsspiel' },
                        { key: 'strength', label: 'Körperliche Stärke' },
                        { key: 'passing', label: 'Passspiel' },
                        { key: 'anticipation', label: 'Antizipation' },
                        { key: 'concentration', label: 'Konzentration' }
                    ];
                } else if (['MF', 'CM', 'CDM', 'CAM'].includes(formData.position)) {
                    skillFields = [
                        { key: 'passing', label: 'Passspiel' },
                        { key: 'vision', label: 'Spielübersicht' },
                        { key: 'dribbling', label: 'Dribbling' },
                        { key: 'tackling', label: 'Zweikampf' },
                        { key: 'positioning', label: 'Positionsspiel' },
                        { key: 'shooting', label: 'Schuss' },
                        { key: 'creativity', label: 'Kreativität' },
                        { key: 'workRate', label: 'Arbeitsrate' }
                    ];
                } else {
                    skillFields = [
                        { key: 'shooting', label: 'Schuss' },
                        { key: 'dribbling', label: 'Dribbling' },
                        { key: 'pace', label: 'Geschwindigkeit' },
                        { key: 'positioning', label: 'Positionsspiel' },
                        { key: 'finishing', label: 'Abschluss' },
                        { key: 'composure', label: 'Ruhe am Ball' },
                        { key: 'offTheBall', label: 'Laufwege' },
                        { key: 'technique', label: 'Technik' }
                    ];
                }
                
                return (
                    <div>
                        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-800">Fähigkeiten bewerten</h3>
                                <div className="flex items-center text-gray-700">
                                    <FaStar className="text-amber-400 mr-2" />
                                    <span className="font-medium">Skill-Score: </span>
                                    <span className="ml-1">
                                        {formData.skills ? Math.round(Object.values(formData.skills).reduce((a, b) => a + b, 0) / Object.values(formData.skills).length) : '-'}/100
                                    </span>
                                </div>
                            </div>
                            <p className="text-sm text-gray-500 mb-4">
                                Bewerten Sie die Fähigkeiten des Spielers auf einer Skala von 0-100.
                                Diese Werte fließen direkt in den Gesamt-Score ein.
                            </p>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {skillFields.map(field => {
                                    const value = formData.skills && formData.skills[field.key] !== undefined
                                        ? formData.skills[field.key]
                                        : 50;
                                    
                                    return (
                                        <div key={field.key}>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                {field.label}: {value}
                                            </label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    value={value}
                                                    onChange={(e) => handleSkillChange(field.key, e.target.value)}
                                                    className="w-full"
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-lg shadow-sm p-4">
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Score-Auswirkung</h3>
                                <p className="text-sm text-gray-500">
                                    Der Spieler-Score wird aus verschiedenen Faktoren berechnet:
                                </p>
                            </div>
                            
                            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700 mb-4">
                                <li>Fähigkeiten (50%): Durchschnitt aller positionsspezifischen Skills</li>
                                <li>Physische Attribute (30%): Durchschnitt von Geschwindigkeit, Kraft, Beweglichkeit, etc.</li>
                                <li>Statistiken (15%): Leistungsdaten aus Spielen, positionsabhängig gewichtet</li>
                                <li>Entwicklungspotential (5%): Basierend auf dem Alter des Spielers</li>
                            </ul>
                            
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center">
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-sm"
                                        style={{
                                            background: playerScore >= 80 ? 'linear-gradient(90deg, #10b981 0%, #34d399 100%)' : 
                                                        playerScore >= 70 ? 'linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%)' : 
                                                        playerScore >= 50 ? 'linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%)' : 
                                                                        'linear-gradient(90deg, #ef4444 0%, #f87171 100%)'
                                        }}
                                    >
                                        {playerScore}
                                    </div>
                                    <div className="ml-3">
                                        <span className="block font-semibold">Aktueller Score</span>
                                        <span className={`text-sm ${scoreRating.color}`}>{scoreRating.text}</span>
                                    </div>
                                </div>
                                
                                <div className="text-sm text-gray-500">
                                    Änderungen in den Skills und anderen Attributen werden den Score direkt beeinflussen.
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'statistics':
                return (
                    <div>
                        <h3 className="font-medium text-gray-800 mb-4">Statistiken</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Spiele</label>
                                <input
                                    type="number"
                                    value={formData.stats?.games || 0}
                                    onChange={(e) => handleStatChange('games', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Minuten</label>
                                <input
                                    type="number"
                                    value={formData.stats?.minutesPlayed || 0}
                                    onChange={(e) => handleStatChange('minutesPlayed', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {formData.position === 'GK' ? (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Zu-Null-Spiele</label>
                                        <input
                                            type="number"
                                            value={formData.stats?.cleanSheets || 0}
                                            onChange={(e) => handleStatChange('cleanSheets', e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Paraden</label>
                                        <input
                                            type="number"
                                            value={formData.stats?.saves || 0}
                                            onChange={(e) => handleStatChange('saves', e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Parade-Quote (%)</label>
                                        <input
                                            type="number"
                                            value={formData.stats?.savesPercentage || 0}
                                            onChange={(e) => handleStatChange('savesPercentage', e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tore</label>
                                        <input
                                            type="number"
                                            value={formData.stats?.goals || 0}
                                            onChange={(e) => handleStatChange('goals', e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Vorlagen</label>
                                        <input
                                            type="number"
                                            value={formData.stats?.assists || 0}
                                            onChange={(e) => handleStatChange('assists', e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Gelbe Karten</label>
                                <input
                                    type="number"
                                    value={formData.stats?.yellowCards || 0}
                                    onChange={(e) => handleStatChange('yellowCards', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Rote Karten</label>
                                <input
                                    type="number"
                                    value={formData.stats?.redCards || 0}
                                    onChange={(e) => handleStatChange('redCards', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>
                );

            case 'injuries':
                return (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-medium text-gray-800">Verletzungshistorie</h3>
                            <button
                                type="button"
                                onClick={handleAddInjury}
                                className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700"
                            >
                                + Verletzung hinzufügen
                            </button>
                        </div>

                        {formData.injuries && formData.injuries.map((injury, index) => (
                            <div key={index} className="bg-gray-50 p-4 rounded-lg mb-4">
                                <div className="flex justify-between mb-2">
                                    <h4 className="font-medium">Verletzung #{index + 1}</h4>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveInjury(index)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <FaTimes />
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Art der Verletzung</label>
                                        <input
                                            type="text"
                                            value={injury.type}
                                            onChange={(e) => handleInjuryChange(index, 'type', e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Datum</label>
                                        <input
                                            type="text"
                                            placeholder="TT.MM.JJJJ"
                                            value={injury.date}
                                            onChange={(e) => handleInjuryChange(index, 'date', e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Dauer</label>
                                        <input
                                            type="text"
                                            value={injury.duration}
                                            onChange={(e) => handleInjuryChange(index, 'duration', e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                        <select
                                            value={injury.status}
                                            onChange={(e) => handleInjuryChange(index, 'status', e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="Aktiv">Aktiv</option>
                                            <option value="Erholt">Erholt</option>
                                            <option value="In Behandlung">In Behandlung</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {(!formData.injuries || formData.injuries.length === 0) && (
                            <p className="text-gray-500 text-center py-4">
                                Keine Verletzungen dokumentiert
                            </p>
                        )}
                    </div>
                );

            case 'development':
                return (
                    <div>
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-medium text-gray-800">Entwicklungsziele</h3>
                                <button
                                    type="button"
                                    onClick={handleAddDevelopmentGoal}
                                    className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700"
                                >
                                    + Ziel hinzufügen
                                </button>
                            </div>
                            
                            {formData.development?.goals?.map((goal, index) => (
                                <div key={index} className="flex items-center mb-2">
                                    <input
                                        type="text"
                                        value={goal}
                                        onChange={(e) => handleDevelopmentGoalChange(index, e.target.value)}
                                        className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveDevelopmentGoal(index)}
                                        className="ml-2 text-red-500 hover:text-red-700"
                                    >
                                        <FaTimes />
                                    </button>
                                </div>
                            ))}
                            
                            {(!formData.development?.goals || formData.development.goals.length === 0) && (
                                <p className="text-gray-500 text-center py-4">
                                    Keine Entwicklungsziele definiert
                                </p>
                            )}
                        </div>

                        <div>
                            <h3 className="font-medium text-gray-800 mb-4">Spezielles Trainingsprogramm</h3>
                            <textarea
                                value={formData.training?.specialProgram || ''}
                                onChange={(e) => handleNestedInputChange('training', 'specialProgram', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                                placeholder="Beschreiben Sie das spezielle Trainingsprogramm für diesen Spieler..."
                            ></textarea>
                        </div>
                    </div>
                );

            case 'personal':
                return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">E-Mail</label>
                            <input
                                type="email"
                                value={formData.personalInfo?.email || ''}
                                onChange={(e) => handleNestedInputChange('personalInfo', 'email', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                            <input
                                type="text"
                                value={formData.personalInfo?.phone || ''}
                                onChange={(e) => handleNestedInputChange('personalInfo', 'phone', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Notfallkontakt</label>
                            <input
                                type="text"
                                value={formData.personalInfo?.emergencyContact || ''}
                                onChange={(e) => handleNestedInputChange('personalInfo', 'emergencyContact', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Schule/Ausbildung</label>
                            <input
                                type="text"
                                value={formData.personalInfo?.school || ''}
                                onChange={(e) => handleNestedInputChange('personalInfo', 'school', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bevorzugter Fuß</label>
                            <select
                                value={formData.personalInfo?.preferredFoot || ''}
                                onChange={(e) => handleNestedInputChange('personalInfo', 'preferredFoot', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="Rechts">Rechts</option>
                                <option value="Links">Links</option>
                                <option value="Beidfüßig">Beidfüßig</option>
                            </select>
                        </div>
                    </div>
                );

            case 'notes':
                return (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-medium text-gray-800">Trainernotizen</h3>
                            <button
                                type="button"
                                onClick={handleAddNote}
                                className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700"
                            >
                                + Notiz hinzufügen
                            </button>
                        </div>

                        {formData.notes && formData.notes.map((note, index) => (
                            <div key={index} className="bg-gray-50 p-4 rounded-lg mb-4">
                                <div className="flex justify-between mb-2">
                                    <h4 className="font-medium">Notiz vom {note.date}</h4>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveNote(index)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <FaTimes />
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Autor</label>
                                        <input
                                            type="text"
                                            value={note.author}
                                            onChange={(e) => handleNoteChange(index, 'author', e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Notiz</label>
                                        <textarea
                                            value={note.text}
                                            onChange={(e) => handleNoteChange(index, 'text', e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                                            placeholder="Notiz eingeben..."
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {(!formData.notes || formData.notes.length === 0) && (
                            <p className="text-gray-500 text-center py-4">
                                Keine Notizen vorhanden
                            </p>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="container mx-auto py-8 px-4 max-w-7xl">
                    <div className="animate-pulse">
                        <div className="h-10 w-1/4 bg-gray-200 rounded mb-6"></div>
                        <div className="h-64 bg-gray-200 rounded-xl mb-6"></div>
                    </div>
                </div>
            </Layout>
        );
    }

    if (!player) {
        return (
            <Layout>
                <div className="container mx-auto py-8 px-4 max-w-7xl">
                    <div className="bg-white rounded-xl p-10 flex flex-col items-center justify-center shadow-sm">
                        <h3 className="text-xl font-medium text-gray-700">Spieler nicht gefunden</h3>
                        <p className="text-gray-500 text-center mt-2">
                            Der gesuchte Spieler konnte nicht gefunden werden.
                        </p>
                        <button 
                            onClick={() => navigate('/team/players')} 
                            className="mt-6 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            <FaArrowLeft size={14} /> Zurück zur Spielerliste
                        </button>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container mx-auto py-8 px-4 max-w-7xl">
                <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-800">
                            Spieler bearbeiten: {formData.name}
                        </h1>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center text-gray-700">
                                <FaStar className="text-amber-400 mr-2" /> 
                                <span className="font-semibold">Score: </span>
                                <span className={`ml-1 ${scoreRating.color}`}>{playerScore} ({scoreRating.text})</span>
                            </div>
                            <button
                                onClick={() => navigate(`/team/players/${id}`)}
                                className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                            >
                                <FaTimes /> Abbrechen
                            </button>
                            <button
                                onClick={savePlayer}
                                disabled={isSaving}
                                className={`px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                <FaSave /> {isSaving ? 'Speichern...' : 'Speichern'}
                            </button>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Basic player information */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
                        <div className="p-6 flex items-center justify-between border-b border-gray-100">
                            <h1 className="text-2xl font-bold text-gray-800">{player.name} bearbeiten</h1>
                            <button
                                type="submit"
                                disabled={isSaving}
                                className={`px-4 py-2 ${isSaving ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} text-white font-medium rounded-lg transition-colors flex items-center gap-2`}
                            >
                                <FaSave /> {isSaving ? 'Wird gespeichert...' : 'Änderungen speichern'}
                            </button>
                        </div>
                        
                        <div className="p-6">
                            {/* Tab navigation */}
                            <div className="mb-6 border-b border-gray-200">
                                <nav className="-mb-px flex space-x-8 overflow-x-auto">
                                    <button 
                                        type="button"
                                        onClick={() => setActiveTab('basic')} 
                                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'basic' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                                    >
                                        Grunddaten
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => setActiveTab('physicalAttributes')} 
                                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'physicalAttributes' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                                    >
                                        Körperliche Attribute
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => setActiveTab('skills')} 
                                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'skills' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                                    >
                                        Fähigkeiten
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => setActiveTab('statistics')} 
                                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'statistics' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                                    >
                                        Statistiken
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => setActiveTab('injuries')} 
                                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'injuries' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                                    >
                                        Verletzungen
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => setActiveTab('development')} 
                                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'development' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                                    >
                                        Entwicklung
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => setActiveTab('personal')} 
                                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'personal' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                                    >
                                        Persönliches
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => setActiveTab('notes')} 
                                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'notes' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                                    >
                                        Notizen
                                    </button>
                                </nav>
                            </div>

                            {/* Tab content */}
                            {renderTabContent()}
                        </div>
                    </div>

                    <div className="flex justify-between mt-6">
                        <button
                            type="button"
                            onClick={() => navigate(`/team/players/${id}`)}
                            className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
                        >
                            <FaTimes /> Abbrechen
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className={`px-4 py-2 ${isSaving ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} text-white font-medium rounded-lg transition-colors flex items-center gap-2`}
                        >
                            <FaSave /> {isSaving ? 'Wird gespeichert...' : 'Änderungen speichern'}
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    );
};

export default PlayerEdit;
