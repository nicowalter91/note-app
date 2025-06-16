import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import { useNavigate } from 'react-router-dom';
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
    FaDumbbell
} from 'react-icons/fa';
import { HiLightningBolt, HiTrendingUp, HiCollection, HiStatusOnline, HiHome, HiChartBar, HiUsers } from 'react-icons/hi';
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
        };

        const loadDashboardData = async () => {
            try {
                setLoading(true);
                  // Parallel laden aller Dashboard-Daten
                const [tasksRes, playersRes, exercisesRes, eventsRes, contactsRes] = await Promise.all([
                    axiosInstance.get("/get-all-tasks").catch(() => ({ data: { tasks: [] } })),
                    axiosInstance.get("/players").catch((error) => {
                        console.error("Player API error:", error);
                        return { data: { players: [] } };
                    }),
                    axiosInstance.get("/get-all-exercises").catch(() => ({ data: { exercises: [] } })),
                    axiosInstance.get("/get-all-events").catch(() => ({ data: { events: [] } })),
                    axiosInstance.get("/contacts").catch(() => ({ data: { contacts: [] } }))
                ]);

                console.log("Players response:", playersRes.data); // Debug Log

                const tasks = tasksRes.data.tasks || [];
                const players = playersRes.data.players || [];
                const exercises = exercisesRes.data.exercises || [];
                const events = eventsRes.data.events || [];
                const contacts = contactsRes.data.contacts || [];

                // Task-Statistiken berechnen
                const completedTasks = tasks.filter(task => task.status === 'completed').length;
                const pendingTasks = tasks.filter(task => task.status === 'pending').length;
                const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;

                // Kommende Events (nächste 7 Tage)
                const now = new Date();
                const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
                const upcomingEvents = events.filter(event => {
                    const eventDate = new Date(event.date);
                    return eventDate >= now && eventDate <= nextWeek;
                });

                // Neueste Items (letzte 5)
                const recentTasks = tasks
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .slice(0, 4);

                const recentPlayers = players
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .slice(0, 3);

                const recentExercises = exercises
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .slice(0, 3);

                setDashboardData({
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
                        thisWeek: upcomingEvents.slice(0, 3)
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

    if (loading) {
        return (
            <Layout>
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
    <Layout>
        <div className="container mx-auto px-4 py-6">
            {/* Begrüßung und Header - modern styled */}
            <div className="mb-8 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-md">
                <div className="flex items-center space-x-2 mb-1">
                    <HiHome className="text-2xl" />
                    <h2 className="text-lg font-medium opacity-90">Dashboard</h2>
                </div>
                <h1 className="text-3xl font-bold mb-2">{getGreeting()}, {userInfo?.name || 'Trainer'}!</h1>
                <p className="opacity-90">Hier ist ein Überblick über dein Team und anstehende Aufgaben.</p>
            </div>            {/* Statistikkarten - mit echten Daten */}
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
            </div>            {/* Schnellzugriffe */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                        <HiLightningBolt className="text-yellow-500 text-xl mr-2" />
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Schnellzugriffe</h2>
                    </div>
                </div>
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <button 
                        onClick={() => navigate('/players')}
                        className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-xl p-4 transition-colors border border-gray-200 dark:border-gray-700"
                    >
                        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mb-3">
                            <FaUserPlus className="text-blue-600 dark:text-blue-400 text-xl" />
                        </div>
                        <span className="font-medium text-gray-800 dark:text-white">Spieler hinzufügen</span>
                    </button>
                    <button 
                        onClick={() => navigate('/tasks')}
                        className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-xl p-4 transition-colors border border-gray-200 dark:border-gray-700"
                    >
                        <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center mb-3">
                            <FaPlus className="text-green-600 dark:text-green-400 text-xl" />
                        </div>
                        <span className="font-medium text-gray-800 dark:text-white">Neue Aufgabe</span>
                    </button>
                    <button 
                        onClick={() => navigate('/exercises')}
                        className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-xl p-4 transition-colors border border-gray-200 dark:border-gray-700"
                    >
                        <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center mb-3">
                            <FaDumbbell className="text-purple-600 dark:text-purple-400 text-xl" />
                        </div>
                        <span className="font-medium text-gray-800 dark:text-white">Training planen</span>
                    </button>
                    <button 
                        onClick={() => navigate('/contacts')}
                        className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-xl p-4 transition-colors border border-gray-200 dark:border-gray-700"
                    >
                        <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center mb-3">
                            <HiUsers className="text-orange-600 dark:text-orange-400 text-xl" />
                        </div>
                        <span className="font-medium text-gray-800 dark:text-white">Kontakte</span>
                    </button>
                </div>
            </div>
        </div>
    </Layout>
    );
};

export default Dashboard;
