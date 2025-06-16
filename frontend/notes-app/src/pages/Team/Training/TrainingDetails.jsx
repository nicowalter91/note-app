import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../../components/Layout/Layout';
import { 
    FaArrowLeft,
    FaDumbbell,
    FaEdit,
    FaTrash,
    FaUsers,
    FaClipboardList,
    FaPlay,
    FaPause,
    FaCheckCircle,
    FaExclamationTriangle,
    FaUser
} from 'react-icons/fa';
import { HiCalendar, HiClock, HiLocationMarker } from 'react-icons/hi';
import moment from 'moment';
import 'moment/locale/de';
import axiosInstance from '../../../utils/axiosInstance';

moment.locale('de');

const TrainingDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [training, setTraining] = useState(null);
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('overview'); // overview, exercises, attendance

    useEffect(() => {
        if (id) {
            fetchTraining();
            fetchPlayers();
        }
    }, [id]);

    const fetchTraining = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/get-event/${id}`);
            setTraining(response.data.event);
        } catch (err) {
            console.error('Fehler beim Laden des Trainings:', err);
            setError('Training nicht gefunden');
        } finally {
            setLoading(false);
        }
    };

    const fetchPlayers = async () => {
        try {
            const response = await axiosInstance.get('/players');
            setPlayers(response.data.players || []);
        } catch (err) {
            console.error('Fehler beim Laden der Spieler:', err);
        }
    };

    const updateAttendance = async (playerId, status) => {
        try {
            await axiosInstance.put(`/update-attendance/${id}`, {
                playerId,
                status
            });
            await fetchTraining(); // Refresh data
        } catch (err) {
            console.error('Fehler beim Aktualisieren der Anwesenheit:', err);
        }
    };

    const getAttendanceStats = () => {
        if (!training?.playerAttendance) return { present: 0, absent: 0, expected: 0 };
        
        const stats = training.playerAttendance.reduce((acc, attendance) => {
            acc[attendance.status] = (acc[attendance.status] || 0) + 1;
            return acc;
        }, {});
        
        return {
            present: stats.present || 0,
            absent: stats.absent || 0,
            expected: stats.expected || 0
        };
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'present': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
            case 'absent': return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
            case 'late': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
            default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'present': return <FaCheckCircle className="text-green-500" />;
            case 'absent': return <FaExclamationTriangle className="text-red-500" />;
            case 'late': return <FaClock className="text-yellow-500" />;
            default: return <FaUser className="text-gray-500" />;
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

    if (error || !training) {
        return (
            <Layout>
                <div className="container mx-auto px-4 py-6">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {error || 'Training nicht gefunden'}
                    </div>
                    <button 
                        onClick={() => navigate('/team/training')}
                        className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center"
                    >
                        <FaArrowLeft className="mr-2" />
                        Zurück zu Trainings
                    </button>
                </div>
            </Layout>
        );
    }

    const attendanceStats = getAttendanceStats();

    return (
        <Layout>
            <div className="container mx-auto px-4 py-6">
                {/* Back Button */}
                <button 
                    onClick={() => navigate('/team/training')}
                    className="mb-6 flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
                >
                    <FaArrowLeft className="mr-2" />
                    Zurück zu Trainings
                </button>

                {/* Training Header */}
                <div className="mb-8 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-6 shadow-md">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mr-4">
                                <FaDumbbell className="text-2xl" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold mb-2">{training.title}</h1>
                                <p className="opacity-90 text-lg">
                                    {moment(training.date).format('dddd, DD. MMMM YYYY')} • {training.time} Uhr
                                </p>
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2">
                                <FaEdit />
                                <span>Bearbeiten</span>
                            </button>
                            <button className="bg-red-500/20 hover:bg-red-500/30 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2">
                                <FaTrash />
                                <span>Löschen</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="mb-6">
                    <div className="flex space-x-1 bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm border border-gray-200 dark:border-gray-700 w-fit">
                        {[
                            { key: 'overview', label: 'Übersicht', icon: FaDumbbell },
                            { key: 'exercises', label: 'Übungen', icon: FaClipboardList },
                            { key: 'attendance', label: 'Anwesenheit', icon: FaUsers }
                        ].map(tab => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                                        activeTab === tab.key
                                            ? 'bg-green-500 text-white'
                                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    <Icon className="text-sm" />
                                    <span>{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Overview Tab */}
                        {activeTab === 'overview' && (
                            <div className="space-y-6">
                                {/* Basic Information */}
                                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
                                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Grundinformationen</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                                                <HiCalendar className="text-xl text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-800 dark:text-white">
                                                    {moment(training.date).format('dddd, DD. MMMM YYYY')}
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {moment(training.date).fromNow()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mr-3">
                                                <HiClock className="text-xl text-purple-600 dark:text-purple-400" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-800 dark:text-white">
                                                    {training.time} Uhr
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {training.duration || 90} Minuten
                                                </p>
                                            </div>
                                        </div>
                                        {training.location && (
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center mr-3">
                                                    <HiLocationMarker className="text-xl text-orange-600 dark:text-orange-400" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-800 dark:text-white">
                                                        {training.location}
                                                    </p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Trainingsort</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Description */}
                                {training.description && (
                                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
                                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Beschreibung</h2>
                                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                            {training.description}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Exercises Tab */}
                        {activeTab === 'exercises' && (
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Trainingsübungen</h2>
                                {training.trainingData?.exercises && training.trainingData.exercises.length > 0 ? (
                                    <div className="space-y-4">
                                        {training.trainingData.exercises.map((exercise, index) => (
                                            <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h3 className="font-semibold text-gray-800 dark:text-white">
                                                        {exercise.title}
                                                    </h3>
                                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                                        {exercise.duration} Min
                                                    </span>
                                                </div>
                                                <div className="text-sm text-gray-600 dark:text-gray-300">
                                                    <p><strong>Sätze:</strong> {exercise.sets || 1}</p>
                                                    {exercise.notes && <p><strong>Kategorie:</strong> {exercise.notes}</p>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <FaClipboardList className="mx-auto text-4xl text-gray-400 mb-4" />
                                        <p className="text-gray-500 dark:text-gray-400">Keine Übungen hinzugefügt</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Attendance Tab */}
                        {activeTab === 'attendance' && (
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Anwesenheitsliste</h2>
                                {training.playerAttendance && training.playerAttendance.length > 0 ? (
                                    <div className="space-y-3">
                                        {training.playerAttendance.map((attendance, index) => {
                                            const player = players.find(p => p._id === attendance.playerId);
                                            return (
                                                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                                            {getStatusIcon(attendance.status)}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-800 dark:text-white">
                                                                {player?.name || 'Unbekannter Spieler'}
                                                            </p>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                {player?.position} • #{player?.jerseyNumber}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(attendance.status)}`}>
                                                            {attendance.status === 'present' ? 'Anwesend' :
                                                             attendance.status === 'absent' ? 'Abwesend' :
                                                             attendance.status === 'late' ? 'Verspätet' : 'Erwartet'}
                                                        </span>
                                                        <select
                                                            value={attendance.status}
                                                            onChange={(e) => updateAttendance(attendance.playerId, e.target.value)}
                                                            className="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 dark:bg-gray-700 dark:text-white"
                                                        >
                                                            <option value="expected">Erwartet</option>
                                                            <option value="present">Anwesend</option>
                                                            <option value="absent">Abwesend</option>
                                                            <option value="late">Verspätet</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <FaUsers className="mx-auto text-4xl text-gray-400 mb-4" />
                                        <p className="text-gray-500 dark:text-gray-400">Keine Spieler eingeladen</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Stats */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Statistiken</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-300">Übungen:</span>
                                    <span className="font-medium text-gray-800 dark:text-white">
                                        {training.trainingData?.exercises?.length || 0}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-300">Eingeladene Spieler:</span>
                                    <span className="font-medium text-gray-800 dark:text-white">
                                        {training.playerAttendance?.length || 0}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-300">Anwesend:</span>
                                    <span className="font-medium text-green-600 dark:text-green-400">
                                        {attendanceStats.present}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-300">Abwesend:</span>
                                    <span className="font-medium text-red-600 dark:text-red-400">
                                        {attendanceStats.absent}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Aktionen</h3>
                            <div className="space-y-3">
                                <button className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center">
                                    <FaEdit className="mr-2" />
                                    Training bearbeiten
                                </button>
                                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center">
                                    <FaClipboardList className="mr-2" />
                                    Übungen hinzufügen
                                </button>
                                <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 py-2 px-4 rounded-lg transition-colors flex items-center justify-center">
                                    <FaUsers className="mr-2" />
                                    Spieler verwalten
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default TrainingDetails;
