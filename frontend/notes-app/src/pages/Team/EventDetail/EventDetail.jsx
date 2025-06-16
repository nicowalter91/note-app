import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../../components/Layout/Layout';
import { 
    FaArrowLeft,
    FaTrophy, 
    FaDumbbell, 
    FaCalendarAlt,
    FaMapMarkerAlt, 
    FaClock, 
    FaEdit,
    FaTrash,
    FaHome,
    FaRoad,
    FaUsers,
    FaClipboardList
} from 'react-icons/fa';
import { HiCalendar, HiClock, HiLocationMarker } from 'react-icons/hi';
import moment from 'moment';
import 'moment/locale/de';
import axiosInstance from '../../../utils/axiosInstance';

moment.locale('de');

const EventDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (id) {
            fetchEvent();
        }
    }, [id]);    const fetchEvent = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/get-event/${id}`);
            setEvent(response.data.event);
        } catch (err) {
            console.error('Fehler beim Laden des Events:', err);
            setError('Event nicht gefunden');
        } finally {
            setLoading(false);
        }
    };

    const getEventIcon = (type) => {
        switch (type) {
            case 'game': return <FaTrophy className="text-blue-500" />;
            case 'training': return <FaDumbbell className="text-green-500" />;
            default: return <FaCalendarAlt className="text-purple-500" />;
        }
    };

    const getEventTypeLabel = (type) => {
        switch (type) {
            case 'game': return 'Spiel';
            case 'training': return 'Training';
            default: return 'Event';
        }
    };

    const getEventHeaderColor = (type) => {
        switch (type) {
            case 'game': return 'from-blue-500 to-blue-600';
            case 'training': return 'from-green-500 to-green-600';
            default: return 'from-purple-500 to-purple-600';
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

    if (error || !event) {
        return (
            <Layout>
                <div className="container mx-auto px-4 py-6">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {error || 'Event nicht gefunden'}
                    </div>
                    <button 
                        onClick={() => navigate('/team/schedule')}
                        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
                    >
                        <FaArrowLeft className="mr-2" />
                        Zurück zum Spielplan
                    </button>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container mx-auto px-4 py-6">
                {/* Back Button */}
                <button 
                    onClick={() => navigate('/team/schedule')}
                    className="mb-6 flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
                >
                    <FaArrowLeft className="mr-2" />
                    Zurück zum Spielplan
                </button>

                {/* Event Header */}
                <div className={`mb-8 bg-gradient-to-r ${getEventHeaderColor(event.type)} text-white rounded-xl p-6 shadow-md`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mr-4">
                                {getEventIcon(event.type)}
                            </div>
                            <div>
                                <div className="flex items-center space-x-2 mb-1">
                                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                                        {getEventTypeLabel(event.type)}
                                    </span>
                                    {event.type === 'game' && event.gameData?.isHome !== undefined && (
                                        <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                                            {event.gameData.isHome ? <FaHome className="mr-1" /> : <FaRoad className="mr-1" />}
                                            {event.gameData.isHome ? 'Heimspiel' : 'Auswärtsspiel'}
                                        </span>
                                    )}
                                </div>
                                <h1 className="text-3xl font-bold mb-2">
                                    {event.type === 'game' && event.gameData?.opponent 
                                        ? `vs ${event.gameData.opponent}`
                                        : event.title
                                    }
                                </h1>
                                <p className="opacity-90 text-lg">
                                    {moment(event.date).format('dddd, DD. MMMM YYYY')} • {event.time} Uhr
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

                {/* Event Details */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Info */}
                    <div className="lg:col-span-2 space-y-6">
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
                                            {moment(event.date).format('dddd, DD. MMMM YYYY')}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {moment(event.date).fromNow()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mr-3">
                                        <HiClock className="text-xl text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800 dark:text-white">
                                            {event.time} Uhr
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {event.duration || 90} Minuten
                                        </p>
                                    </div>
                                </div>
                                {event.location && (
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center mr-3">
                                            <HiLocationMarker className="text-xl text-orange-600 dark:text-orange-400" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800 dark:text-white">
                                                {event.location}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {event.type === 'game' ? 'Spielort' : 'Trainingsort'}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        {event.description && (
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Beschreibung</h2>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                    {event.description}
                                </p>
                            </div>
                        )}

                        {/* Game-specific Information */}
                        {event.type === 'game' && event.gameData && (
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Spielinformationen</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {event.gameData.opponent && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Gegner</label>
                                            <p className="text-lg font-semibold text-gray-800 dark:text-white">
                                                {event.gameData.opponent}
                                            </p>
                                        </div>
                                    )}
                                    {event.gameData.competition && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Wettbewerb</label>
                                            <p className="text-lg font-semibold text-gray-800 dark:text-white">
                                                {event.gameData.competition}
                                            </p>
                                        </div>
                                    )}
                                    {event.gameData.importance && (
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Wichtigkeit</label>
                                            <p className={`text-lg font-semibold ${
                                                event.gameData.importance === 'high' ? 'text-red-600' :
                                                event.gameData.importance === 'medium' ? 'text-yellow-600' : 'text-green-600'
                                            }`}>
                                                {event.gameData.importance === 'high' ? 'Hoch' :
                                                 event.gameData.importance === 'medium' ? 'Mittel' : 'Niedrig'}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Actions */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Aktionen</h3>
                            <div className="space-y-3">
                                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center">
                                    <FaEdit className="mr-2" />
                                    Bearbeiten
                                </button>
                                {event.type === 'training' && (
                                    <button className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center">
                                        <FaClipboardList className="mr-2" />
                                        Übungen hinzufügen
                                    </button>
                                )}
                                <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 py-2 px-4 rounded-lg transition-colors flex items-center justify-center">
                                    <FaUsers className="mr-2" />
                                    Teilnehmer
                                </button>
                            </div>
                        </div>

                        {/* Event Status */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Status</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-300">Status:</span>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        moment(event.date).isAfter(moment()) 
                                            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                            : 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300'
                                    }`}>
                                        {moment(event.date).isAfter(moment()) ? 'Geplant' : 'Vergangen'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-300">Countdown:</span>
                                    <span className="font-medium text-gray-800 dark:text-white">
                                        {moment(event.date).fromNow()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default EventDetail;
