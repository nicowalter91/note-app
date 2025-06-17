import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../../../components/Layout/Layout';
import { PageHeader, Card, Button, Badge, LoadingSpinner, EmptyState } from '../../../components/UI/DesignSystem';
import { 
    FaUserPlus, 
    FaSave, 
    FaUndo, 
    FaRedo, 
    FaShareAlt, 
    FaPrint, 
    FaArrowLeft,
    FaUsers,
    FaFutbol,
    FaCog,
    FaEye,
    FaGrid3X3
} from 'react-icons/fa';
import { HiOutlineSwitchHorizontal } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utils/axiosInstance';

const Formation = () => {
    const navigate = useNavigate();
    const [players, setPlayers] = useState([]);
    const [selectedFormation, setSelectedFormation] = useState('4-4-2');
    const [selectedPlayers, setSelectedPlayers] = useState({});
    const [positions, setPositions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showGrid, setShowGrid] = useState(false);
    const [snapToGrid, setSnapToGrid] = useState(false);
    const [formationName, setFormationName] = useState('Neue Formation');
    const [savedFormations, setSavedFormations] = useState([]);
    
    // Verfügbare Formationen
    const formations = [
        { id: '4-4-2', name: '4-4-2 Standard', positions: 11 },
        { id: '4-3-3', name: '4-3-3 Offensiv', positions: 11 },
        { id: '3-5-2', name: '3-5-2 Mittelfeld', positions: 11 },
        { id: '5-3-2', name: '5-3-2 Defensiv', positions: 11 },
        { id: '4-2-3-1', name: '4-2-3-1 Flexibel', positions: 11 }
    ];

    // Formation-Positionen definieren
    const getPositionsForFormation = (formationId) => {
        switch(formationId) {
            case '4-4-2':
                return [
                    { id: 'gk', name: 'TW', x: 50, y: 90, playerId: null, color: 'yellow' },
                    { id: 'lb', name: 'LV', x: 20, y: 70, playerId: null, color: 'blue' },
                    { id: 'cb1', name: 'IV', x: 35, y: 75, playerId: null, color: 'blue' },
                    { id: 'cb2', name: 'IV', x: 65, y: 75, playerId: null, color: 'blue' },
                    { id: 'rb', name: 'RV', x: 80, y: 70, playerId: null, color: 'blue' },
                    { id: 'lm', name: 'LM', x: 20, y: 45, playerId: null, color: 'green' },
                    { id: 'cm1', name: 'ZM', x: 35, y: 40, playerId: null, color: 'green' },
                    { id: 'cm2', name: 'ZM', x: 65, y: 40, playerId: null, color: 'green' },
                    { id: 'rm', name: 'RM', x: 80, y: 45, playerId: null, color: 'green' },
                    { id: 'st1', name: 'ST', x: 40, y: 20, playerId: null, color: 'red' },
                    { id: 'st2', name: 'ST', x: 60, y: 20, playerId: null, color: 'red' }
                ];
            case '4-3-3':
                return [
                    { id: 'gk', name: 'TW', x: 50, y: 90, playerId: null, color: 'yellow' },
                    { id: 'lb', name: 'LV', x: 20, y: 70, playerId: null, color: 'blue' },
                    { id: 'cb1', name: 'IV', x: 35, y: 75, playerId: null, color: 'blue' },
                    { id: 'cb2', name: 'IV', x: 65, y: 75, playerId: null, color: 'blue' },
                    { id: 'rb', name: 'RV', x: 80, y: 70, playerId: null, color: 'blue' },
                    { id: 'dm', name: 'DM', x: 50, y: 55, playerId: null, color: 'green' },
                    { id: 'cm1', name: 'ZM', x: 35, y: 40, playerId: null, color: 'green' },
                    { id: 'cm2', name: 'ZM', x: 65, y: 40, playerId: null, color: 'green' },
                    { id: 'lw', name: 'LF', x: 20, y: 20, playerId: null, color: 'red' },
                    { id: 'st', name: 'ST', x: 50, y: 15, playerId: null, color: 'red' },
                    { id: 'rw', name: 'RF', x: 80, y: 20, playerId: null, color: 'red' }
                ];
            case '3-5-2':
                return [
                    { id: 'gk', name: 'TW', x: 50, y: 90, playerId: null, color: 'yellow' },
                    { id: 'cb1', name: 'IV', x: 30, y: 75, playerId: null, color: 'blue' },
                    { id: 'cb2', name: 'IV', x: 50, y: 80, playerId: null, color: 'blue' },
                    { id: 'cb3', name: 'IV', x: 70, y: 75, playerId: null, color: 'blue' },
                    { id: 'lwb', name: 'LWB', x: 10, y: 50, playerId: null, color: 'green' },
                    { id: 'cm1', name: 'ZM', x: 30, y: 45, playerId: null, color: 'green' },
                    { id: 'cm2', name: 'ZM', x: 50, y: 40, playerId: null, color: 'green' },
                    { id: 'cm3', name: 'ZM', x: 70, y: 45, playerId: null, color: 'green' },
                    { id: 'rwb', name: 'RWB', x: 90, y: 50, playerId: null, color: 'green' },
                    { id: 'st1', name: 'ST', x: 40, y: 20, playerId: null, color: 'red' },
                    { id: 'st2', name: 'ST', x: 60, y: 20, playerId: null, color: 'red' }
                ];
            default:
                return [];
        }
    };

    useEffect(() => {
        setPositions(getPositionsForFormation(selectedFormation));
    }, [selectedFormation]);

    useEffect(() => {
        fetchPlayers();
    }, []);

    const fetchPlayers = async () => {
        try {
            setLoading(true);
            // Mock-Daten für die Demo
            const dummyPlayers = [
                { id: 1, name: 'Manuel Neuer', position: 'GK', number: 1 },
                { id: 2, name: 'Joshua Kimmich', position: 'RB', number: 6 },
                { id: 3, name: 'Niklas Süle', position: 'CB', number: 4 },
                { id: 4, name: 'David Alaba', position: 'CB', number: 27 },
                { id: 5, name: 'Alphonso Davies', position: 'LB', number: 19 },
                { id: 6, name: 'Leon Goretzka', position: 'CM', number: 18 },
                { id: 7, name: 'Thomas Müller', position: 'AM', number: 25 },
                { id: 8, name: 'Serge Gnabry', position: 'RW', number: 7 },
                { id: 9, name: 'Leroy Sané', position: 'LW', number: 10 },
                { id: 10, name: 'Robert Lewandowski', position: 'ST', number: 9 },
                { id: 11, name: 'Kingsley Coman', position: 'LW', number: 29 },
                { id: 12, name: 'Marc-André ter Stegen', position: 'GK', number: 22 },
                { id: 13, name: 'Toni Kroos', position: 'CM', number: 8 },
                { id: 14, name: 'Kai Havertz', position: 'AM', number: 29 },
                { id: 15, name: 'Ilkay Gündogan', position: 'CM', number: 21 }
            ];
            setPlayers(dummyPlayers);
        } catch (error) {
            console.error('Fehler beim Laden der Spieler:', error);
            setPlayers([]);
        } finally {
            setLoading(false);
        }
    };

    const handleFormationChange = (formationId) => {
        setSelectedFormation(formationId);
        setSelectedPlayers({});
    };

    const assignPlayerToPosition = (positionId, playerId) => {
        setSelectedPlayers(prev => ({
            ...prev,
            [positionId]: playerId
        }));
    };

    const removePlayerFromPosition = (positionId) => {
        setSelectedPlayers(prev => {
            const updated = { ...prev };
            delete updated[positionId];
            return updated;
        });
    };

    const saveFormation = () => {
        const formation = {
            id: Date.now(),
            name: formationName,
            type: selectedFormation,
            players: selectedPlayers,
            created: new Date()
        };
        setSavedFormations(prev => [formation, ...prev]);
        // Hier würde normalerweise eine API-Anfrage zum Speichern gemacht
    };

    const getAssignedPlayers = () => {
        return Object.values(selectedPlayers).filter(Boolean);
    };

    const getAvailablePlayers = () => {
        const assignedPlayerIds = getAssignedPlayers();
        return players.filter(player => !assignedPlayerIds.includes(player.id));
    };

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
                    title="Formation & Aufstellung"
                    subtitle="Erstelle und verwalte Aufstellungen für dein Team"
                    icon={FaUsers}
                    actions={
                        <div className="flex gap-3">
                            <Button 
                                variant="secondary" 
                                icon={FaArrowLeft}
                                onClick={() => navigate('/team')}
                            >
                                Zurück
                            </Button>
                            <Button 
                                variant="secondary" 
                                icon={FaShareAlt}
                            >
                                Teilen
                            </Button>
                            <Button 
                                variant="primary" 
                                icon={FaSave}
                                onClick={saveFormation}
                            >
                                Speichern
                            </Button>
                        </div>
                    }
                />

                <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                    {/* Formation-Auswahl */}
                    <div className="xl:col-span-1">
                        <Card className="p-6 mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Formation</h3>
                            <div className="space-y-2">
                                {formations.map(formation => (
                                    <button
                                        key={formation.id}
                                        onClick={() => handleFormationChange(formation.id)}
                                        className={`
                                            w-full text-left p-3 rounded-lg border transition-colors
                                            ${selectedFormation === formation.id 
                                                ? 'border-blue-500 bg-blue-50' 
                                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                            }
                                        `}
                                    >
                                        <div className="font-medium text-gray-900">{formation.name}</div>
                                        <div className="text-sm text-gray-600">{formation.positions} Spieler</div>
                                    </button>
                                ))}
                            </div>
                        </Card>

                        {/* Einstellungen */}
                        <Card className="p-6 mb-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <FaCog className="text-gray-500" />
                                Einstellungen
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Formation Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formationName}
                                        onChange={(e) => setFormationName(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Formation benennen..."
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-700">Raster anzeigen</span>
                                    <button
                                        onClick={() => setShowGrid(!showGrid)}
                                        className={`
                                            relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                                            ${showGrid ? 'bg-blue-600' : 'bg-gray-200'}
                                        `}
                                    >
                                        <span
                                            className={`
                                                inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                                                ${showGrid ? 'translate-x-6' : 'translate-x-1'}
                                            `}
                                        />
                                    </button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-700">Einrasten</span>
                                    <button
                                        onClick={() => setSnapToGrid(!snapToGrid)}
                                        className={`
                                            relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                                            ${snapToGrid ? 'bg-blue-600' : 'bg-gray-200'}
                                        `}
                                    >
                                        <span
                                            className={`
                                                inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                                                ${snapToGrid ? 'translate-x-6' : 'translate-x-1'}
                                            `}
                                        />
                                    </button>
                                </div>
                            </div>
                        </Card>

                        {/* Verfügbare Spieler */}
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Verfügbare Spieler</h3>
                            <div className="space-y-2 max-h-96 overflow-y-auto">
                                {getAvailablePlayers().map(player => (
                                    <div
                                        key={player.id}
                                        className="flex items-center gap-3 p-2 rounded-lg border border-gray-200 hover:bg-gray-50"
                                    >
                                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                            {player.number}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {player.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {player.position}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* Spielfeld */}
                    <div className="xl:col-span-3">
                        <Card className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <FaFutbol className="text-green-500" />
                                    Spielfeld - {formations.find(f => f.id === selectedFormation)?.name}
                                </h3>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="sm" icon={FaGrid3X3}>
                                        Raster
                                    </Button>
                                    <Button variant="ghost" size="sm" icon={FaEye}>
                                        Vorschau
                                    </Button>
                                </div>
                            </div>

                            {/* Spielfeld-Container */}
                            <div className="relative bg-green-500 rounded-lg overflow-hidden" style={{ paddingBottom: '66.67%' }}>
                                {/* Spielfeld-Markierungen */}
                                <div className="absolute inset-0 bg-gradient-to-b from-green-400 to-green-600">
                                    {/* Mittellinie */}
                                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white opacity-70"></div>
                                    {/* Mittelkreis */}
                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-2 border-white rounded-full opacity-70"></div>
                                    {/* Strafraum */}
                                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-40 h-16 border-2 border-l-0 border-r-0 border-b-0 border-white opacity-70"></div>
                                    {/* Torraum */}
                                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-8 border-2 border-l-0 border-r-0 border-b-0 border-white opacity-70"></div>
                                    
                                    {/* Raster */}
                                    {showGrid && (
                                        <>
                                            {Array.from({ length: 11 }, (_, i) => (
                                                <div
                                                    key={`v-${i}`}
                                                    className="absolute top-0 bottom-0 w-px bg-white opacity-20"
                                                    style={{ left: `${i * 10}%` }}
                                                />
                                            ))}
                                            {Array.from({ length: 11 }, (_, i) => (
                                                <div
                                                    key={`h-${i}`}
                                                    className="absolute left-0 right-0 h-px bg-white opacity-20"
                                                    style={{ top: `${i * 10}%` }}
                                                />
                                            ))}
                                        </>
                                    )}

                                    {/* Spielerpositionen */}
                                    {positions.map(position => {
                                        const assignedPlayer = players.find(p => p.id === selectedPlayers[position.id]);
                                        
                                        return (
                                            <div
                                                key={position.id}
                                                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                                                style={{ 
                                                    left: `${position.x}%`, 
                                                    top: `${position.y}%` 
                                                }}
                                            >
                                                {assignedPlayer ? (
                                                    <div className="relative">
                                                        <div className={`
                                                            w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg transition-transform group-hover:scale-110
                                                            ${position.color === 'yellow' ? 'bg-yellow-500' : ''}
                                                            ${position.color === 'blue' ? 'bg-blue-600' : ''}
                                                            ${position.color === 'green' ? 'bg-green-600' : ''}
                                                            ${position.color === 'red' ? 'bg-red-600' : ''}
                                                        `}>
                                                            {assignedPlayer.number}
                                                        </div>
                                                        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                                                            {assignedPlayer.name}
                                                        </div>
                                                        <button
                                                            onClick={() => removePlayerFromPosition(position.id)}
                                                            className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="relative group">
                                                        <div className={`
                                                            w-12 h-12 rounded-full border-2 border-dashed border-white flex items-center justify-center text-white text-xs font-bold bg-black bg-opacity-30 hover:bg-opacity-50 transition-all
                                                        `}>
                                                            {position.name}
                                                        </div>
                                                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                                                            Spieler zuweisen
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Aktionsleiste */}
                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                                <div className="text-sm text-gray-600">
                                    {getAssignedPlayers().length} von {positions.length} Positionen besetzt
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="sm" icon={FaUndo}>
                                        Rückgängig
                                    </Button>
                                    <Button variant="ghost" size="sm" icon={FaRedo}>
                                        Wiederholen
                                    </Button>
                                    <Button variant="secondary" size="sm" icon={FaPrint}>
                                        Drucken
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Gespeicherte Formationen */}
                {savedFormations.length > 0 && (
                    <Card className="p-6 mt-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Gespeicherte Formationen</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {savedFormations.map(formation => (
                                <div key={formation.id} className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-medium text-gray-900">{formation.name}</h4>
                                        <Badge variant="secondary">{formation.type}</Badge>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-3">
                                        {Object.keys(formation.players).length} Spieler zugewiesen
                                    </p>
                                    <div className="flex gap-2">
                                        <Button variant="ghost" size="sm">
                                            Laden
                                        </Button>
                                        <Button variant="ghost" size="sm" className="text-red-600">
                                            Löschen
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                )}
            </div>
        </Layout>
    );
};

export default Formation;
