import React, { useState, useEffect } from 'react';
import Layout from '../../../components/Layout/Layout';
import { useNavigate } from 'react-router-dom';
import { 
    FaCalendarAlt, 
    FaTrophy, 
    FaDumbbell, 
    FaMapMarkerAlt, 
    FaClock, 
    FaPlus,
    FaHome,
    FaRoad
} from 'react-icons/fa';
import { HiCalendar, HiClock, HiLocationMarker, HiUsers } from 'react-icons/hi';
import moment from 'moment';
import 'moment/locale/de';
import axiosInstance from '../../../utils/axiosInstance';

moment.locale('de');

const Schedule = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedFilter, setSelectedFilter] = useState('all'); // all, game, training, event

    useEffect(() => {
        fetchEvents();
    }, []);    const fetchEvents = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/get-all-events');
            setEvents(response.data.events || []);
        } catch (err) {
            console.error('Fehler beim Laden der Events:', err);
            setError('Fehler beim Laden der Events');
        } finally {
            setLoading(false);
        }
    };

    const filteredEvents = events.filter(event => {
        if (selectedFilter === 'all') return true;
        return event.type === selectedFilter;
    });

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

    const getEventTypeColor = (type) => {
        switch (type) {
            case 'game': return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
            case 'training': return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
            default: return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300';
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="container mx-auto px-4 py-6">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-300 rounded mb-4"></div>
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-32 bg-gray-300 rounded"></div>
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
                <div className="mb-8 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center space-x-2 mb-1">
                                <FaCalendarAlt className="text-2xl" />
                                <h2 className="text-lg font-medium opacity-90">Spielplan & Termine</h2>
                            </div>
                            <h1 className="text-3xl font-bold mb-2">Alle Termine im Überblick</h1>
                            <p className="opacity-90">Verwalte Spiele, Trainings und andere wichtige Termine</p>
                        </div>
                        <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2">
                            <FaPlus />
                            <span>Neuer Termin</span>
                        </button>
                    </div>
                </div>

                {/* Filter */}
                <div className="mb-6">
                    <div className="flex space-x-2 bg-white dark:bg-gray-800 rounded-lg p-2 shadow-sm border border-gray-200 dark:border-gray-700 w-fit">
                        {[
                            { key: 'all', label: 'Alle', icon: FaCalendarAlt },
                            { key: 'game', label: 'Spiele', icon: FaTrophy },
                            { key: 'training', label: 'Trainings', icon: FaDumbbell }
                        ].map(filter => {
                            const Icon = filter.icon;
                            return (
                                <button
                                    key={filter.key}
                                    onClick={() => setSelectedFilter(filter.key)}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                                        selectedFilter === filter.key
                                            ? 'bg-blue-500 text-white'
                                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    <Icon className="text-sm" />
                                    <span>{filter.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Events List */}
                {error ? (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                ) : filteredEvents.length === 0 ? (
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-8 text-center">
                        <FaCalendarAlt className="mx-auto text-4xl text-gray-400 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
                            Keine Termine gefunden
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            {selectedFilter === 'all' ? 'Es sind noch keine Termine geplant.' : `Es sind keine ${selectedFilter === 'game' ? 'Spiele' : 'Trainings'} geplant.`}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredEvents
                            .sort((a, b) => new Date(a.date) - new Date(b.date))
                            .map(event => (
                            <div key={event._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-700">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-4 flex-1">
                                        <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xl">
                                            {getEventIcon(event.type)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                                                    {event.type === 'game' && event.gameData?.opponent 
                                                        ? `vs ${event.gameData.opponent}`
                                                        : event.title
                                                    }
                                                </h3>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEventTypeColor(event.type)}`}>
                                                    {getEventTypeLabel(event.type)}
                                                </span>
                                                {event.type === 'game' && event.gameData?.isHome !== undefined && (
                                                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                        event.gameData.isHome 
                                                            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
                                                            : 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
                                                    }`}>
                                                        {event.gameData.isHome ? <FaHome className="inline mr-1" /> : <FaRoad className="inline mr-1" />}
                                                        {event.gameData.isHome ? 'Heim' : 'Auswärts'}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                                <div className="flex items-center text-gray-600 dark:text-gray-300">
                                                    <HiCalendar className="mr-2 text-blue-500" />
                                                    <div>
                                                        <p className="font-medium">{moment(event.date).format('dddd, DD. MMMM YYYY')}</p>
                                                        <p className="text-xs">{moment(event.date).fromNow()}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center text-gray-600 dark:text-gray-300">
                                                    <HiClock className="mr-2 text-purple-500" />
                                                    <div>
                                                        <p className="font-medium">{event.time} Uhr</p>
                                                        <p className="text-xs">{event.duration || 90} Minuten</p>
                                                    </div>
                                                </div>
                                                {event.location && (
                                                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                                                        <HiLocationMarker className="mr-2 text-orange-500" />
                                                        <div>
                                                            <p className="font-medium">{event.location}</p>
                                                            <p className="text-xs">Ort</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            {event.description && (
                                                <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                                                    <p>{event.description}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>                                    <div className="flex flex-col space-y-2">
                                        <button 
                                            onClick={() => navigate(`/team/event/${event._id}`)}
                                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm"
                                        >
                                            Details
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
        </Layout>
    );
};

export default Schedule;
