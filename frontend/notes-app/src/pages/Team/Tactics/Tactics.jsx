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
import { getAllTactics, createFromTemplate, deleteTactic, createTactic } from '../../../utils/tacticsService';

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
    ];    useEffect(() => {
        fetchTactics();
    }, []);

    const fetchTactics = async () => {
        try {
            setLoading(true);
            const response = await getAllTactics({ includeTemplates: 'true' });
            if (response.error) {
                console.error('Error fetching tactics:', response.message);
                setTactics([]);
            } else {
                setTactics(response.tactics || []);
            }
        } catch (error) {
            console.error('Error fetching tactics:', error);
            setTactics([]);
        } finally {
            setLoading(false);
        }
    };    const handleCreateTactic = async (template) => {
        try {
            if (template.isTemplate) {
                // Create from template
                const response = await createFromTemplate(template.id, {
                    name: `${template.name} - Kopie`,
                    matchId: matchId
                });
                if (!response.error) {
                    await fetchTactics(); // Refresh list
                    console.log('Taktik aus Vorlage erstellt:', response.tactic);
                }
            } else {
                // Create new custom tactic
                const newTacticData = {
                    ...template,
                    matchId: matchId,
                    name: template.name || 'Neue Taktik'
                };
                const response = await createTactic(newTacticData);
                if (!response.error) {
                    await fetchTactics(); // Refresh list
                    console.log('Neue Taktik erstellt:', response.tactic);
                }
            }
        } catch (error) {
            console.error('Error creating tactic:', error);
        }
    };

    const handleDeleteTactic = async (tacticId) => {
        if (window.confirm('Möchten Sie diese Taktik wirklich löschen?')) {
            try {
                const response = await deleteTactic(tacticId);
                if (!response.error) {
                    await fetchTactics(); // Refresh list
                    console.log('Taktik gelöscht:', tacticId);
                }
            } catch (error) {
                console.error('Error deleting tactic:', error);
            }
        }
    };

    const getCategoryColor = (category) => {
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
            <div className="min-h-screen bg-gray-50 p-6">
                <PageHeader
                    title="Taktik-Management"
                    subtitle={matchId ? 'Taktiken für das ausgewählte Spiel' : 'Verwalte alle taktischen Konzepte'}
                    icon={FaDrawPolygon}
                    actions={
                        <div className="flex gap-3">
                            <Button 
                                variant="secondary" 
                                icon={FaFilter}
                            >
                                Filter
                            </Button>
                            <Button 
                                variant="primary" 
                                icon={FaPlus}
                                onClick={() => setShowAddTactic(true)}
                            >
                                Neue Taktik
                            </Button>
                        </div>
                    }
                />

                {/* Taktik-Statistiken */}
                <StatsGrid stats={tacticStats} />

                {/* Filter-Leiste */}
                <Card className="p-4 mb-6">
                    <div className="flex flex-wrap gap-2 items-center">
                        <span className="text-sm font-medium text-gray-700 mr-2">Kategorie:</span>
                        {categories.map(category => (
                            <Button
                                key={category}
                                variant={filterCategory === category ? "primary" : "ghost"}
                                size="sm"
                                onClick={() => setFilterCategory(category)}
                            >
                                {category === 'all' ? 'Alle' : category}
                            </Button>
                        ))}
                    </div>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Taktik-Liste */}
                    <div className="lg:col-span-2">
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <FaFutbol className="text-blue-500" />
                                Verfügbare Taktiken
                            </h3>
                            
                            {filteredTactics.length === 0 ? (
                                <EmptyState
                                    icon={FaDrawPolygon}
                                    title="Keine Taktiken gefunden"
                                    description="Erstelle deine erste Taktik oder passe die Filter an"
                                    action={
                                        <Button 
                                            variant="primary" 
                                            icon={FaPlus}
                                            onClick={() => setShowAddTactic(true)}
                                        >
                                            Erste Taktik erstellen
                                        </Button>
                                    }
                                />
                            ) : (
                                <div className="space-y-3">
                                    {filteredTactics.map(tactic => {
                                        const Icon = tactic.icon;
                                        return (
                                            <div 
                                                key={tactic.id}
                                                className={`
                                                    p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md
                                                    ${selectedTactic?.id === tactic.id 
                                                        ? 'border-blue-500 bg-blue-50' 
                                                        : 'border-gray-200 hover:border-gray-300'
                                                    }
                                                `}
                                                onClick={() => setSelectedTactic(tactic)}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`
                                                            w-10 h-10 rounded-lg flex items-center justify-center text-white
                                                            ${tactic.color === 'red' ? 'bg-red-500' : ''}
                                                            ${tactic.color === 'green' ? 'bg-green-500' : ''}
                                                            ${tactic.color === 'blue' ? 'bg-blue-500' : ''}
                                                            ${tactic.color === 'purple' ? 'bg-purple-500' : ''}
                                                            ${tactic.color === 'orange' ? 'bg-orange-500' : ''}
                                                            ${tactic.color === 'gray' ? 'bg-gray-500' : ''}
                                                        `}>
                                                            <Icon />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-medium text-gray-900">
                                                                {tactic.name}
                                                            </h4>
                                                            <p className="text-sm text-gray-600">
                                                                {tactic.description}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant={getCategoryColor(tactic.category)}>
                                                            {tactic.category}
                                                        </Badge>
                                                        <div className="flex gap-1">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                icon={FaEye}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setSelectedTactic(tactic);
                                                                }}
                                                            />
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                icon={FaEdit}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setEditingTactic(tactic);
                                                                }}
                                                            />
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                icon={FaTrash}
                                                                className="text-red-600 hover:text-red-700"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    // Handle delete
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </Card>
                    </div>

                    {/* Taktik-Details */}
                    <div>
                        {showAddTactic ? (
                            <Card className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Taktik-Templates
                                    </h3>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setShowAddTactic(false)}
                                    >
                                        ×
                                    </Button>
                                </div>
                                <div className="space-y-3">
                                    {tacticTemplates.map(template => {
                                        const Icon = template.icon;
                                        return (
                                            <button
                                                key={template.id}
                                                onClick={() => handleCreateTactic(template)}
                                                className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`
                                                        w-8 h-8 rounded-full flex items-center justify-center text-white
                                                        ${template.color === 'red' ? 'bg-red-500' : ''}
                                                        ${template.color === 'green' ? 'bg-green-500' : ''}
                                                        ${template.color === 'blue' ? 'bg-blue-500' : ''}
                                                        ${template.color === 'purple' ? 'bg-purple-500' : ''}
                                                        ${template.color === 'orange' ? 'bg-orange-500' : ''}
                                                        ${template.color === 'gray' ? 'bg-gray-500' : ''}
                                                    `}>
                                                        <Icon className="text-sm" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">
                                                            {template.name}
                                                        </p>
                                                        <p className="text-xs text-gray-600">
                                                            {template.category}
                                                        </p>
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </Card>
                        ) : selectedTactic ? (
                            <Card className="p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`
                                        w-12 h-12 rounded-lg flex items-center justify-center text-white
                                        ${selectedTactic.color === 'red' ? 'bg-red-500' : ''}
                                        ${selectedTactic.color === 'green' ? 'bg-green-500' : ''}
                                        ${selectedTactic.color === 'blue' ? 'bg-blue-500' : ''}
                                        ${selectedTactic.color === 'purple' ? 'bg-purple-500' : ''}
                                        ${selectedTactic.color === 'orange' ? 'bg-orange-500' : ''}
                                        ${selectedTactic.color === 'gray' ? 'bg-gray-500' : ''}
                                    `}>
                                        <selectedTactic.icon className="text-lg" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {selectedTactic.name}
                                        </h3>
                                        <Badge variant={getCategoryColor(selectedTactic.category)}>
                                            {selectedTactic.category}
                                        </Badge>
                                    </div>
                                </div>

                                <p className="text-gray-600 mb-4">
                                    {selectedTactic.description}
                                </p>

                                <div className="mb-6">
                                    <h4 className="font-medium text-gray-900 mb-2">Wichtige Punkte:</h4>
                                    <ul className="space-y-2">
                                        {selectedTactic.keyPoints.map((point, index) => (
                                            <li key={index} className="flex items-start gap-2">
                                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                                <span className="text-sm text-gray-700">{point}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="flex gap-2">
                                    <Button 
                                        variant="primary" 
                                        icon={FaPlay}
                                        className="flex-1"
                                    >
                                        Anwenden
                                    </Button>
                                    <Button 
                                        variant="secondary" 
                                        icon={FaEdit}
                                        onClick={() => setEditingTactic(selectedTactic)}
                                    >
                                        Bearbeiten
                                    </Button>
                                </div>
                            </Card>
                        ) : (
                            <Card className="p-6 text-center">
                                <EmptyState
                                    icon={FaDrawPolygon}
                                    title="Taktik auswählen"
                                    description="Wählen Sie eine Taktik aus der Liste, um Details zu sehen"
                                    action={
                                        <Button
                                            variant="primary"
                                            icon={FaPlus}
                                            onClick={() => setShowAddTactic(true)}
                                        >
                                            Neue Taktik erstellen
                                        </Button>
                                    }
                                />
                            </Card>
                        )}
                    </div>
                </div>

                {/* Taktiktafel */}
                <Card className="p-6 mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <FaDrawPolygon className="text-green-500" />
                        Interaktive Taktiktafel
                    </h3>
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <FaFutbol className="mx-auto text-6xl text-gray-400 mb-4" />
                        <h4 className="text-xl font-semibold text-gray-600 mb-2">
                            Zeichentafel
                        </h4>
                        <p className="text-gray-500 mb-6">
                            Hier können Sie bald Spielzüge zeichnen und visualisieren
                        </p>
                        <Button 
                            variant="success" 
                            icon={FaDrawPolygon}
                        >
                            Zur Zeichentafel
                        </Button>
                    </div>
                </Card>
            </div>
        </Layout>
    );
};

export default Tactics;
