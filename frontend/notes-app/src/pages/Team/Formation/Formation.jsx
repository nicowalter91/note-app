import React, { useState, useEffect } from 'react';
import Layout from '../../../components/Layout/Layout';
import { FaUserPlus, FaSave, FaUndo, FaRedo, FaShareAlt, FaPrint, FaArrowLeft } from 'react-icons/fa';
import { HiOutlineSwitchHorizontal } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utils/axiosInstance';

const Formation = () => {
    const navigate = useNavigate();
    const [players, setPlayers] = useState([]);
    const [selectedFormation, setSelectedFormation] = useState('4-4-2');
    const [selectedPlayers, setSelectedPlayers] = useState({});
    const [positions, setPositions] = useState([]);
    const [draggedPlayer, setDraggedPlayer] = useState(null);
    const [loading, setLoading] = useState(true);

    // Verfügbare Formationen
    const formations = [
        { id: '4-4-2', name: '4-4-2 Standard', positions: 11 },
        { id: '4-3-3', name: '4-3-3 Offensiv', positions: 11 },
        { id: '3-5-2', name: '3-5-2 Mittelfeld', positions: 11 },
        { id: '5-3-2', name: '5-3-2 Defensiv', positions: 11 },
        { id: '4-2-3-1', name: '4-2-3-1 Flexibel', positions: 11 }
    ];    // Spielerposition basierend auf der Formation bestimmen
    useEffect(() => {
        // Hier würden wir die Positionen basierend auf der ausgewählten Formation definieren
        const getPositionsForFormation = (formationId) => {
            // Positionierung nach offiziellen FIFA-Maßen für ein halbes Spielfeld
            switch(formationId) {
                case '4-4-2':
                    return [
                        { id: 'gk', name: 'TW', x: 50, y: 95, playerId: null },
                        { id: 'lb', name: 'LV', x: 20, y: 75, playerId: null },
                        { id: 'cb1', name: 'IV', x: 35, y: 80, playerId: null },
                        { id: 'cb2', name: 'IV', x: 65, y: 80, playerId: null },
                        { id: 'rb', name: 'RV', x: 80, y: 75, playerId: null },
                        { id: 'lm', name: 'LM', x: 20, y: 50, playerId: null },
                        { id: 'cm1', name: 'ZM', x: 35, y: 45, playerId: null },
                        { id: 'cm2', name: 'ZM', x: 65, y: 45, playerId: null },
                        { id: 'rm', name: 'RM', x: 80, y: 50, playerId: null },
                        { id: 'st1', name: 'ST', x: 40, y: 25, playerId: null },
                        { id: 'st2', name: 'ST', x: 60, y: 25, playerId: null }
                    ];
                case '4-3-3':
                    return [
                        { id: 'gk', name: 'TW', x: 50, y: 95, playerId: null },
                        { id: 'lb', name: 'LV', x: 20, y: 75, playerId: null },
                        { id: 'cb1', name: 'IV', x: 35, y: 80, playerId: null },
                        { id: 'cb2', name: 'IV', x: 65, y: 80, playerId: null },
                        { id: 'rb', name: 'RV', x: 80, y: 75, playerId: null },
                        { id: 'dm', name: 'DM', x: 50, y: 60, playerId: null },
                        { id: 'cm1', name: 'ZM', x: 35, y: 45, playerId: null },
                        { id: 'cm2', name: 'ZM', x: 65, y: 45, playerId: null },
                        { id: 'lw', name: 'LF', x: 20, y: 25, playerId: null },
                        { id: 'st', name: 'ST', x: 50, y: 20, playerId: null },
                        { id: 'rw', name: 'RF', x: 80, y: 25, playerId: null }
                    ];
                case '3-5-2':
                    return [
                        { id: 'gk', name: 'TW', x: 50, y: 95, playerId: null },
                        { id: 'cb1', name: 'IV', x: 30, y: 80, playerId: null },
                        { id: 'cb2', name: 'IV', x: 50, y: 85, playerId: null },
                        { id: 'cb3', name: 'IV', x: 70, y: 80, playerId: null },
                        { id: 'lwb', name: 'LA', x: 15, y: 65, playerId: null },
                        { id: 'cm1', name: 'ZM', x: 30, y: 55, playerId: null },
                        { id: 'cdm', name: 'DM', x: 50, y: 60, playerId: null },
                        { id: 'cm2', name: 'ZM', x: 70, y: 55, playerId: null },
                        { id: 'rwb', name: 'RA', x: 85, y: 65, playerId: null },
                        { id: 'st1', name: 'ST', x: 35, y: 25, playerId: null },
                        { id: 'st2', name: 'ST', x: 65, y: 25, playerId: null }
                    ];
                case '5-3-2':
                    return [
                        { id: 'gk', name: 'TW', x: 50, y: 95, playerId: null },
                        { id: 'lwb', name: 'LV', x: 15, y: 70, playerId: null },
                        { id: 'cb1', name: 'IV', x: 30, y: 80, playerId: null },
                        { id: 'cb2', name: 'IV', x: 50, y: 85, playerId: null },
                        { id: 'cb3', name: 'IV', x: 70, y: 80, playerId: null },
                        { id: 'rwb', name: 'RV', x: 85, y: 70, playerId: null },
                        { id: 'cm1', name: 'ZM', x: 30, y: 50, playerId: null },
                        { id: 'cm2', name: 'ZM', x: 50, y: 45, playerId: null },
                        { id: 'cm3', name: 'ZM', x: 70, y: 50, playerId: null },
                        { id: 'st1', name: 'ST', x: 35, y: 25, playerId: null },
                        { id: 'st2', name: 'ST', x: 65, y: 25, playerId: null }
                    ];
                case '4-2-3-1':
                    return [
                        { id: 'gk', name: 'TW', x: 50, y: 95, playerId: null },
                        { id: 'lb', name: 'LV', x: 20, y: 75, playerId: null },
                        { id: 'cb1', name: 'IV', x: 35, y: 80, playerId: null },
                        { id: 'cb2', name: 'IV', x: 65, y: 80, playerId: null },
                        { id: 'rb', name: 'RV', x: 80, y: 75, playerId: null },
                        { id: 'dm1', name: 'DM', x: 35, y: 60, playerId: null },
                        { id: 'dm2', name: 'DM', x: 65, y: 60, playerId: null },
                        { id: 'lam', name: 'LM', x: 25, y: 40, playerId: null },
                        { id: 'cam', name: 'ZOM', x: 50, y: 35, playerId: null },
                        { id: 'ram', name: 'RM', x: 75, y: 40, playerId: null },
                        { id: 'st', name: 'ST', x: 50, y: 15, playerId: null }
                    ];
                // Weitere Formationen könnten hier hinzugefügt werden
                default:
                    return [];
            }
        };

        setPositions(getPositionsForFormation(selectedFormation));
    }, [selectedFormation]);

    // Spielerdaten laden
    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get('/players');
                // Fallback für Test, falls keine API vorhanden
                const dummyPlayers = [
                    { id: 1, name: 'Manuel Neuer', position: 'GK', number: 1, image: null },
                    { id: 2, name: 'Joshua Kimmich', position: 'RB', number: 6, image: null },
                    { id: 3, name: 'Niklas Süle', position: 'CB', number: 4, image: null },
                    { id: 4, name: 'David Alaba', position: 'CB', number: 27, image: null },
                    { id: 5, name: 'Alphonso Davies', position: 'LB', number: 19, image: null },
                    { id: 6, name: 'Leon Goretzka', position: 'CM', number: 18, image: null },
                    { id: 7, name: 'Thomas Müller', position: 'AM', number: 25, image: null },
                    { id: 8, name: 'Serge Gnabry', position: 'RW', number: 7, image: null },
                    { id: 9, name: 'Leroy Sané', position: 'LW', number: 10, image: null },
                    { id: 10, name: 'Robert Lewandowski', position: 'ST', number: 9, image: null },
                    { id: 11, name: 'Kingsley Coman', position: 'LW', number: 29, image: null },
                    { id: 12, name: 'Marc-André ter Stegen', position: 'GK', number: 22, image: null },
                    { id: 13, name: 'Toni Kroos', position: 'CM', number: 8, image: null },
                    { id: 14, name: 'Kai Havertz', position: 'AM', number: 29, image: null },
                    { id: 15, name: 'Ilkay Gündogan', position: 'CM', number: 21, image: null }
                ];
                
                setPlayers(response?.data?.players || dummyPlayers);
            } catch (error) {
                console.error('Fehler beim Laden der Spieler:', error);
                // Dummy-Daten für die Entwicklung
                setPlayers([
                    { id: 1, name: 'Manuel Neuer', position: 'GK', number: 1, image: null },
                    { id: 2, name: 'Joshua Kimmich', position: 'RB', number: 6, image: null },
                    { id: 3, name: 'Niklas Süle', position: 'CB', number: 4, image: null },
                    { id: 4, name: 'David Alaba', position: 'CB', number: 27, image: null },
                    { id: 5, name: 'Alphonso Davies', position: 'LB', number: 19, image: null },
                    { id: 6, name: 'Leon Goretzka', position: 'CM', number: 18, image: null },
                    { id: 7, name: 'Thomas Müller', position: 'AM', number: 25, image: null },
                    { id: 8, name: 'Serge Gnabry', position: 'RW', number: 7, image: null },
                    { id: 9, name: 'Leroy Sané', position: 'LW', number: 10, image: null },
                    { id: 10, name: 'Robert Lewandowski', position: 'ST', number: 9, image: null },
                    { id: 11, name: 'Kingsley Coman', position: 'LW', number: 29, image: null },
                    { id: 12, name: 'Marc-André ter Stegen', position: 'GK', number: 22, image: null },
                    { id: 13, name: 'Toni Kroos', position: 'CM', number: 8, image: null },
                    { id: 14, name: 'Kai Havertz', position: 'AM', number: 29, image: null },
                    { id: 15, name: 'Ilkay Gündogan', position: 'CM', number: 21, image: null }
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchPlayers();
    }, []);

    // Event-Handler
    const handleFormationChange = (e) => {
        setSelectedFormation(e.target.value);
        setSelectedPlayers({});
    };

    const handleDragStart = (player) => {
        setDraggedPlayer(player);
    };

    const handleDrop = (positionId) => {
        if (draggedPlayer) {
            // Update der Positionen mit dem gezogenen Spieler
            setSelectedPlayers(prev => ({
                ...prev,
                [positionId]: draggedPlayer
            }));
            setDraggedPlayer(null);
        }
    };

    const handleRemovePlayer = (positionId) => {
        setSelectedPlayers(prev => {
            const newSelected = { ...prev };
            delete newSelected[positionId];
            return newSelected;
        });
    };

    const handleSaveFormation = async () => {
        try {
            // Hier würde der API-Aufruf erfolgen, um die Formation zu speichern
            console.log('Formation gespeichert:', {
                formation: selectedFormation,
                players: selectedPlayers
            });
            
            // Erfolgsmeldung anzeigen
            alert('Formation erfolgreich gespeichert!');
        } catch (error) {
            console.error('Fehler beim Speichern der Formation:', error);
            alert('Fehler beim Speichern der Formation!');
        }
    };

    return (
        <Layout>
            <div className="container mx-auto px-4 py-6">
                {/* Header */}
                <div className="mb-8 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center space-x-2 mb-1">
                                <button 
                                    onClick={() => navigate('/team')} 
                                    className="text-white hover:text-blue-100 transition-colors"
                                >
                                    <FaArrowLeft className="mr-2" />
                                </button>
                                <h2 className="text-lg font-medium opacity-90">Team Management</h2>
                            </div>
                            <h1 className="text-3xl font-bold mb-2">Aufstellung planen</h1>
                            <p className="opacity-90">Erstelle und speichere deine Teamaufstellung</p>
                        </div>
                        <div className="flex space-x-3">
                            <button 
                                onClick={handleSaveFormation}
                                className="flex items-center bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors"
                            >
                                <FaSave className="mr-2" />
                                Speichern
                            </button>
                            <button className="flex items-center bg-white/20 hover:bg-white/30 text-white py-2 px-4 rounded-lg transition-colors">
                                <FaShareAlt className="mr-2" />
                                Teilen
                            </button>
                            <button className="flex items-center bg-white/20 hover:bg-white/30 text-white py-2 px-4 rounded-lg transition-colors">
                                <FaPrint className="mr-2" />
                                Drucken
                            </button>
                        </div>
                    </div>
                </div>

                {/* Hauptinhalt */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Linke Spalte: Formationsauswahl und Spielerliste */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Formationsauswahl */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Formation</h2>
                            <select 
                                value={selectedFormation} 
                                onChange={handleFormationChange}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                            >
                                {formations.map(formation => (
                                    <option key={formation.id} value={formation.id}>
                                        {formation.name}
                                    </option>
                                ))}
                            </select>
                            <div className="mt-4 flex justify-between">
                                <button className="flex items-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-1 px-3 rounded-lg text-sm transition-colors">
                                    <FaUndo className="mr-1" />
                                    Zurücksetzen
                                </button>
                                <button className="flex items-center bg-blue-100 dark:bg-blue-900/50 hover:bg-blue-200 dark:hover:bg-blue-800 text-blue-800 dark:text-blue-200 py-1 px-3 rounded-lg text-sm transition-colors">
                                    <HiOutlineSwitchHorizontal className="mr-1" />
                                    Spiegeln
                                </button>
                            </div>
                        </div>

                        {/* Spielerliste */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
                            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Verfügbare Spieler</h2>
                            </div>
                            <div className="p-4">
                                <input 
                                    type="text" 
                                    placeholder="Spieler suchen..." 
                                    className="w-full p-2 mb-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                                />
                                <div className="max-h-96 overflow-y-auto">
                                    {loading ? (
                                        <div className="text-center py-8">
                                            <p className="text-gray-500 dark:text-gray-400">Spielerdaten werden geladen...</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {players.map(player => (
                                                <div 
                                                    key={player.id}
                                                    draggable
                                                    onDragStart={() => handleDragStart(player)}
                                                    className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-move"
                                                >
                                                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mr-3 text-xs font-bold text-blue-800 dark:text-blue-200">
                                                        {player.number}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-gray-800 dark:text-white">{player.name}</div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">{player.position}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Rechte Spalte: Spielfeld */}
                    <div className="lg:col-span-3">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700 h-full">
                            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Spielfeld</h2>
                                <div className="flex space-x-2">
                                    <button className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-1 px-3 rounded-lg text-sm transition-colors">
                                        Autofüllen
                                    </button>
                                    <button className="bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-800/50 text-red-800 dark:text-red-200 py-1 px-3 rounded-lg text-sm transition-colors">
                                        Alle entfernen
                                    </button>
                                </div>
                            </div>                            <div className="p-6">
                                {/* Spielfelddarstellung mit Rasenmuster */}
                                <div 
                                    className="relative w-full rounded-lg overflow-hidden"
                                    style={{ 
                                        height: '600px',
                                        backgroundColor: '#2d8a2d',
                                        position: 'relative'
                                    }}
                                >
                                    {/* Rasenmuster mit CSS */}
                                    <div className="absolute inset-0" style={{
                                        backgroundImage: `
                                            linear-gradient(0deg, rgba(45, 138, 45, 0.5) 25%, transparent 25%, transparent 50%, 
                                            rgba(45, 138, 45, 0.5) 50%, rgba(45, 138, 45, 0.5) 75%, transparent 75%, transparent)
                                        `,
                                        backgroundSize: '40px 40px',
                                        opacity: 0.3
                                    }}></div>
                                      {/* Spielfeldmarkierungen - Nach offiziellen FIFA-Maßen */}
                                    <div className="absolute inset-0">
                                        {/* Außenlinien */}
                                        <div className="absolute inset-0 border-2 border-white/90 rounded-lg"></div>
                                        
                                        {/* Mittellinie (Obere Begrenzung des halben Feldes) */}
                                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/90"></div>
                                        
                                        {/* Mittelkreis - nur der untere Halbkreis */}
                                        <div 
                                            className="absolute border-2 border-white/90" 
                                            style={{
                                                top: '0px',
                                                left: '50%',
                                                transform: 'translateX(-50%)',
                                                width: '9.15rem',
                                                height: '4.575rem',
                                                borderTopWidth: '0px',
                                                borderRadius: '0 0 9.15rem 9.15rem'
                                            }}
                                        ></div>
                                        
                                        {/* Mittelpunkt */}
                                        <div className="absolute top-0 left-1/2 w-2 h-2 bg-white/90 rounded-full transform -translate-x-1/2 translate-y-1"></div>
                                        
                                        {/* Strafraum (unten) - 16,5m vom Tor, 40,32m breit 
                                           - 16,5m auf 52,5m Feldlänge entspricht ca. 31,4% der Feldlänge
                                           - 40,32m auf 68m Feldbreite entspricht ca. 59,3% der Feldbreite */}
                                        <div className="absolute bottom-0 left-1/2 w-[59.3%] h-[31.4%] border-2 border-t-2 border-l-2 border-r-2 border-white/90 transform -translate-x-1/2"></div>
                                        
                                        {/* Torraum (unten) - 5,5m vom Tor, 18,32m breit 
                                           - 5,5m auf 52,5m Feldlänge entspricht ca. 10,5% der Feldlänge
                                           - 18,32m auf 68m Feldbreite entspricht ca. 26,9% der Feldbreite */}
                                        <div className="absolute bottom-0 left-1/2 w-[26.9%] h-[10.5%] border-2 border-t-2 border-l-2 border-r-2 border-white/90 transform -translate-x-1/2"></div>
                                        
                                        {/* Elfmeterpunkt (unten) - 11m vom Tor 
                                           - 11m auf 52,5m Feldlänge entspricht ca. 21% der Feldlänge */}
                                        <div className="absolute bottom-[21%] left-1/2 w-2 h-2 bg-white/90 rounded-full transform -translate-x-1/2"></div>
                                        
                                        {/* Halbkreis am Strafraum (unten) */}
                                        <div 
                                            className="absolute border-2 border-white/90" 
                                            style={{
                                                bottom: '31.4%',
                                                left: '50%',
                                                transform: 'translateX(-50%)',
                                                width: '9.15rem',
                                                height: '4.575rem',
                                                borderBottomWidth: '0px',
                                                borderRadius: '9.15rem 9.15rem 0 0'
                                            }}
                                        ></div>
                                        
                                        {/* Tor - 7,32m breit 
                                           - 7,32m auf 68m Feldbreite entspricht ca. 10,8% der Feldbreite */}
                                        <div className="absolute bottom-0 left-1/2 w-[10.8%] h-[0.7%] bg-white/90 transform -translate-x-1/2 -translate-y-0.5"></div>
                                        
                                        {/* Eckpunkte - exakte Viertelkreise in den Ecken */}
                                        <div 
                                            className="absolute border-t-2 border-r-2 border-white/90" 
                                            style={{
                                                bottom: '0',
                                                left: '0',
                                                width: '1rem',
                                                height: '1rem',
                                                borderRadius: '0 1rem 0 0'
                                            }}
                                        ></div>
                                        <div 
                                            className="absolute border-t-2 border-l-2 border-white/90" 
                                            style={{
                                                bottom: '0',
                                                right: '0',
                                                width: '1rem',
                                                height: '1rem',
                                                borderRadius: '1rem 0 0 0'
                                            }}
                                        ></div>
                                    </div>                                    {/* Spielerpositionen */}
                                    {positions.map(position => (
                                        <div 
                                            key={position.id}
                                            onDragOver={(e) => e.preventDefault()}
                                            onDrop={() => handleDrop(position.id)}
                                            style={{
                                                position: 'absolute',
                                                left: `${position.x}%`,
                                                top: `${position.y}%`,
                                                transform: 'translate(-50%, -50%)',
                                                zIndex: 10,
                                                width: '3.5rem',
                                                height: '3.5rem',
                                                borderRadius: '50%',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backgroundColor: selectedPlayers[position.id] ? '#3b82f6' : 'rgba(229, 231, 235, 0.8)',
                                                color: selectedPlayers[position.id] ? 'white' : '#1f2937',
                                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                                transition: 'all 0.2s',
                                                cursor: 'pointer'
                                            }}
                                            className="hover:scale-110"
                                        >
                                            {selectedPlayers[position.id] ? (
                                                <>
                                                    <span className="font-bold text-xs">{selectedPlayers[position.id].number}</span>
                                                    <span className="text-xs font-medium">{selectedPlayers[position.id].name.split(' ').pop()}</span>
                                                    <button 
                                                        onClick={() => handleRemovePlayer(position.id)}
                                                        style={{
                                                            position: 'absolute',
                                                            top: '-0.25rem',
                                                            right: '-0.25rem',
                                                            width: '1.25rem',
                                                            height: '1.25rem',
                                                            borderRadius: '50%',
                                                            backgroundColor: '#ef4444',
                                                            color: 'white',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontSize: '0.75rem'
                                                        }}
                                                        className="hover:bg-red-600"
                                                    >
                                                        ×
                                                    </button>
                                                </>
                                            ) : (
                                                <span className="text-xs font-medium">{position.name}</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Formation;
