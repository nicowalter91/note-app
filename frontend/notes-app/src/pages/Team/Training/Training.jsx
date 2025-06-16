import React, { useState, useEffect } from 'react';
import Layout from '../../../components/Layout/Layout';
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
    const [trainings, setTrainings] = useState([]);
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
    };

    const fetchExercises = async () => {
        try {
            const response = await axiosInstance.get('/exercises');
            setExercises(response.data || []);
        } catch (err) {
            console.error('Fehler beim Laden der Übungen:', err);
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
                        </div>
                        <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2">
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
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Upcoming Trainings */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
                                <FaCalendarAlt className="text-green-500 mr-2" />
                                Anstehende Trainings
                            </h3>
                        </div>
                        <div className="p-6">
                            {getUpcomingTrainings().length === 0 ? (
                                <div className="text-center py-8">
                                    <FaDumbbell className="mx-auto text-4xl text-gray-400 mb-4" />
                                    <p className="text-gray-500 dark:text-gray-400">Keine anstehenden Trainings</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {getUpcomingTrainings().map(training => (
                                        <div key={training._id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                            <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                                                {training.title}
                                            </h4>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex items-center text-gray-600 dark:text-gray-300">
                                                    <HiCalendar className="mr-2 text-blue-500" />
                                                    <span>{moment(training.date).format('dddd, DD. MMMM YYYY')}</span>
                                                </div>
                                                <div className="flex items-center text-gray-600 dark:text-gray-300">
                                                    <HiClock className="mr-2 text-purple-500" />
                                                    <span>{training.time} Uhr ({training.duration || 90} Min)</span>
                                                </div>
                                                {training.location && (
                                                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                                                        <HiLocationMarker className="mr-2 text-orange-500" />
                                                        <span>{training.location}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recent Trainings */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
                                <FaPlayCircle className="text-blue-500 mr-2" />
                                Vergangene Trainings
                            </h3>
                        </div>
                        <div className="p-6">
                            {getPastTrainings().length === 0 ? (
                                <div className="text-center py-8">
                                    <FaPlayCircle className="mx-auto text-4xl text-gray-400 mb-4" />
                                    <p className="text-gray-500 dark:text-gray-400">Noch keine Trainings durchgeführt</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {getPastTrainings().map(training => (
                                        <div key={training._id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                            <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                                                {training.title}
                                            </h4>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex items-center text-gray-600 dark:text-gray-300">
                                                    <HiCalendar className="mr-2 text-blue-500" />
                                                    <span>{moment(training.date).format('DD. MMMM YYYY')}</span>
                                                </div>
                                                <div className="flex items-center text-gray-600 dark:text-gray-300">
                                                    <HiClock className="mr-2 text-purple-500" />
                                                    <span>{training.time} Uhr</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
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
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button className="flex flex-col items-center justify-center bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-xl p-6 transition-colors border border-green-200 dark:border-green-800">
                            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-3">
                                <FaPlus className="text-green-600 dark:text-green-400 text-xl" />
                            </div>
                            <span className="font-medium text-gray-800 dark:text-white">Neues Training</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">Training erstellen</span>
                        </button>
                        
                        <button className="flex flex-col items-center justify-center bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-xl p-6 transition-colors border border-blue-200 dark:border-blue-800">
                            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-3">
                                <FaDumbbell className="text-blue-600 dark:text-blue-400 text-xl" />
                            </div>
                            <span className="font-medium text-gray-800 dark:text-white">Übungen</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">Übungen verwalten</span>
                        </button>
                        
                        <button className="flex flex-col items-center justify-center bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-xl p-6 transition-colors border border-purple-200 dark:border-purple-800">
                            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-3">
                                <FaCalendarAlt className="text-purple-600 dark:text-purple-400 text-xl" />
                            </div>
                            <span className="font-medium text-gray-800 dark:text-white">Kalender</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">Alle Termine</span>
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Training;
