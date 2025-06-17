import React, { useState, useEffect } from 'react';
import Layout from '../../../components/Layout/Layout';
import AddMatchDay from '../../../components/MatchDay/AddMatchDay';
import { useNavigate } from 'react-router-dom';
import { 
    FaFutbol, 
    FaCalendarAlt, 
    FaClock, 
    FaMapMarkerAlt, 
    FaPlus,
    FaUsers,
    FaDrawPolygon,
    FaEye,
    FaPlay,
    FaChartLine,
    FaClipboardList,
    FaTrophy,
    FaHome,
    FaPlane
} from 'react-icons/fa';
import { HiCalendar, HiClock, HiLocationMarker, HiUsers as HiUsersIcon } from 'react-icons/hi';
import moment from 'moment';
import 'moment/locale/de';
import axiosInstance from '../../../utils/axiosInstance';

moment.locale('de');

const MatchDay = () => {
    const navigate = useNavigate();
    const [matches, setMatches] = useState([]);
    const [formations, setFormations] = useState([]);
    const [tactics, setTactics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddMatch, setShowAddMatch] = useState(false);
    const [selectedView, setSelectedView] = useState('upcoming'); // upcoming, past, all

    useEffect(() => {
        fetchMatches();
        fetchFormations();
        fetchTactics();
    }, []);

    const fetchMatches = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/get-all-events');
            const matchEvents = (response.data.events || []).filter(event => event.type === 'match');
            setMatches(matchEvents);
        } catch (err) {
            console.error('Fehler beim Laden der Spiele:', err);
            setError('Fehler beim Laden der Spiele');
        } finally {
            setLoading(false);
        }
    };

    const fetchFormations = async () => {
        try {
            // Hier würde normalerweise die Formations-API aufgerufen werden
            // Vorerst Mock-Daten
            setFormations([
                { id: 1, name: '4-4-2 Standard', formation: '4-4-2' },
                { id: 2, name: '4-3-3 Offensive', formation: '4-3-3' },
                { id: 3, name: '3-5-2 Defensive', formation: '3-5-2' }
            ]);
        } catch (err) {
            console.error('Fehler beim Laden der Formationen:', err);
        }
    };

    const fetchTactics = async () => {
        try {
            // Hier würde normalerweise die Taktik-API aufgerufen werden
            // Vorerst Mock-Daten
            setTactics([
                { id: 1, name: 'Pressing', type: 'Defensiv' },
                { id: 2, name: 'Konter', type: 'Offensiv' },
                { id: 3, name: 'Ballbesitz', type: 'Aufbau' }
            ]);
        } catch (err) {
            console.error('Fehler beim Laden der Taktiken:', err);
        }
    };

    const handleMatchAdded = () => {
        fetchMatches();
    };

    const getFilteredMatches = () => {
        const now = new Date();
        switch (selectedView) {
            case 'upcoming':
                return matches.filter(match => new Date(match.date) >= now);
            case 'past':
                return matches.filter(match => new Date(match.date) < now);
            default:
                return matches;
        }
    };

    const getUpcomingMatches = () => {
        const now = new Date();
        return matches
            .filter(match => new Date(match.date) >= now)
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 3);
    };

    const getPastMatches = () => {
        const now = new Date();
        return matches
            .filter(match => new Date(match.date) < now)
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);
    };

    const getMatchIcon = (isHome) => {
        return isHome ? FaHome : FaPlane;
    };

    const getMatchTypeColor = (isHome) => {
        return isHome ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400';
    };

    if (loading) {
        return (
            <Layout>
                <div className="container mx-auto px-4 py-6">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-300 rounded mb-4"></div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-64 bg-gray-300 rounded"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container mx-auto px-4 py-6">
                {/* Header */}
                <div className="mb-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl p-6 shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center space-x-2 mb-1">
                                <FaFutbol className="text-2xl" />
                                <h2 className="text-lg font-medium opacity-90">Spieltagsplanung</h2>
                            </div>
                            <h1 className="text-3xl font-bold mb-2">Spiele organisieren</h1>
                            <p className="opacity-90">Plane Taktiken, Aufstellungen und bereite dein Team vor</p>
                        </div>
                        <button 
                            onClick={() => setShowAddMatch(true)}
                            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                        >
                            <FaPlus />
                            <span>Neues Spiel</span>
                        </button>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Anstehende Spiele</p>
                                <p className="text-2xl font-bold text-gray-800 dark:text-white">{getUpcomingMatches().length}</p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                <FaCalendarAlt className="text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Formationen</p>
                                <p className="text-2xl font-bold text-gray-800 dark:text-white">{formations.length}</p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                                <FaUsers className="text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Taktiken</p>
                                <p className="text-2xl font-bold text-gray-800 dark:text-white">{tactics.length}</p>
                            </div>                            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                                <FaDrawPolygon className="text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Diese Woche</p>
                                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                                    {matches.filter(m => {
                                        const matchDate = moment(m.date);
                                        return matchDate.isSame(moment(), 'week');
                                    }).length}
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                                <FaFutbol className="text-orange-600 dark:text-orange-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Gespielt</p>
                                <p className="text-2xl font-bold text-gray-800 dark:text-white">{getPastMatches().length}</p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                                <FaTrophy className="text-red-600 dark:text-red-400" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Filter Tabs */}
                    <div className="lg:col-span-2 mb-6">
                        <div className="flex space-x-2 bg-white dark:bg-gray-800 rounded-lg p-2 shadow-sm border border-gray-200 dark:border-gray-700 w-fit">
                            {[
                                { key: 'upcoming', label: 'Anstehend', count: matches.filter(m => new Date(m.date) >= new Date()).length },
                                { key: 'past', label: 'Gespielt', count: matches.filter(m => new Date(m.date) < new Date()).length },
                                { key: 'all', label: 'Alle', count: matches.length }
                            ].map(tab => (
                                <button
                                    key={tab.key}
                                    onClick={() => setSelectedView(tab.key)}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                                        selectedView === tab.key
                                            ? 'bg-blue-500 text-white'
                                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    <span>{tab.label}</span>
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                        selectedView === tab.key
                                            ? 'bg-white/20'
                                            : 'bg-gray-200 dark:bg-gray-600'
                                    }`}>
                                        {tab.count}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Match List */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
                            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
                                    <FaFutbol className="text-blue-500 mr-2" />
                                    {selectedView === 'upcoming' ? 'Anstehende Spiele' : 
                                     selectedView === 'past' ? 'Gespielte Spiele' : 
                                     'Alle Spiele'}
                                </h3>
                            </div>
                            <div className="p-6">
                                {getFilteredMatches().length === 0 ? (
                                    <div className="text-center py-12">
                                        <FaFutbol className="mx-auto text-6xl text-gray-400 mb-4" />
                                        <h4 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
                                            {selectedView === 'upcoming' ? 'Keine anstehenden Spiele' :
                                             selectedView === 'past' ? 'Noch keine Spiele gespielt' :
                                             'Keine Spiele vorhanden'}
                                        </h4>
                                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                                            {selectedView === 'upcoming' 
                                                ? 'Erstellen Sie Ihr erstes Spiel für das Team'
                                                : 'Spiele erscheinen hier nach der Erstellung'
                                            }
                                        </p>
                                        {selectedView !== 'past' && (
                                            <button
                                                onClick={() => setShowAddMatch(true)}
                                                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors flex items-center space-x-2 mx-auto"
                                            >
                                                <FaPlus />
                                                <span>Erstes Spiel erstellen</span>
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {getFilteredMatches()
                                            .sort((a, b) => selectedView === 'past' 
                                                ? new Date(b.date) - new Date(a.date)
                                                : new Date(a.date) - new Date(b.date)
                                            )
                                            .map(match => {
                                                const MatchIcon = getMatchIcon(match.isHome);
                                                return (
                                                    <div key={match._id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                                        <div className="flex items-start justify-between">
                                                            <div className="flex-1">
                                                                <div className="flex items-center space-x-3 mb-3">
                                                                    <MatchIcon className={`text-lg ${getMatchTypeColor(match.isHome)}`} />
                                                                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
                                                                        {match.title}
                                                                    </h4>
                                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                                        match.isHome 
                                                                            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                                                            : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                                                                    }`}>
                                                                        {match.isHome ? 'Heimspiel' : 'Auswärtsspiel'}
                                                                    </span>
                                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                                        new Date(match.date) >= new Date()
                                                                            ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
                                                                            : 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300'
                                                                    }`}>
                                                                        {new Date(match.date) >= new Date() ? 'Geplant' : 'Gespielt'}
                                                                    </span>
                                                                </div>
                                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                                                                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                                                                        <HiCalendar className="mr-2 text-blue-500" />
                                                                        <div>
                                                                            <p className="font-medium">
                                                                                {moment(match.date).format('dddd, DD. MMMM')}
                                                                            </p>
                                                                            <p className="text-xs">
                                                                                {moment(match.date).fromNow()}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                                                                        <HiClock className="mr-2 text-purple-500" />
                                                                        <div>
                                                                            <p className="font-medium">{match.time} Uhr</p>
                                                                            <p className="text-xs">Anpfiff</p>
                                                                        </div>
                                                                    </div>
                                                                    {match.location && (
                                                                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                                                                            <HiLocationMarker className="mr-2 text-orange-500" />
                                                                            <div>
                                                                                <p className="font-medium">{match.location}</p>
                                                                                <p className="text-xs">Spielort</p>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                {match.opponent && (
                                                                    <div className="mt-3 text-sm">
                                                                        <p className="text-gray-600 dark:text-gray-300 mb-1">
                                                                            <FaUsers className="inline mr-1 text-blue-500" />
                                                                            Gegner: <span className="font-medium">{match.opponent}</span>
                                                                        </p>
                                                                    </div>
                                                                )}
                                                                {match.matchData?.formation && (
                                                                    <div className="mt-2 text-sm">
                                                                        <p className="text-gray-600 dark:text-gray-300">                                                                            <FaDrawPolygon className="inline mr-1 text-green-500" />
                                                                            Formation: <span className="font-medium">{match.matchData.formation}</span>
                                                                        </p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="flex flex-col space-y-2 ml-4">
                                                                <button
                                                                    onClick={() => navigate(`/team/matchday/${match._id}`)}
                                                                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm flex items-center space-x-1"
                                                                >
                                                                    <FaEye className="text-xs" />
                                                                    <span>Details</span>
                                                                </button>
                                                                <button
                                                                    onClick={() => navigate(`/team/formation?match=${match._id}`)}
                                                                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-sm flex items-center space-x-1"
                                                                >
                                                                    <FaUsers className="text-xs" />
                                                                    <span>Aufstellung</span>
                                                                </button>                                                                <button
                                                                    onClick={() => navigate(`/team/tactics?match=${match._id}`)}
                                                                    className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors text-sm flex items-center space-x-1"
                                                                >
                                                                    <FaDrawPolygon className="text-xs" />
                                                                    <span>Taktik</span>
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
                </div>

                {/* Quick Actions */}
                <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
                            <FaPlay className="text-blue-500 mr-2" />
                            Spieltagsvorbereitung
                        </h3>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                        <button 
                            onClick={() => setShowAddMatch(true)}
                            className="flex flex-col items-center justify-center bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-xl p-6 transition-colors border border-blue-200 dark:border-blue-800"
                        >
                            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-3">
                                <FaPlus className="text-blue-600 dark:text-blue-400 text-xl" />
                            </div>
                            <span className="font-medium text-gray-800 dark:text-white">Neues Spiel</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">Spiel planen</span>
                        </button>
                        
                        <button 
                            onClick={() => navigate('/team/formation')}
                            className="flex flex-col items-center justify-center bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-xl p-6 transition-colors border border-green-200 dark:border-green-800"
                        >
                            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-3">
                                <FaUsers className="text-green-600 dark:text-green-400 text-xl" />
                            </div>
                            <span className="font-medium text-gray-800 dark:text-white">Aufstellungen</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">Formation planen</span>
                        </button>
                        
                        <button 
                            onClick={() => navigate('/team/tactics')}
                            className="flex flex-col items-center justify-center bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-xl p-6 transition-colors border border-purple-200 dark:border-purple-800"
                        >                            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-3">
                                <FaDrawPolygon className="text-purple-600 dark:text-purple-400 text-xl" />
                            </div>
                            <span className="font-medium text-gray-800 dark:text-white">Taktiken</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">Spielzüge planen</span>
                        </button>
                        
                        <button 
                            onClick={() => navigate('/team/statistics')}
                            className="flex flex-col items-center justify-center bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30 rounded-xl p-6 transition-colors border border-orange-200 dark:border-orange-800"
                        >
                            <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center mb-3">
                                <FaChartLine className="text-orange-600 dark:text-orange-400 text-xl" />
                            </div>
                            <span className="font-medium text-gray-800 dark:text-white">Analysen</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">Statistiken</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Add Match Modal */}
            <AddMatchDay
                isOpen={showAddMatch}
                onClose={() => setShowAddMatch(false)}
                onMatchAdded={handleMatchAdded}
            />
        </Layout>
    );
};

export default MatchDay;
