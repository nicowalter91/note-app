import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import { 
    FaChartLine, 
    FaCalendarAlt, 
    FaUsers, 
    FaClipboardList, 
    FaCheckCircle, 
    FaClock, 
    FaExclamationCircle, 
    FaBan,
    FaArrowUp,
    FaArrowDown,
    FaPlus,
    FaUserAlt,
    FaRegCalendarAlt,
    FaRegClock,
    FaTasks,
    FaPlusCircle
} from 'react-icons/fa';
import { HiLightningBolt, HiTrendingUp, HiCollection, HiStatusOnline, HiHome, HiChartBar } from 'react-icons/hi';
import { 
    LineChart, 
    Line, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer, 
    BarChart, 
    Bar,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';
import axiosInstance from '../../utils/axiosInstance';
import moment from 'moment';
import 'moment/locale/de';

const Dashboard = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalTasks: 0,
        completedTasks: 0,
        pendingTasks: 0,
        upcomingEvents: 0
    });
    const [recentTasks, setRecentTasks] = useState([]);

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
            } finally {
                setLoading(false);
            }
        };

        const getStats = async () => {
            // In einer realen Anwendung würden wir hier die Statistiken vom Backend abrufen
            // Da wir keinen direkten Zugriff auf die API haben, verwenden wir Beispieldaten
            setStats({
                totalTasks: 24,
                completedTasks: 18,
                pendingTasks: 6,
                upcomingEvents: 3
            });

            // Beispieldaten für die letzten Aufgaben
            setRecentTasks([
                { id: 1, title: 'Spielanalyse abschließen', status: 'completed', priority: 'high', dueDate: new Date() },
                { id: 2, title: 'Trainingsplan erstellen', status: 'pending', priority: 'medium', dueDate: new Date(Date.now() + 86400000) },
                { id: 3, title: 'Teambesprechung vorbereiten', status: 'in-progress', priority: 'high', dueDate: new Date(Date.now() + 172800000) },
                { id: 4, title: 'Spielerprofile aktualisieren', status: 'pending', priority: 'low', dueDate: new Date(Date.now() + 259200000) }
            ]);
        };

        getUserInfo();
        getStats();
    }, []);

    // Daten für Leistungsdiagramm
    const performanceData = [
        { name: 'Jan', performance: 80, average: 75 },
        { name: 'Feb', performance: 85, average: 76 },
        { name: 'Mär', performance: 78, average: 77 },
        { name: 'Apr', performance: 90, average: 78 },
        { name: 'Mai', performance: 88, average: 79 },
        { name: 'Jun', performance: 92, average: 80 }
    ];

    // Daten für Anwesenheitsdiagramm
    const attendanceData = [
        { name: 'Woche 1', attendance: 20, target: 22 },
        { name: 'Woche 2', attendance: 18, target: 22 },
        { name: 'Woche 3', attendance: 22, target: 22 },
        { name: 'Woche 4', attendance: 19, target: 22 }
    ];

    // Daten für Aufgabenstatus-Diagramm
    const taskStatusData = [
        { name: 'Abgeschlossen', value: stats.completedTasks, color: '#4ade80' },
        { name: 'Ausstehend', value: stats.pendingTasks, color: '#f97316' },
    ];

    // Status-Badge anzeigen
    const getStatusBadge = (status) => {
        switch(status) {
            case 'completed':
                return <span className="flex items-center text-green-500"><FaCheckCircle className="mr-1" /> Abgeschlossen</span>;
            case 'pending':
                return <span className="flex items-center text-orange-500"><FaClock className="mr-1" /> Ausstehend</span>;
            case 'in-progress':
                return <span className="flex items-center text-blue-500"><HiStatusOnline className="mr-1" /> In Bearbeitung</span>;
            case 'cancelled':
                return <span className="flex items-center text-red-500"><FaBan className="mr-1" /> Abgebrochen</span>;
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
            </div>

            {/* Statistikkarten - modernized grid with responsive design */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Karte 1: Gesamtaufgaben */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Gesamtaufgaben</p>
                                <p className="text-3xl font-bold text-gray-800 dark:text-white mt-1">{stats.totalTasks}</p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                <FaTasks className="text-xl text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm">
                            <span className="text-green-500 flex items-center">
                                <FaArrowUp className="mr-1" />
                                {Math.round((stats.completedTasks / stats.totalTasks) * 100)}%
                            </span>
                            <span className="text-gray-500 dark:text-gray-400 ml-2">abgeschlossen</span>
                        </div>
                    </div>
                </div>

                {/* Karte 2: Abgeschlossene Aufgaben */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Abgeschlossen</p>
                                <p className="text-3xl font-bold text-gray-800 dark:text-white mt-1">{stats.completedTasks}</p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                                <FaCheckCircle className="text-xl text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm">
                            <span className="text-green-500 flex items-center">
                                <HiTrendingUp className="mr-1" />
                                Produktivität steigt
                            </span>
                        </div>
                    </div>
                </div>

                {/* Karte 3: Ausstehende Aufgaben */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Ausstehend</p>
                                <p className="text-3xl font-bold text-gray-800 dark:text-white mt-1">{stats.pendingTasks}</p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                                <FaRegClock className="text-xl text-orange-600 dark:text-orange-400" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm">
                            <span className="text-orange-500 flex items-center">
                                <FaExclamationCircle className="mr-1" />
                                Benötigen Aufmerksamkeit
                            </span>
                        </div>
                    </div>
                </div>

                {/* Karte 4: Anstehende Ereignisse */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Anstehende Ereignisse</p>
                                <p className="text-3xl font-bold text-gray-800 dark:text-white mt-1">{stats.upcomingEvents}</p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                                <FaRegCalendarAlt className="text-xl text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm">
                            <span className="text-purple-500 flex items-center">
                                <HiCollection className="mr-1" />
                                Diese Woche
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Zwei-Spalten-Layout für Diagramme und Aufgaben */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Linke Spalte: Diagramme */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Leistungsdiagramm */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center">
                                <HiChartBar className="text-blue-500 text-xl mr-2" />
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Teamleistung</h2>
                            </div>
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                <span className="flex items-center mr-4">
                                    <span className="w-3 h-3 rounded-full bg-blue-500 mr-1"></span>
                                    Aktuell
                                </span>
                                <span className="flex items-center">
                                    <span className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600 mr-1"></span>
                                    Durchschnitt
                                </span>
                            </div>
                        </div>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={performanceData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis dataKey="name" stroke="#9ca3af" />
                                    <YAxis stroke="#9ca3af" />
                                    <Tooltip 
                                        contentStyle={{ 
                                            backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                                            borderRadius: '0.5rem',
                                            border: 'none',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                        }} 
                                    />
                                    <Line 
                                        type="monotone" 
                                        dataKey="performance" 
                                        stroke="#3b82f6" 
                                        strokeWidth={3}
                                        dot={{ r: 6, strokeWidth: 2 }}
                                        activeDot={{ r: 8, strokeWidth: 2 }}
                                    />
                                    <Line 
                                        type="monotone" 
                                        dataKey="average" 
                                        stroke="#9ca3af" 
                                        strokeWidth={2}
                                        strokeDasharray="5 5"
                                        dot={{ r: 4, strokeWidth: 2 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    
                    {/* Anwesenheitsdiagramm */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center">
                                <FaUsers className="text-green-500 text-xl mr-2" />
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Teamanwesenheit</h2>
                            </div>
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                <span className="flex items-center mr-4">
                                    <span className="w-3 h-3 rounded-full bg-green-500 mr-1"></span>
                                    Anwesend
                                </span>
                                <span className="flex items-center">
                                    <span className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600 mr-1"></span>
                                    Ziel
                                </span>
                            </div>
                        </div>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={attendanceData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis dataKey="name" stroke="#9ca3af" />
                                    <YAxis stroke="#9ca3af" />
                                    <Tooltip 
                                        contentStyle={{ 
                                            backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                                            borderRadius: '0.5rem',
                                            border: 'none',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                        }} 
                                    />
                                    <Bar dataKey="attendance" fill="#10b981" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="target" fill="#d1d5db" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Rechte Spalte: Aufgaben und Statistiken */}
                <div className="space-y-8">
                    {/* Aufgabenstatistik */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center mb-6">
                            <FaChartLine className="text-blue-500 text-xl mr-2" />
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Aufgabenübersicht</h2>
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

                    {/* Neueste Aufgaben */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                            <div className="flex items-center">
                                <FaClipboardList className="text-orange-500 text-xl mr-2" />
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Aktuelle Aufgaben</h2>
                            </div>
                            <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium text-sm">
                                Alle anzeigen
                            </button>
                        </div>
                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                            {recentTasks.map((task) => (
                                <div key={task.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-base font-medium text-gray-800 dark:text-white">{task.title}</h3>
                                        {getPriorityBadge(task.priority)}
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        {getStatusBadge(task.status)}
                                        <span className="text-gray-500 dark:text-gray-400">{formatDate(task.dueDate)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/20 border-t border-gray-200 dark:border-gray-700">
                            <button className="w-full py-2 flex items-center justify-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                <FaPlusCircle className="mr-2" />
                                Aufgabe hinzufügen
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Schnellzugriffe */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                        <HiLightningBolt className="text-yellow-500 text-xl mr-2" />
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Schnellzugriffe</h2>
                    </div>
                </div>
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <button className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-xl p-4 transition-colors border border-gray-200 dark:border-gray-700">
                        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mb-3">
                            <FaUsers className="text-blue-600 dark:text-blue-400 text-xl" />
                        </div>
                        <span className="font-medium text-gray-800 dark:text-white">Team verwalten</span>
                    </button>
                    <button className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-xl p-4 transition-colors border border-gray-200 dark:border-gray-700">
                        <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center mb-3">
                            <FaCalendarAlt className="text-green-600 dark:text-green-400 text-xl" />
                        </div>
                        <span className="font-medium text-gray-800 dark:text-white">Ereignis planen</span>
                    </button>
                    <button className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-xl p-4 transition-colors border border-gray-200 dark:border-gray-700">
                        <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center mb-3">
                            <FaClipboardList className="text-purple-600 dark:text-purple-400 text-xl" />
                        </div>
                        <span className="font-medium text-gray-800 dark:text-white">Neue Aufgabe</span>
                    </button>
                    <button className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-xl p-4 transition-colors border border-gray-200 dark:border-gray-700">
                        <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center mb-3">
                            <HiLightningBolt className="text-orange-600 dark:text-orange-400 text-xl" />
                        </div>
                        <span className="font-medium text-gray-800 dark:text-white">Schnellaktionen</span>
                    </button>
                </div>
            </div>
        </div>
    </Layout>
    );
};

export default Dashboard;
