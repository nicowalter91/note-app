import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import { PageHeader, LoadingSpinner } from '../../components/UI/DesignSystem';
import { useNavigate } from 'react-router-dom';
import { getClubSettings } from '../../utils/clubSettingsService';
import { 
    FaChartLine, 
    FaCalendarAlt, 
    FaUsers, 
    FaClipboardList, 
    FaCheckCircle, 
    FaClock, 
    FaExclamationCircle, 
    FaArrowUp,
    FaPlus,
    FaUserAlt,
    FaRegCalendarAlt,
    FaRegClock,
    FaTasks,
    FaPlusCircle,
    FaUserPlus,
    FaDumbbell,
    FaMapMarkerAlt,
    FaFire,
    FaRunning,
    FaTrophy,    FaFutbol,    FaDrawPolygon,
    FaHome,
    FaPlane,
    FaSnowflake,
    FaSun,
    FaCalendarWeek,
    FaArrowRight,
    FaPlay
} from 'react-icons/fa';
import { 
    HiLightningBolt, 
    HiTrendingUp, 
    HiCollection, 
    HiStatusOnline, 
    HiHome, 
    HiChartBar, 
    HiUsers,
    HiLocationMarker,
    HiClock,
    HiCalendar
} from 'react-icons/hi';
import { 
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from 'recharts';
import axiosInstance from '../../utils/axiosInstance';
import moment from 'moment';
import 'moment/locale/de';

const Dashboard = () => {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null);
    const [clubSettings, setClubSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState({
        tasks: {
            total: 0,
            completed: 0,
            pending: 0,
            inProgress: 0,
            recent: []
        },
        players: {
            total: 0,
            recent: []
        },
        exercises: {
            total: 0,
            recent: []
        },
        events: {
            upcoming: 0,
            thisWeek: []
        },
        contacts: {
            total: 0
        }
    });

    // Benutzerdaten laden
    useEffect(() => {
        const getUserInfo = async () => {
            try {
                const response = await axiosInstance.get("/get-user");
                if (response.data && response.data.user) {
                    setUserInfo(response.data.user);
                }
            } catch (error) {
                console.error("Failed to fetch user info:", error);
            }
        };        const loadDashboardData = async () => {
            try {
                setLoading(true);
                  // Parallel laden aller Dashboard-Daten inkl. Club-Settings
                const [tasksRes, playersRes, exercisesRes, eventsRes, contactsRes, clubSettingsRes] = await Promise.all([
                    axiosInstance.get("/get-all-tasks").catch(() => ({ data: { tasks: [] } })),
                    axiosInstance.get("/players").catch((error) => {
                        console.error("Player API error:", error);
                        return { data: { players: [] } };
                    }),
                    axiosInstance.get("/get-all-exercises").catch(() => ({ data: { exercises: [] } })),
                    axiosInstance.get("/get-all-events").catch(() => ({ data: { events: [] } })),
                    axiosInstance.get("/contacts").catch(() => ({ data: { contacts: [] } })),
                    getClubSettings().catch(() => ({ settings: null }))
                ]);

                console.log("Players response:", playersRes.data); // Debug Log

                const tasks = tasksRes.data.tasks || [];
                const players = playersRes.data.players || [];
                const exercises = exercisesRes.data.exercises || [];
                const events = eventsRes.data.events || [];
                const contacts = contactsRes.data.contacts || [];
                const clubSettingsData = clubSettingsRes.settings;

                // Club Settings setzen
                setClubSettings(clubSettingsData);

                // Task-Statistiken berechnen
                const completedTasks = tasks.filter(task => task.status === 'completed').length;
                const pendingTasks = tasks.filter(task => task.status === 'pending').length;
                const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;                // Kommende Events (nächste 7 Tage)
                const now = new Date();
                const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
                const upcomingEvents = events.filter(event => {
                    const eventDate = new Date(event.date);
                    return eventDate >= now && eventDate <= nextWeek;
                });                // Nächstes Training und nächstes Spiel finden
                const futureEvents = events.filter(event => new Date(event.date) >= now)
                    .sort((a, b) => new Date(a.date) - new Date(b.date));
                
                const nextTraining = futureEvents.find(event => event.type === 'training');
                const nextGame = futureEvents.find(event => event.type === 'match' || event.type === 'game');

                // Neueste Items (letzte 5)
                const recentTasks = tasks
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .slice(0, 4);

                const recentPlayers = players
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .slice(0, 3);

                const recentExercises = exercises
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .slice(0, 3);                setDashboardData({
                    tasks: {
                        total: tasks.length,
                        completed: completedTasks,
                        pending: pendingTasks,
                        inProgress: inProgressTasks,
                        recent: recentTasks
                    },
                    players: {
                        total: players.length,
                        recent: recentPlayers
                    },
                    exercises: {
                        total: exercises.length,
                        recent: recentExercises
                    },
                    events: {
                        upcoming: upcomingEvents.length,
                        thisWeek: upcomingEvents.slice(0, 3),
                        nextTraining: nextTraining,
                        nextGame: nextGame
                    },
                    contacts: {
                        total: contacts.length
                    }
                });

            } catch (error) {
                console.error("Failed to load dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        getUserInfo();
        loadDashboardData();
    }, []);    // Task-Status-Daten für Pie Chart
    const taskStatusData = [
        { name: 'Abgeschlossen', value: dashboardData.tasks.completed, color: '#10b981' },
        { name: 'In Bearbeitung', value: dashboardData.tasks.inProgress, color: '#3b82f6' },
        { name: 'Ausstehend', value: dashboardData.tasks.pending, color: '#f59e0b' }
    ].filter(item => item.value > 0);

    // Wochenübersicht für Events
    const weeklyEventsData = dashboardData.events.thisWeek.map(event => ({
        name: moment(event.date).format('dddd'),
        count: 1,
        title: event.title
    }));

    // Status-Badge anzeigen
    const getStatusBadge = (status) => {
        switch(status) {
            case 'completed':
                return <span className="flex items-center text-green-500"><FaCheckCircle className="mr-1" /> Abgeschlossen</span>;
            case 'pending':
                return <span className="flex items-center text-orange-500"><FaClock className="mr-1" /> Ausstehend</span>;
            case 'in-progress':
                return <span className="flex items-center text-blue-500"><HiStatusOnline className="mr-1" /> In Bearbeitung</span>;
            default:
                return <span className="flex items-center text-gray-500">{status}</span>;
        }
    };

    // Prioritätsstufe anzeigen
    const getPriorityBadge = (priority) => {
        switch(priority) {
            case 'high':
                return <span className="text-red-500 font-medium">Hoch</span>;
            case 'medium':
                return <span className="text-yellow-500 font-medium">Mittel</span>;
            case 'low':
                return <span className="text-green-500 font-medium">Niedrig</span>;
            default:
                return <span className="text-gray-500 font-medium">{priority}</span>;
        }
    };

    // Begrüßung abhängig von der Tageszeit
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Guten Morgen";
        if (hour < 18) return "Guten Tag";
        return "Guten Abend";
    };

    // Formattiert das Datum
    const formatDate = (date) => {
        return moment(date).format('DD. MMM YYYY');
    };

    // Season phase determination
    const getCurrentSeasonPhase = () => {
        const month = moment().month() + 1; // moment months are 0-based
        
        if (month >= 1 && month <= 2) {
            return { phase: 'Wintervorbereitung', color: 'blue', icon: FaSnowflake };
        } else if (month >= 3 && month <= 6) {
            return { phase: 'Rückrunde', color: 'red', icon: FaTrophy };
        } else if (month >= 7 && month <= 8) {
            return { phase: 'Sommervorbereitung', color: 'yellow', icon: FaSun };
        } else if (month >= 9 && month <= 12) {
            return { phase: 'Vorrunde', color: 'green', icon: FaTrophy };
        }
        return { phase: 'Vorsaison', color: 'purple', icon: FaUsers };
    };

    // Weekly context for the red thread
    const getWeeklyContext = () => {
        const today = moment().isoWeekday(); // 1 = Monday, 7 = Sunday
        const weekStart = moment().startOf('isoWeek');
        const weekEnd = moment().endOf('isoWeek');
        
        const weekEvents = dashboardData.events?.thisWeek || [];
        const nextTraining = weekEvents.find(e => e.type === 'training' && moment(e.date).isAfter(moment()));
        const nextGame = weekEvents.find(e => (e.type === 'game' || e.type === 'match') && moment(e.date).isAfter(moment()));
        
        let weeklyFocus = '';
        let suggestedActions = [];
        
        if (today === 1) { // Monday
            weeklyFocus = 'Wochenplanung & Analyse';
            suggestedActions = [
                { text: 'Letztes Spiel analysieren', action: () => navigate('/team/statistics') },
                { text: 'Woche planen', action: () => navigate('/weekly-coach') }
            ];
        } else if (today === 2 || today === 3) { // Tuesday/Wednesday
            weeklyFocus = 'Intensives Training';
            suggestedActions = [
                { text: 'Training vorbereiten', action: () => navigate('/team/training') },
                { text: 'Übungen planen', action: () => navigate('/exercises') }
            ];
        } else if (today === 4 || today === 5) { // Thursday/Friday
            if (nextGame) {
                weeklyFocus = 'Spielvorbereitung';
                suggestedActions = [
                    { text: 'Matchday vorbereiten', action: () => navigate('/team/matchday') },
                    { text: 'Aufstellung planen', action: () => navigate('/team/formation') }
                ];
            } else {
                weeklyFocus = 'Taktisches Training';
                suggestedActions = [
                    { text: 'Taktik verfeinern', action: () => navigate('/team/tactics') },
                    { text: 'Standardsituationen', action: () => navigate('/exercises?filter=standards') }
                ];
            }
        } else { // Weekend
            weeklyFocus = 'Spieltag & Regeneration';
            suggestedActions = [
                { text: 'Regeneration planen', action: () => navigate('/team/training') },
                { text: 'Nächste Woche vorbereiten', action: () => navigate('/weekly-coach') }
            ];
        }
        
        return {
            weekNumber: moment().isoWeek(),
            weeklyFocus,
            suggestedActions,
            nextTraining,
            nextGame,
            weekRange: `${weekStart.format('DD.MM')} - ${weekEnd.format('DD.MM.YYYY')}`
        };
    };    if (loading) {
        return (
            <Layout>
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <LoadingSpinner size="lg" />
                </div>
            </Layout>
        );
    }    return (
    <Layout>
        <div className="container mx-auto px-4 py-6">            
            {/* Dashboard Header with Club Info */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        {/* Club Logo */}
                        {clubSettings?.logo && (
                            <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-gray-200 bg-white shadow-md">
                                <img 
                                    src={clubSettings.logo} 
                                    alt="Vereinslogo" 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}
                        
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                {clubSettings?.name || `${getGreeting()}, ${userInfo?.name || 'Trainer'}!`}
                            </h1>
                            <p className="text-lg text-gray-600 dark:text-gray-300 mt-1">
                                {clubSettings?.name ? `${getGreeting()}, ${userInfo?.name || 'Trainer'}!` : 'Hier ist ein Überblick über dein Team und anstehende Aufgaben'}
                            </p>
                        </div>
                    </div>
                    
                    {/* Optionale Vereinsfarben als Akzent */}
                    {clubSettings?.primaryColor && (
                        <div className="hidden md:flex items-center space-x-2">
                            <div 
                                className="w-4 h-4 rounded-full border border-gray-300"
                                style={{ backgroundColor: clubSettings.primaryColor }}
                            ></div>
                            {clubSettings?.secondaryColor && (
                                <div 
                                    className="w-4 h-4 rounded-full border border-gray-300"
                                    style={{ backgroundColor: clubSettings.secondaryColor }}
                                ></div>
                            )}
                        </div>
                    )}
                </div>
            </div>{/* Nächste wichtige Termine - Konsistent mit App-Design */}
            {(dashboardData.events.nextTraining || dashboardData.events.nextGame) && (
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Nächste Termine</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Nächstes Training */}
                        {dashboardData.events.nextTraining && (
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
                                <div className="bg-gray-50 border-l-4 border-green-500 px-6 py-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">                                            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                                                <FaRunning className="text-2xl text-green-600" />
                                            </div>
                                            <div className="ml-3">
                                                <h3 className="text-xl font-semibold text-gray-800">Nächstes Training</h3>
                                                <p className="text-gray-600 text-sm">Vorbereitung ist der Schlüssel</p>
                                            </div>
                                        </div>
                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                                            Training
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                                        {dashboardData.events.nextTraining.title}
                                    </h4>
                                    <div className="space-y-3">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                                                <HiCalendar className="text-xl text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-800 dark:text-white">
                                                    {moment(dashboardData.events.nextTraining.date).format('dddd, DD. MMMM YYYY')}
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {moment(dashboardData.events.nextTraining.date).fromNow()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mr-3">
                                                <HiClock className="text-xl text-purple-600 dark:text-purple-400" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-800 dark:text-white">
                                                    {dashboardData.events.nextTraining.time} Uhr
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {dashboardData.events.nextTraining.duration || 90} Minuten
                                                </p>
                                            </div>
                                        </div>
                                        {dashboardData.events.nextTraining.location && (
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center mr-3">
                                                    <HiLocationMarker className="text-xl text-orange-600 dark:text-orange-400" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-800 dark:text-white">
                                                        {dashboardData.events.nextTraining.location}
                                                    </p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Trainingsort</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>                                    <button 
                                        onClick={() => {
                                            if (dashboardData.events.nextTraining._id) {
                                                navigate(`/team/event/${dashboardData.events.nextTraining._id}`);
                                            } else {
                                                navigate('/team/training');
                                            }
                                        }}
                                        className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                                    >
                                        <FaDumbbell className="mr-2" />
                                        Training ansehen
                                    </button>
                                </div>
                            </div>
                        )}                        {/* Nächstes Spiel */}
                        {dashboardData.events.nextGame && (
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
                                <div className="bg-gray-50 border-l-4 border-blue-500 px-6 py-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">                                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                                <FaFutbol className="text-2xl text-blue-600" />
                                            </div>
                                            <div className="ml-3">
                                                <h3 className="text-xl font-semibold text-gray-800">Nächstes Spiel</h3>
                                                <p className="text-gray-600 text-sm">Zeit zu gewinnen</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">                                            {dashboardData.events.nextGame.isHome !== undefined && (
                                                <div className="flex items-center space-x-1">
                                                    {dashboardData.events.nextGame.isHome ? 
                                                        <FaHome className="text-blue-600 text-sm" /> : 
                                                        <FaPlane className="text-blue-600 text-sm" />
                                                    }
                                                </div>
                                            )}
                                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                                                {dashboardData.events.nextGame.isHome ? 'Heim' : 'Auswärts'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
                                            {dashboardData.events.nextGame.opponent 
                                                ? `vs ${dashboardData.events.nextGame.opponent}`
                                                : dashboardData.events.nextGame.title
                                            }
                                        </h4>
                                        {dashboardData.events.nextGame.matchType && (
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                dashboardData.events.nextGame.matchType === 'league' 
                                                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                                                    : dashboardData.events.nextGame.matchType === 'cup'
                                                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                                                    : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                            }`}>
                                                {dashboardData.events.nextGame.matchType === 'league' ? 'Liga' :
                                                 dashboardData.events.nextGame.matchType === 'cup' ? 'Pokal' :
                                                 dashboardData.events.nextGame.matchType === 'friendly' ? 'Freundschaft' :
                                                 'Turnier'}
                                            </span>
                                        )}
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                                                <HiCalendar className="text-xl text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-800 dark:text-white">
                                                    {moment(dashboardData.events.nextGame.date).format('dddd, DD. MMMM YYYY')}
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {moment(dashboardData.events.nextGame.date).fromNow()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mr-3">
                                                <HiClock className="text-xl text-purple-600 dark:text-purple-400" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-800 dark:text-white">
                                                    {dashboardData.events.nextGame.time} Uhr
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Anpfiff</p>
                                            </div>
                                        </div>
                                        {dashboardData.events.nextGame.location && (
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center mr-3">
                                                    <HiLocationMarker className="text-xl text-orange-600 dark:text-orange-400" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-800 dark:text-white">
                                                        {dashboardData.events.nextGame.location}
                                                    </p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Spielort</p>
                                                </div>
                                            </div>
                                        )}                                        {dashboardData.events.nextGame.matchData?.formation && (
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-3">
                                                    <FaDrawPolygon className="text-xl text-green-600 dark:text-green-400" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-800 dark:text-white">
                                                        {dashboardData.events.nextGame.matchData.formation}
                                                    </p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Formation</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex space-x-2 mt-4">
                                        <button 
                                            onClick={() => {
                                                if (dashboardData.events.nextGame._id) {
                                                    navigate(`/team/matchday/${dashboardData.events.nextGame._id}`);
                                                } else {
                                                    navigate('/team/matchday');
                                                }
                                            }}
                                            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                                        >
                                            <FaFutbol className="mr-2" />
                                            Details
                                        </button>                                        <button 
                                            onClick={() => {
                                                if (dashboardData.events.nextGame._id) {
                                                    navigate(`/team/formation?match=${dashboardData.events.nextGame._id}`);
                                                } else {
                                                    navigate('/team/formation');
                                                }
                                            }}
                                            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                                        >
                                            <FaDrawPolygon className="mr-2" />
                                            Aufstellung
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Statistikkarten - mit echten Daten */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Karte 1: Gesamtaufgaben */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Aufgaben</p>
                                <p className="text-3xl font-bold text-gray-800 dark:text-white mt-1">{dashboardData.tasks.total}</p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                <FaTasks className="text-xl text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm">
                            <span className="text-green-500 flex items-center">
                                <FaArrowUp className="mr-1" />
                                {dashboardData.tasks.total > 0 ? Math.round((dashboardData.tasks.completed / dashboardData.tasks.total) * 100) : 0}%
                            </span>
                            <span className="text-gray-500 dark:text-gray-400 ml-2">abgeschlossen</span>
                        </div>
                    </div>
                </div>

                {/* Karte 2: Spieler */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Spieler</p>
                                <p className="text-3xl font-bold text-gray-800 dark:text-white mt-1">{dashboardData.players.total}</p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                                <FaUsers className="text-xl text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm">
                            <span className="text-green-500 flex items-center">
                                <HiTrendingUp className="mr-1" />
                                Team vollständig
                            </span>
                        </div>
                    </div>
                </div>

                {/* Karte 3: Übungen */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Übungen</p>
                                <p className="text-3xl font-bold text-gray-800 dark:text-white mt-1">{dashboardData.exercises.total}</p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                                <FaDumbbell className="text-xl text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm">
                            <span className="text-purple-500 flex items-center">
                                <HiCollection className="mr-1" />
                                Trainingssammlung
                            </span>
                        </div>
                    </div>
                </div>

                {/* Karte 4: Anstehende Ereignisse */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Diese Woche</p>
                                <p className="text-3xl font-bold text-gray-800 dark:text-white mt-1">{dashboardData.events.upcoming}</p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                                <FaRegCalendarAlt className="text-xl text-orange-600 dark:text-orange-400" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm">
                            <span className="text-orange-500 flex items-center">
                                <FaCalendarAlt className="mr-1" />
                                Termine
                            </span>
                        </div>
                    </div>
                </div>
            </div>            {/* Hauptinhalt mit echten Daten */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Linke Spalte: Aufgabenübersicht und kommende Events */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Aufgabenstatistik */}
                    {dashboardData.tasks.total > 0 && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
                            <div className="flex items-center mb-6">
                                <FaChartLine className="text-blue-500 text-xl mr-2" />
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Aufgabenverteilung</h2>
                            </div>
                            <div className="h-64 flex items-center justify-center">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={taskStatusData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {taskStatusData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip 
                                            contentStyle={{ 
                                                backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                                                borderRadius: '0.5rem',
                                                border: 'none',
                                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                            }} 
                                        />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}
                    
                    {/* Kommende Events diese Woche */}
                    {dashboardData.events.thisWeek.length > 0 && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
                            <div className="flex items-center mb-6">
                                <FaCalendarAlt className="text-green-500 text-xl mr-2" />
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Diese Woche</h2>
                            </div>
                            <div className="space-y-3">
                                {dashboardData.events.thisWeek.map((event, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                                        <div>
                                            <h3 className="font-medium text-gray-800 dark:text-white">{event.title}</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {moment(event.date).format('dddd, DD. MMMM')}
                                            </p>
                                        </div>
                                        <span className="text-blue-500 text-sm font-medium">
                                            {moment(event.date).format('HH:mm')}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Rechte Spalte: Aktuelle Aufgaben und Quick Stats */}
                <div className="space-y-8">
                    {/* Aktuelle Aufgaben */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                            <div className="flex items-center">
                                <FaClipboardList className="text-orange-500 text-xl mr-2" />
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Aktuelle Aufgaben</h2>
                            </div>
                            <button 
                                onClick={() => navigate('/tasks')}
                                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium text-sm"
                            >
                                Alle anzeigen
                            </button>
                        </div>
                        {dashboardData.tasks.recent.length > 0 ? (
                            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                {dashboardData.tasks.recent.map((task) => (
                                    <div key={task._id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-base font-medium text-gray-800 dark:text-white">{task.title}</h3>
                                            {getPriorityBadge(task.priority)}
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            {getStatusBadge(task.status)}
                                            <span className="text-gray-500 dark:text-gray-400">
                                                {task.dueDate ? formatDate(task.dueDate) : 'Kein Datum'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="px-6 py-8 text-center">
                                <p className="text-gray-500 dark:text-gray-400">Keine Aufgaben vorhanden</p>
                            </div>
                        )}
                        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/20 border-t border-gray-200 dark:border-gray-700">
                            <button 
                                onClick={() => navigate('/tasks')}
                                className="w-full py-2 flex items-center justify-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                <FaPlusCircle className="mr-2" />
                                Aufgabe hinzufügen
                            </button>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Schnellübersicht</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Kontakte</span>
                                <span className="font-medium text-gray-800 dark:text-white">{dashboardData.contacts.total}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Neue Spieler</span>
                                <span className="font-medium text-gray-800 dark:text-white">{dashboardData.players.recent.length}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Neue Übungen</span>
                                <span className="font-medium text-gray-800 dark:text-white">{dashboardData.exercises.recent.length}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>            {/* Roter Faden - Wochenorientierte Schnellzugriffe */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <HiLightningBolt className="text-yellow-500 text-xl mr-2" />
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Wochenplanung</h2>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">Roter Faden</span>
                    </div>
                </div>
                <div className="p-6">
                    {/* Hauptfeature - Wochenassistent */}
                    <div className="mb-6">
                        <button 
                            onClick={() => navigate('/weekly-coach')}
                            className="w-full flex items-center justify-between bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl p-4 transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                            <div className="flex items-center">
                                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mr-4">
                                    <FaTrophy className="text-xl" />
                                </div>
                                <div className="text-left">
                                    <h3 className="font-semibold text-lg">Wochenassistent</h3>
                                    <p className="text-blue-100 text-sm">Ihr persönlicher Trainerguide</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <span className="bg-green-400 text-green-900 text-xs font-bold px-2 py-1 rounded-full mr-2">
                                    NEU
                                </span>
                                <FaArrowUp className="transform rotate-45" />
                            </div>
                        </button>
                    </div>
                    
                    {/* Schnellzugriffe Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                        <button 
                            onClick={() => navigate('/season')}
                            className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg p-3 transition-colors border border-gray-200 dark:border-gray-700"
                        >
                            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center mb-2">
                                <FaCalendarAlt className="text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <span className="text-sm font-medium text-gray-800 dark:text-white text-center">Saisonübersicht</span>
                        </button>
                        <button 
                            onClick={() => navigate('/exercises')}
                            className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg p-3 transition-colors border border-gray-200 dark:border-gray-700"
                        >
                            <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center mb-2">
                                <FaDumbbell className="text-purple-600 dark:text-purple-400" />
                            </div>
                            <span className="text-sm font-medium text-gray-800 dark:text-white text-center">Übungen</span>
                        </button>
                        <button 
                            onClick={() => navigate('/players')}
                            className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg p-3 transition-colors border border-gray-200 dark:border-gray-700"
                        >
                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mb-2">
                                <FaUsers className="text-blue-600 dark:text-blue-400" />
                            </div>
                            <span className="text-sm font-medium text-gray-800 dark:text-white text-center">Spieler</span>
                        </button>
                        <button 
                            onClick={() => navigate('/team/training')}
                            className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg p-3 transition-colors border border-gray-200 dark:border-gray-700"
                        >
                            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center mb-2">
                                <FaRunning className="text-green-600 dark:text-green-400" />
                            </div>
                            <span className="text-sm font-medium text-gray-800 dark:text-white text-center">Training</span>
                        </button>
                        <button 
                            onClick={() => navigate('/team/matchday')}
                            className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg p-3 transition-colors border border-gray-200 dark:border-gray-700"
                        >
                            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center mb-2">
                                <FaFutbol className="text-red-600 dark:text-red-400" />
                            </div>
                            <span className="text-sm font-medium text-gray-800 dark:text-white text-center">Matchday</span>
                        </button>
                        <button 
                            onClick={() => navigate('/tasks')}
                            className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg p-3 transition-colors border border-gray-200 dark:border-gray-700"
                        >
                            <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/50 flex items-center justify-center mb-2">
                                <FaClipboardList className="text-yellow-600 dark:text-yellow-400" />
                            </div>
                            <span className="text-sm font-medium text-gray-800 dark:text-white text-center">Aufgaben</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Wochenübersicht - Roter Faden */}
            <div className="mb-8">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-3 rounded-full">
                                <FaCalendarWeek className="text-xl" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                                    KW {getWeeklyContext().weekNumber} - {getWeeklyContext().weeklyFocus}
                                </h2>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {getWeeklyContext().weekRange} • {getCurrentSeasonPhase().phase}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/weekly-coach')}
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200"
                        >
                            <FaArrowRight />
                            <span>Wochenassistent</span>
                        </button>
                    </div>
                    
                    {/* Wöchentliche Empfehlungen */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {getWeeklyContext().suggestedActions.map((action, index) => (
                            <button
                                key={index}
                                onClick={action.action}
                                className="text-left p-4 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200 border border-gray-200 dark:border-gray-600"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                        <FaPlay className="text-blue-600 dark:text-blue-400 text-sm" />
                                    </div>
                                    <span className="font-medium text-gray-800 dark:text-white">{action.text}</span>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Wochenfortschritt */}
                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Diese Woche</span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                {moment().format('dddd')} - Tag {moment().isoWeekday()} von 7
                            </span>
                        </div>
                        <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                                className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full h-2 transition-all duration-300"
                                style={{ width: `${(moment().isoWeekday() / 7) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Layout>
    );
};

export default Dashboard;
