import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../../components/Layout/Layout';
import { 
    FaArrowLeft,
    FaFutbol,
    FaEdit,
    FaTrash,
    FaUsers,
    FaDrawPolygon,
    FaPlay,
    FaPause,
    FaCheckCircle,
    FaExclamationTriangle,
    FaHome,
    FaPlane,
    FaCalendarAlt,
    FaClock,
    FaMapMarkerAlt,
    FaClipboardList,
    FaChartLine,
    FaSave
} from 'react-icons/fa';
import { HiCalendar, HiClock, HiLocationMarker, HiUsers as HiUsersIcon } from 'react-icons/hi';
import moment from 'moment';
import 'moment/locale/de';
import axiosInstance from '../../../utils/axiosInstance';

moment.locale('de');

const MatchDayDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [match, setMatch] = useState(null);
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('overview'); // overview, formation, tactics, preparation
    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [formationData, setFormationData] = useState({
        formation: '4-4-2',
        startingEleven: [],
        substitutes: [],
        captain: null
    });
    const [matchStatus, setMatchStatus] = useState('planned'); // planned, preparation, ongoing, finished

    useEffect(() => {
        if (id) {
            fetchMatch();
            fetchPlayers();
        }
    }, [id]);

    const fetchMatch = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/get-event/${id}`);
            const matchData = response.data.event;
            setMatch(matchData);
            
            // Load formation data if available
            if (matchData.matchData?.formation) {
                setFormationData(prev => ({
                    ...prev,
                    formation: matchData.matchData.formation,
                    startingEleven: matchData.matchData.startingEleven || [],
                    substitutes: matchData.matchData.substitutes || [],
                    captain: matchData.matchData.captain || null
                }));
            }
            
            // Determine match status
            const now = new Date();
            const matchDate = new Date(matchData.date);
            if (matchDate < now) {
                setMatchStatus('finished');
            } else if (matchDate <= new Date(now.getTime() + 24 * 60 * 60 * 1000)) {
                setMatchStatus('preparation');
            } else {
                setMatchStatus('planned');
            }
        } catch (err) {
            console.error('Fehler beim Laden des Spiels:', err);
            setError('Spiel nicht gefunden');
        } finally {
            setLoading(false);
        }
    };

    const fetchPlayers = async () => {
        try {
            const response = await axiosInstance.get('/get-all-players');
            setPlayers(response.data.players || []);
        } catch (err) {
            console.error('Fehler beim Laden der Spieler:', err);
        }
    };

    const handlePlayerSelection = (playerId, position = 'starting') => {
        setFormationData(prev => {
            if (position === 'starting') {
                const isSelected = prev.startingEleven.includes(playerId);
                return {
                    ...prev,
                    startingEleven: isSelected
                        ? prev.startingEleven.filter(id => id !== playerId)
                        : prev.startingEleven.length < 11
                            ? [...prev.startingEleven, playerId]
                            : prev.startingEleven
                };
            } else {
                const isSelected = prev.substitutes.includes(playerId);
                return {
                    ...prev,
                    substitutes: isSelected
                        ? prev.substitutes.filter(id => id !== playerId)
                        : [...prev.substitutes, playerId]
                };
            }
        });
    };

    const saveFormation = async () => {
        try {
            const updatedMatch = {
                ...match,
                matchData: {
                    ...match.matchData,
                    formation: formationData.formation,
                    startingEleven: formationData.startingEleven,
                    substitutes: formationData.substitutes,
                    captain: formationData.captain
                }
            };

            await axiosInstance.put(`/update-event/${id}`, updatedMatch);
            setMatch(updatedMatch);
            // Show success message
        } catch (err) {
            console.error('Fehler beim Speichern der Formation:', err);
        }
    };

    const getPlayerById = (playerId) => {
        return players.find(player => player._id === playerId);
    };

    const getMatchStatusColor = (status) => {
        switch (status) {
            case 'planned': return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
            case 'preparation': return 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300';
            case 'ongoing': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
            case 'finished': return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getMatchStatusLabel = (status) => {
        switch (status) {
            case 'planned': return 'Geplant';
            case 'preparation': return 'Vorbereitung';
            case 'ongoing': return 'Läuft';
            case 'finished': return 'Beendet';
            default: return 'Unbekannt';
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="container mx-auto px-4 py-6">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-300 rounded mb-4"></div>
                        <div className="h-64 bg-gray-300 rounded"></div>
                    </div>
                </div>
            </Layout>
        );
    }

    if (error || !match) {
        return (
            <Layout>
                <div className="container mx-auto px-4 py-6">
                    <div className="text-center py-12">
                        <FaExclamationTriangle className="mx-auto text-6xl text-red-400 mb-4" />
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                            {error || 'Spiel nicht gefunden'}
                        </h2>
                        <button
                            onClick={() => navigate('/team/matchday')}
                            className="mt-4 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                        >
                            Zurück zur Spielübersicht
                        </button>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container mx-auto px-4 py-6">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={() => navigate('/team/matchday')}
                            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white transition-colors"
                        >
                            <FaArrowLeft />
                            <span>Zurück zur Übersicht</span>
                        </button>
                        <div className="flex space-x-2">
                            <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors flex items-center space-x-2">
                                <FaEdit className="text-sm" />
                                <span>Bearbeiten</span>
                            </button>
                            <button className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800 rounded-lg transition-colors flex items-center space-x-2">
                                <FaTrash className="text-sm" />
                                <span>Löschen</span>
                            </button>
                        </div>
                    </div>

                    {/* Match Header Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-4">
                                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                    <FaFutbol className="text-2xl text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <div className="flex items-center space-x-3 mb-2">
                                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                                            {match.title}
                                        </h1>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getMatchStatusColor(matchStatus)}`}>
                                            {getMatchStatusLabel(matchStatus)}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                                        <div className="flex items-center space-x-1">
                                            {match.isHome ? <FaHome className="text-green-500" /> : <FaPlane className="text-blue-500" />}
                                            <span>{match.isHome ? 'Heimspiel' : 'Auswärtsspiel'}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <HiCalendar className="text-blue-500" />
                                            <span>{moment(match.date).format('dddd, DD. MMMM YYYY')}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <HiClock className="text-purple-500" />
                                            <span>{match.time} Uhr</span>
                                        </div>
                                        {match.location && (
                                            <div className="flex items-center space-x-1">
                                                <HiLocationMarker className="text-orange-500" />
                                                <span>{match.location}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500 dark:text-gray-400">Gegner</p>
                                <p className="text-lg font-semibold text-gray-800 dark:text-white">{match.opponent}</p>
                                {match.matchType && (
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 capitalize">
                                        {match.matchType === 'league' ? 'Liga-Spiel' : 
                                         match.matchType === 'cup' ? 'Pokal-Spiel' :
                                         match.matchType === 'friendly' ? 'Freundschaftsspiel' :
                                         'Turnier'}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="mb-6">
                    <div className="border-b border-gray-200 dark:border-gray-700">
                        <nav className="flex space-x-8">
                            {[
                                { key: 'overview', label: 'Übersicht', icon: FaClipboardList },
                                { key: 'formation', label: 'Aufstellung', icon: FaUsers },
                                { key: 'tactics', label: 'Taktik', icon: FaDrawPolygon },
                                { key: 'preparation', label: 'Vorbereitung', icon: FaPlay }
                            ].map(tab => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.key}
                                        onClick={() => setActiveTab(tab.key)}
                                        className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                            activeTab === tab.key
                                                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                                        }`}
                                    >
                                        <Icon className="text-lg" />
                                        <span>{tab.label}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {activeTab === 'overview' && (
                        <>
                            {/* Main Content */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Match Information */}
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
                                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                                        <FaClipboardList className="text-blue-500 mr-2" />
                                        Spiel-Informationen
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Grunddaten</h4>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Datum:</span>
                                                    <span className="font-medium">{moment(match.date).format('DD.MM.YYYY')}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Zeit:</span>
                                                    <span className="font-medium">{match.time} Uhr</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Ort:</span>
                                                    <span className="font-medium">{match.location || 'TBD'}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Typ:</span>
                                                    <span className="font-medium">{match.isHome ? 'Heimspiel' : 'Auswärtsspiel'}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Spielvorbereitung</h4>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Formation:</span>
                                                    <span className="font-medium">{match.matchData?.formation || 'Nicht festgelegt'}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Taktiken:</span>
                                                    <span className="font-medium">
                                                        {match.matchData?.tactics?.length || 0} ausgewählt
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Aufstellung:</span>
                                                    <span className="font-medium">
                                                        {formationData.startingEleven.length}/11 Spieler
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {match.description && (
                                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Beschreibung</h4>
                                            <p className="text-gray-600 dark:text-gray-400 text-sm">{match.description}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Quick Actions */}
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
                                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                                        <FaPlay className="text-green-500 mr-2" />
                                        Schnellaktionen
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <button
                                            onClick={() => setActiveTab('formation')}
                                            className="flex flex-col items-center justify-center bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg p-4 transition-colors border border-green-200 dark:border-green-800"
                                        >
                                            <FaUsers className="text-2xl text-green-600 dark:text-green-400 mb-2" />
                                            <span className="font-medium text-gray-800 dark:text-white">Aufstellung</span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">planen</span>
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('tactics')}
                                            className="flex flex-col items-center justify-center bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg p-4 transition-colors border border-purple-200 dark:border-purple-800"
                                        >                                            <FaDrawPolygon className="text-2xl text-purple-600 dark:text-purple-400 mb-2" />
                                            <span className="font-medium text-gray-800 dark:text-white">Taktik</span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">festlegen</span>
                                        </button>
                                        <button
                                            onClick={() => navigate(`/team/formation?match=${match._id}`)}
                                            className="flex flex-col items-center justify-center bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg p-4 transition-colors border border-blue-200 dark:border-blue-800"
                                        >
                                            <FaChartLine className="text-2xl text-blue-600 dark:text-blue-400 mb-2" />
                                            <span className="font-medium text-gray-800 dark:text-white">Formation</span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">visualisieren</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-6">
                                {/* Match Countdown */}
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                                        <FaClock className="text-orange-500 mr-2" />
                                        Countdown
                                    </h3>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                            {moment(match.date).fromNow()}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                            bis zum Anpfiff
                                        </p>
                                    </div>
                                </div>

                                {/* Status Card */}
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                                        Vorbereitungsstatus
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600 dark:text-gray-300">Aufstellung</span>
                                            <span className={`px-2 py-1 rounded-full text-xs ${
                                                formationData.startingEleven.length === 11 
                                                    ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                                    : 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
                                            }`}>
                                                {formationData.startingEleven.length}/11
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600 dark:text-gray-300">Taktik</span>
                                            <span className={`px-2 py-1 rounded-full text-xs ${
                                                match.matchData?.tactics?.length > 0
                                                    ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                                    : 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300'
                                            }`}>
                                                {match.matchData?.tactics?.length > 0 ? 'Festgelegt' : 'Offen'}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600 dark:text-gray-300">Formation</span>
                                            <span className={`px-2 py-1 rounded-full text-xs ${
                                                match.matchData?.formation
                                                    ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                                    : 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300'
                                            }`}>
                                                {match.matchData?.formation || 'TBD'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'formation' && (
                        <div className="lg:col-span-3">
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
                                        <FaUsers className="text-green-500 mr-2" />
                                        Aufstellung planen
                                    </h3>
                                    <button
                                        onClick={saveFormation}
                                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center space-x-2"
                                    >
                                        <FaSave className="text-sm" />
                                        <span>Speichern</span>
                                    </button>
                                </div>

                                {/* Formation Selector */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Formation
                                    </label>
                                    <select
                                        value={formationData.formation}
                                        onChange={(e) => setFormationData(prev => ({ ...prev, formation: e.target.value }))}
                                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                    >
                                        {['4-4-2', '4-3-3', '3-5-2', '4-2-3-1', '3-4-3', '5-3-2', '4-5-1'].map(formation => (
                                            <option key={formation} value={formation}>{formation}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Players Selection */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Starting Eleven */}
                                    <div>
                                        <h4 className="font-semibold text-gray-800 dark:text-white mb-3">
                                            Startelf ({formationData.startingEleven.length}/11)
                                        </h4>
                                        <div className="space-y-2 max-h-96 overflow-y-auto">
                                            {players.map(player => (
                                                <div
                                                    key={player._id}
                                                    className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                                                        formationData.startingEleven.includes(player._id)
                                                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                                            : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                                                    }`}
                                                    onClick={() => handlePlayerSelection(player._id, 'starting')}
                                                >
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                                            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                                                {player.playerNumber || '?'}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-800 dark:text-white">
                                                                {player.name}
                                                            </p>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                {player.position || 'Unbekannt'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {formationData.startingEleven.includes(player._id) && (
                                                        <FaCheckCircle className="text-green-500" />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Substitutes */}
                                    <div>
                                        <h4 className="font-semibold text-gray-800 dark:text-white mb-3">
                                            Ersatzbank ({formationData.substitutes.length})
                                        </h4>
                                        <div className="space-y-2 max-h-96 overflow-y-auto">
                                            {players
                                                .filter(player => !formationData.startingEleven.includes(player._id))
                                                .map(player => (
                                                <div
                                                    key={player._id}
                                                    className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                                                        formationData.substitutes.includes(player._id)
                                                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                                            : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                                                    }`}
                                                    onClick={() => handlePlayerSelection(player._id, 'substitute')}
                                                >
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                                            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                                                {player.playerNumber || '?'}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-800 dark:text-white">
                                                                {player.name}
                                                            </p>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                {player.position || 'Unbekannt'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {formationData.substitutes.includes(player._id) && (
                                                        <FaCheckCircle className="text-blue-500" />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'tactics' && (
                        <div className="lg:col-span-3">
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">                                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center">
                                    <FaDrawPolygon className="text-purple-500 mr-2" />
                                    Taktische Ausrichtung
                                </h3>
                                <div className="text-center py-12">
                                    <FaDrawPolygon className="mx-auto text-6xl text-gray-400 mb-4" />
                                    <h4 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
                                        Taktik-Editor in Entwicklung
                                    </h4>
                                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                                        Hier werden Sie bald detaillierte Taktiken planen können
                                    </p>
                                    <button
                                        onClick={() => navigate('/team/tactics')}
                                        className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
                                    >
                                        Zur Taktiktafel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'preparation' && (
                        <div className="lg:col-span-3">
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
                                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center">
                                    <FaPlay className="text-orange-500 mr-2" />
                                    Spielvorbereitung
                                </h3>
                                {match.matchData?.notes ? (
                                    <div className="prose dark:prose-invert max-w-none">
                                        <p>{match.matchData.notes}</p>
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <FaClipboardList className="mx-auto text-6xl text-gray-400 mb-4" />
                                        <h4 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
                                            Keine Vorbereitungsnotizen
                                        </h4>
                                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                                            Fügen Sie Notizen zur Spielvorbereitung hinzu
                                        </p>
                                        <button className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors">
                                            Notizen hinzufügen
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default MatchDayDetails;
