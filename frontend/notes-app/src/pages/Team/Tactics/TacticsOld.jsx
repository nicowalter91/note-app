import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../../../components/Layout/Layout';
import { PageHeader, Card, Button, Badge, StatsGrid, LoadingSpinner, EmptyState } from '../../../components/UI/DesignSystem';
import { 
    FaDrawPolygon, 
    FaPlus, 
    FaPlay, 
    FaSave, 
    FaEdit, 
    FaTrash,
    FaFutbol,
    FaUsers,
    FaArrowRight,
    FaArrowUp,
    FaArrowDown,
    FaCircle,
    FaFilter,
    FaEye
} from 'react-icons/fa';
import axiosInstance from '../../../utils/axiosInstance';

const Tactics = () => {
    const [searchParams] = useSearchParams();
    const matchId = searchParams.get('match');
    
    const [tactics, setTactics] = useState([]);
    const [selectedTactic, setSelectedTactic] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAddTactic, setShowAddTactic] = useState(false);
    const [editingTactic, setEditingTactic] = useState(null);
    const [filterCategory, setFilterCategory] = useState('all');

    // Tactical Templates
    const tacticTemplates = [
        {
            id: 'pressing',
            name: 'Gegenpressing',
            category: 'Defensiv',
            description: 'Sofortiges Pressing nach Ballverlust',
            color: 'red',
            icon: FaUsers,
            keyPoints: [
                'Schnelle Anlaufwege nach Ballverlust',
                'Kompakte Mannschaftsformation',
                'Aggressive Zweikampfführung',
                'Kurze Passwege blockieren'
            ]
        },
        {
            id: 'counter',
            name: 'Konterangriff',
            category: 'Offensiv',
            description: 'Schnelle Umschaltung nach Ballgewinn',
            color: 'green',
            icon: FaArrowRight,
            keyPoints: [
                'Direktes Spiel in die Tiefe',
                'Schnelle Flügelspieler nutzen',
                'Vertikale Passwege suchen',
                'Überzahlsituationen schaffen'
            ]
        },
        {
            id: 'possession',
            name: 'Ballbesitzspiel',
            category: 'Aufbau',
            description: 'Kontrollierter Spielaufbau mit viel Ballbesitz',
            color: 'blue',
            icon: FaCircle,
            keyPoints: [
                'Kurze, sichere Pässe',
                'Geduld im Spielaufbau',
                'Breite Staffelung',
                'Rückpass als Option'
            ]
        },
        {
            id: 'wing_play',
            name: 'Flügelspiel',
            category: 'Offensiv',
            description: 'Angriffe über die Außenbahnen',
            color: 'purple',
            icon: FaArrowUp,
            keyPoints: [
                'Schnelle Außenspieler',
                'Flanken und Hereingaben',
                'Überlappende Läufe',
                'Zentrale Abnehmer'
            ]
        },
        {
            id: 'park_bus',
            name: 'Defensiv-Block',
            category: 'Defensiv',
            description: 'Kompakte Defensive mit tiefer Linie',
            color: 'gray',
            icon: FaUsers,
            keyPoints: [
                'Tiefe Defensive Linie',
                'Zentrale Verdichtung',
                'Wenig Räume anbieten',
                'Konter aus der Defensive'
            ]
        },
        {
            id: 'high_line',
            name: 'Hohe Linie',
            category: 'Defensiv',
            description: 'Hohe Abwehrlinie mit Offside-Falle',
            color: 'orange',
            icon: FaArrowUp,
            keyPoints: [
                'Synchrone Abwehrbewegung',
                'Offside-Falle stellen',
                'Frühe Balleroberung',
                'Kurze Wege zum Tor'
            ]
        }
    ];

    useEffect(() => {
        fetchTactics();
    }, []);

    const fetchTactics = async () => {
        try {
            setLoading(true);
            // Hier würde normalerweise die Taktik-API aufgerufen werden
            // Vorerst verwenden wir Mock-Daten basierend auf den Templates
            const mockTactics = tacticTemplates.map((template, index) => ({
                id: index + 1,
                ...template,
                created: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
                matchId: Math.random() > 0.5 ? matchId : null
            }));
            setTactics(mockTactics);
        } catch (err) {
            console.error('Fehler beim Laden der Taktiken:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTactic = (template) => {
        const newTactic = {
            ...template,
            id: Date.now(),
            created: new Date(),
            matchId: matchId,
            customNotes: ''
        };
        setTactics(prev => [newTactic, ...prev]);
        setSelectedTactic(newTactic);
        setShowAddTactic(false);
    };    const getCategoryColor = (category) => {
        switch (category) {
            case 'Offensiv': return 'success';
            case 'Defensiv': return 'danger';
            case 'Aufbau': return 'primary';
            default: return 'secondary';
        }
    };

    const filteredTactics = filterCategory === 'all' 
        ? tactics 
        : tactics.filter(tactic => tactic.category === filterCategory);

    const tacticStats = [
        {
            label: 'Gesamt Taktiken',
            value: tactics.length.toString(),
            icon: FaDrawPolygon,
            color: 'blue'
        },
        {
            label: 'Offensive Taktiken',
            value: tactics.filter(t => t.category === 'Offensiv').length.toString(),
            icon: FaArrowUp,
            color: 'green'
        },
        {
            label: 'Defensive Taktiken',
            value: tactics.filter(t => t.category === 'Defensiv').length.toString(),
            icon: FaUsers,
            color: 'red'
        },
        {
            label: 'Aufbau Taktiken',
            value: tactics.filter(t => t.category === 'Aufbau').length.toString(),
            icon: FaCircle,
            color: 'purple'
        }
    ];

    const categories = ['all', 'Offensiv', 'Defensiv', 'Aufbau'];

    if (loading) {
        return (
            <Layout>
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <LoadingSpinner size="lg" />
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container mx-auto px-4 py-6">
                {/* Header */}
                <div className="mb-8 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-xl p-6 shadow-md">
                    <div className="flex items-center justify-between">                        <div>
                            <div className="flex items-center space-x-2 mb-1">
                                <FaDrawPolygon className="text-2xl" />
                                <h2 className="text-lg font-medium opacity-90">Taktische Planung</h2>
                            </div>
                            <h1 className="text-3xl font-bold mb-2">Spielzüge & Taktiken</h1>
                            <p className="opacity-90">
                                {matchId ? 'Taktiken für das ausgewählte Spiel' : 'Verwalte alle taktischen Konzepte'}
                            </p>
                        </div>
                        <button 
                            onClick={() => setShowAddTactic(true)}
                            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                        >
                            <FaPlus />
                            <span>Neue Taktik</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Tactics List */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
                            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">                                <h3 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
                                    <FaDrawPolygon className="text-purple-500 mr-2" />
                                    Verfügbare Taktiken
                                </h3>
                            </div>
                            <div className="p-6">
                                {tactics.length === 0 ? (                                    <div className="text-center py-12">
                                        <FaDrawPolygon className="mx-auto text-6xl text-gray-400 mb-4" />
                                        <h4 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
                                            Keine Taktiken vorhanden
                                        </h4>
                                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                                            Erstellen Sie Ihre erste Taktik aus den verfügbaren Templates
                                        </p>
                                        <button
                                            onClick={() => setShowAddTactic(true)}
                                            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg transition-colors flex items-center space-x-2 mx-auto"
                                        >
                                            <FaPlus />
                                            <span>Erste Taktik erstellen</span>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {tactics.map(tactic => {
                                            const Icon = tactic.icon;
                                            return (
                                                <div
                                                    key={tactic.id}
                                                    onClick={() => setSelectedTactic(tactic)}
                                                    className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                                                        selectedTactic?.id === tactic.id
                                                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                                                            : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                                                    }`}
                                                >
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div className="flex items-center space-x-3">
                                                            <div className={`w-10 h-10 rounded-full bg-${tactic.color}-100 dark:bg-${tactic.color}-900 flex items-center justify-center`}>
                                                                <Icon className={`text-${tactic.color}-600 dark:text-${tactic.color}-400`} />
                                                            </div>
                                                            <div>
                                                                <h4 className="font-semibold text-gray-800 dark:text-white">
                                                                    {tactic.name}
                                                                </h4>
                                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(tactic.category)}`}>
                                                                    {tactic.category}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        {tactic.matchId === matchId && (
                                                            <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 rounded-full text-xs font-medium">
                                                                Aktiv
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                                                        {tactic.description}
                                                    </p>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                                            {tactic.keyPoints.length} Schlüsselpunkte
                                                        </span>
                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setEditingTactic(tactic);
                                                                }}
                                                                className="text-gray-400 hover:text-blue-600 transition-colors"
                                                            >
                                                                <FaEdit className="text-sm" />
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    // Handle delete
                                                                }}
                                                                className="text-gray-400 hover:text-red-600 transition-colors"
                                                            >
                                                                <FaTrash className="text-sm" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Tactic Detail/Templates Sidebar */}
                    <div>
                        {selectedTactic ? (
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                                        {selectedTactic.name}
                                    </h3>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(selectedTactic.category)}`}>
                                        {selectedTactic.category}
                                    </span>
                                </div>
                                
                                <p className="text-gray-600 dark:text-gray-300 mb-6">
                                    {selectedTactic.description}
                                </p>

                                <div className="mb-6">
                                    <h4 className="font-semibold text-gray-800 dark:text-white mb-3">
                                        Schlüsselpunkte:
                                    </h4>
                                    <ul className="space-y-2">
                                        {selectedTactic.keyPoints.map((point, index) => (
                                            <li key={index} className="flex items-start space-x-2">
                                                <FaPlay className="text-green-500 text-xs mt-1 flex-shrink-0" />
                                                <span className="text-sm text-gray-600 dark:text-gray-300">{point}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {matchId && (
                                    <div className="border-t pt-4">
                                        <button className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg transition-colors flex items-center justify-center space-x-2">
                                            <FaSave />
                                            <span>Für Spiel übernehmen</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : showAddTactic ? (
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                                        Taktik-Templates
                                    </h3>
                                    <button
                                        onClick={() => setShowAddTactic(false)}
                                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                    >
                                        ×
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {tacticTemplates.map(template => {
                                        const Icon = template.icon;
                                        return (
                                            <button
                                                key={template.id}
                                                onClick={() => handleCreateTactic(template)}
                                                className="w-full text-left border border-gray-200 dark:border-gray-600 rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <div className={`w-8 h-8 rounded-full bg-${template.color}-100 dark:bg-${template.color}-900 flex items-center justify-center`}>
                                                        <Icon className={`text-${template.color}-600 dark:text-${template.color}-400 text-sm`} />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-800 dark:text-white">
                                                            {template.name}
                                                        </p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            {template.category}
                                                        </p>
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
                                <div className="text-center py-8">
                                    <FaDrawPolygon className="mx-auto text-4xl text-gray-400 mb-4" />
                                    <h4 className="font-semibold text-gray-600 dark:text-gray-300 mb-2">
                                        Taktik auswählen
                                    </h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                        Wählen Sie eine Taktik aus der Liste, um Details zu sehen
                                    </p>
                                    <button
                                        onClick={() => setShowAddTactic(true)}
                                        className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors"
                                    >
                                        Neue Taktik erstellen
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Drawing Canvas Placeholder */}
                <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
                            <FaDrawPolygon className="text-green-500 mr-2" />
                            Taktiktafel
                        </h3>
                    </div>
                    <div className="p-6">
                        <div className="text-center py-12">
                            <FaFutbol className="mx-auto text-6xl text-gray-400 mb-4" />
                            <h4 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
                                Interaktive Taktiktafel
                            </h4>
                            <p className="text-gray-500 dark:text-gray-400 mb-6">
                                Hier können Sie bald Spielzüge zeichnen und visualisieren
                            </p>
                            <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors">
                                Zur Zeichentafel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Tactics;
