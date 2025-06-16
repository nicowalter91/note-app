import React, { useState, useEffect } from 'react';
import Layout from '../../../components/Layout/Layout';
import AddTraining from '../../../components/Training/AddTraining';
import { useNavigate } from 'react-router-dom';
import { 
    FaDumbbell, 
    FaCalendarAlt, 
    FaClock, 
    FaMapMarkerAlt, 
    FaPlus,
    FaUsers,
    FaClipboardList,
    FaPlayCircle
} from 'react-icons/fa';
import { HiCalendar, HiClock, HiLocationMarker, HiUsers as HiUsersIcon } from 'react-icons/hi';
import moment from 'moment';
import 'moment/locale/de';
import axiosInstance from '../../../utils/axiosInstance';

moment.locale('de');

const Training = () => {
    const navigate = useNavigate();
    const [trainings, setTrainings] = useState([]);
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddTraining, setShowAddTraining] = useState(false);
    const [selectedView, setSelectedView] = useState('upcoming'); // upcoming, past, all

    useEffect(() => {
        fetchTrainings();
        fetchExercises();
    }, []);    const fetchTrainings = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/get-all-events');
            const trainingEvents = (response.data.events || []).filter(event => event.type === 'training');
            setTrainings(trainingEvents);
        } catch (err) {
            console.error('Fehler beim Laden der Trainings:', err);
            setError('Fehler beim Laden der Trainings');
        } finally {
            setLoading(false);
        }
    };    const fetchExercises = async () => {
        try {
            const response = await axiosInstance.get('/get-all-exercises');
            setExercises(response.data.exercises || []);
        } catch (err) {
            console.error('Fehler beim Laden der Übungen:', err);
        }
    };

    const handleTrainingAdded = () => {
        fetchTrainings(); // Refresh trainings list
    };

    const getFilteredTrainings = () => {
        const now = new Date();
        switch (selectedView) {
            case 'upcoming':
                return trainings.filter(training => new Date(training.date) >= now);
            case 'past':
                return trainings.filter(training => new Date(training.date) < now);
            default:
                return trainings;
        }
    };

    const getUpcomingTrainings = () => {
        const now = new Date();
        return trainings
            .filter(training => new Date(training.date) >= now)
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 3);
    };

    const getPastTrainings = () => {
        const now = new Date();
        return trainings
            .filter(training => new Date(training.date) < now)
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);
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
                <div className="mb-8 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-6 shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center space-x-2 mb-1">
                                <FaDumbbell className="text-2xl" />
                                <h2 className="text-lg font-medium opacity-90">Trainingsplanung</h2>
                            </div>
                            <h1 className="text-3xl font-bold mb-2">Training organisieren</h1>
                            <p className="opacity-90">Plane und verwalte alle Trainingseinheiten deines Teams</p>
                        </div>                        <button 
                            onClick={() => setShowAddTraining(true)}
                            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                        >
                            <FaPlus />
                            <span>Neues Training</span>
                        </button>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Geplante Trainings</p>
                                <p className="text-2xl font-bold text-gray-800 dark:text-white">{getUpcomingTrainings().length}</p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                                <FaCalendarAlt className="text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Verfügbare Übungen</p>
                                <p className="text-2xl font-bold text-gray-800 dark:text-white">{exercises.length}</p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                <FaClipboardList className="text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Diese Woche</p>
                                <p className="text-2xl font-bold text-gray-800 dark:text-white">
                                    {trainings.filter(t => {
                                        const trainDate = moment(t.date);
                                        return trainDate.isSame(moment(), 'week');
                                    }).length}
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                                <FaDumbbell className="text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Durchgeführt</p>
                                <p className="text-2xl font-bold text-gray-800 dark:text-white">{getPastTrainings().length}</p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                                <FaPlayCircle className="text-orange-600 dark:text-orange-400" />
                            </div>
                        </div>
                    </div>
                </div>                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Filter Tabs */}
                    <div className="lg:col-span-2 mb-6">
                        <div className="flex space-x-2 bg-white dark:bg-gray-800 rounded-lg p-2 shadow-sm border border-gray-200 dark:border-gray-700 w-fit">
                            {[
                                { key: 'upcoming', label: 'Anstehend', count: trainings.filter(t => new Date(t.date) >= new Date()).length },
                                { key: 'past', label: 'Vergangen', count: trainings.filter(t => new Date(t.date) < new Date()).length },
                                { key: 'all', label: 'Alle', count: trainings.length }
                            ].map(tab => (
                                <button
                                    key={tab.key}
                                    onClick={() => setSelectedView(tab.key)}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                                        selectedView === tab.key
                                            ? 'bg-green-500 text-white'
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

                    {/* Training List */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
                            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
                                    <FaCalendarAlt className="text-green-500 mr-2" />
                                    {selectedView === 'upcoming' ? 'Anstehende Trainings' : 
                                     selectedView === 'past' ? 'Vergangene Trainings' : 
                                     'Alle Trainings'}
                                </h3>
                            </div>
                            <div className="p-6">
                                {getFilteredTrainings().length === 0 ? (
                                    <div className="text-center py-12">
                                        <FaDumbbell className="mx-auto text-6xl text-gray-400 mb-4" />
                                        <h4 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
                                            {selectedView === 'upcoming' ? 'Keine anstehenden Trainings' :
                                             selectedView === 'past' ? 'Noch keine Trainings durchgeführt' :
                                             'Keine Trainings vorhanden'}
                                        </h4>
                                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                                            {selectedView === 'upcoming' 
                                                ? 'Erstellen Sie Ihr erstes Training für das Team'
                                                : 'Trainings erscheinen hier nach der Erstellung'
                                            }
                                        </p>
                                        {selectedView !== 'past' && (
                                            <button
                                                onClick={() => setShowAddTraining(true)}
                                                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors flex items-center space-x-2 mx-auto"
                                            >
                                                <FaPlus />
                                                <span>Erstes Training erstellen</span>
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {getFilteredTrainings()
                                            .sort((a, b) => selectedView === 'past' 
                                                ? new Date(b.date) - new Date(a.date)
                                                : new Date(a.date) - new Date(b.date)
                                            )
                                            .map(training => (
                                            <div key={training._id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center space-x-3 mb-3">
                                                            <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
                                                                {training.title}
                                                            </h4>
                                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                                new Date(training.date) >= new Date()
                                                                    ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                                                    : 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300'
                                                            }`}>
                                                                {new Date(training.date) >= new Date() ? 'Geplant' : 'Abgeschlossen'}
                                                            </span>
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                                                            <div className="flex items-center text-gray-600 dark:text-gray-300">
                                                                <HiCalendar className="mr-2 text-blue-500" />
                                                                <div>
                                                                    <p className="font-medium">
                                                                        {moment(training.date).format('dddd, DD. MMMM')}
                                                                    </p>
                                                                    <p className="text-xs">
                                                                        {moment(training.date).fromNow()}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center text-gray-600 dark:text-gray-300">
                                                                <HiClock className="mr-2 text-purple-500" />
                                                                <div>
                                                                    <p className="font-medium">{training.time} Uhr</p>
                                                                    <p className="text-xs">{training.duration || 90} Min</p>
                                                                </div>
                                                            </div>
                                                            {training.location && (
                                                                <div className="flex items-center text-gray-600 dark:text-gray-300">
                                                                    <HiLocationMarker className="mr-2 text-orange-500" />
                                                                    <div>
                                                                        <p className="font-medium">{training.location}</p>
                                                                        <p className="text-xs">Trainingsort</p>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                        {training.trainingData?.exercises && training.trainingData.exercises.length > 0 && (
                                                            <div className="mt-3 text-sm">
                                                                <p className="text-gray-600 dark:text-gray-300 mb-1">
                                                                    <FaClipboardList className="inline mr-1 text-green-500" />
                                                                    {training.trainingData.exercises.length} Übung{training.trainingData.exercises.length !== 1 ? 'en' : ''}
                                                                </p>
                                                                <div className="flex flex-wrap gap-1">
                                                                    {training.trainingData.exercises.slice(0, 3).map((exercise, index) => (
                                                                        <span key={index} className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded text-xs">
                                                                            {exercise.title}
                                                                        </span>
                                                                    ))}
                                                                    {training.trainingData.exercises.length > 3 && (
                                                                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs">
                                                                            +{training.trainingData.exercises.length - 3} weitere
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                        {training.playerAttendance && training.playerAttendance.length > 0 && (
                                                            <div className="mt-2 text-sm">
                                                                <p className="text-gray-600 dark:text-gray-300">
                                                                    <FaUsers className="inline mr-1 text-blue-500" />
                                                                    {training.playerAttendance.length} Spieler eingeladen
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col space-y-2 ml-4">                                                        <button
                                                            onClick={() => navigate(`/team/training/${training._id}`)}
                                                            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-sm flex items-center space-x-1"
                                                        >
                                                            <FaDumbbell className="text-xs" />
                                                            <span>Details</span>
                                                        </button>
                                                        <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors text-sm">
                                                            Bearbeiten
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
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
                            <FaPlus className="text-green-500 mr-2" />
                            Schnellaktionen
                        </h3>
                    </div>                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button 
                            onClick={() => setShowAddTraining(true)}
                            className="flex flex-col items-center justify-center bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-xl p-6 transition-colors border border-green-200 dark:border-green-800"
                        >
                            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-3">
                                <FaPlus className="text-green-600 dark:text-green-400 text-xl" />
                            </div>
                            <span className="font-medium text-gray-800 dark:text-white">Neues Training</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">Training erstellen</span>
                        </button>
                        
                        <button 
                            onClick={() => navigate('/exercises')}
                            className="flex flex-col items-center justify-center bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-xl p-6 transition-colors border border-blue-200 dark:border-blue-800"
                        >
                            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-3">
                                <FaDumbbell className="text-blue-600 dark:text-blue-400 text-xl" />
                            </div>
                            <span className="font-medium text-gray-800 dark:text-white">Übungen</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">Übungen verwalten</span>
                        </button>
                        
                        <button 
                            onClick={() => navigate('/team/schedule')}
                            className="flex flex-col items-center justify-center bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-xl p-6 transition-colors border border-purple-200 dark:border-purple-800"
                        >
                            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-3">
                                <FaCalendarAlt className="text-purple-600 dark:text-purple-400 text-xl" />
                            </div>
                            <span className="font-medium text-gray-800 dark:text-white">Kalender</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">Alle Termine</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Add Training Modal */}
            <AddTraining
                isOpen={showAddTraining}
                onClose={() => setShowAddTraining(false)}
                onTrainingAdded={handleTrainingAdded}
            />
        </Layout>
    );
};

export default Training;
