import React, { useState, useEffect, useMemo } from 'react';
import Layout from '../../../components/Layout/Layout';
import { PageHeader, Card, Button, Badge, StatsGrid, LoadingSpinner, EmptyState } from '../../../components/UI/DesignSystem';
import { 
    FaCalendarAlt, 
    FaPlus, 
    FaFilter, 
    FaEdit, 
    FaTrash,
    FaMapMarkerAlt,
    FaClock,
    FaUsers,
    FaFutbol,
    FaEye,
    FaCalendarCheck,
    FaCalendarTimes
} from 'react-icons/fa';
import { getAllEvents, deleteEvent, formatEventFromAPI } from '../../../utils/eventService';

const Schedule = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState('all');
    const [selectedView, setSelectedView] = useState('list');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [selectedEventDetail, setSelectedEventDetail] = useState(null);
    const [currentCalendarMonth, setCurrentCalendarMonth] = useState(() => {
        const now = new Date();
        return {
            year: now.getFullYear(),
            month: now.getMonth()
        };
    });    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const response = await getAllEvents();
            if (response.error) {
                console.error('Error fetching events:', response.message);
                setEvents([]);
            } else {
                // Format events from API and convert terminology
                const formattedEvents = response.events.map(event => {
                    const formatted = formatEventFromAPI(event);
                    // Convert backend 'game' type to frontend 'match' type
                    if (formatted.type === 'game') {
                        formatted.type = 'match';
                    }
                    return formatted;
                });
                setEvents(formattedEvents);
            }
        } catch (error) {
            console.error('Error fetching events:', error);
            setEvents([]);
        } finally {
            setLoading(false);
        }
    };

    const getEventTypeColor = (type) => {
        switch (type) {
            case 'match': return 'primary';
            case 'training': return 'success';
            case 'friendly': return 'warning';
            default: return 'secondary';
        }
    };

    const getEventTypeLabel = (type) => {
        switch (type) {
            case 'match': return 'Spiel';
            case 'training': return 'Training';
            case 'friendly': return 'Freundschaftsspiel';
            default: return type;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'scheduled': return 'primary';
            case 'completed': return 'success';
            case 'cancelled': return 'danger';
            default: return 'secondary';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'scheduled': return 'Geplant';
            case 'completed': return 'Abgeschlossen';
            case 'cancelled': return 'Abgesagt';
            default: return status;
        }
    };    const filteredEvents = filterType === 'all' 
        ? events 
        : events.filter(event => event.type === filterType);

    const scheduleStats = useMemo(() => [
        {
            label: 'Kommende Spiele',
            value: events.filter(e => e.type === 'match' && e.status === 'scheduled').length.toString(),
            icon: FaFutbol,
            color: 'blue'
        },
        {
            label: 'Trainings',
            value: events.filter(e => e.type === 'training' && e.status === 'scheduled').length.toString(),
            icon: FaUsers,
            color: 'green'
        },
        {
            label: 'Diese Woche',
            value: events.filter(e => {
                const eventDate = new Date(e.date);
                const now = new Date();
                const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
                return eventDate >= now && eventDate <= weekFromNow;
            }).length.toString(),
            icon: FaCalendarCheck,
            color: 'purple'
        },
        {
            label: 'Gesamt Events',
            value: events.length.toString(),
            icon: FaCalendarAlt,
            color: 'orange'
        }
    ], [events]);

    const filterTypes = [
        { id: 'all', label: 'Alle' },
        { id: 'match', label: 'Spiele' },
        { id: 'training', label: 'Training' },
        { id: 'friendly', label: 'Freundschaftsspiele' }
    ];    if (loading) {
        console.log('Schedule is loading...');
        return (
            <Layout>
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <p className="text-gray-600">Lade Spielplan...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    console.log('Schedule render - events:', events.length, 'filteredEvents:', filteredEvents.length);

    // Event-Handler Funktionen
    const handleAddEvent = () => {
        setShowAddModal(true);
        console.log('Neuer Termin erstellen');
    };

    const handleShowFilter = () => {
        setShowFilterModal(true);
        console.log('Filter-Optionen anzeigen');
    };    const handleViewEvent = (eventId) => {
        const event = events.find(e => e.id === eventId);
        setSelectedEventDetail(event);
        console.log('Event anzeigen:', eventId);
    };

    const handleEditEvent = (eventId) => {
        const event = events.find(e => e.id === eventId);
        setEditingEvent(event);
        setShowAddModal(true);
        console.log('Event bearbeiten:', eventId);
    };    const handleDeleteEvent = async (eventId) => {
        if (window.confirm('Möchten Sie diesen Termin wirklich löschen?')) {
            try {
                const response = await deleteEvent(eventId);
                if (response.error) {
                    console.error('Error deleting event:', response.message);
                } else {
                    // Remove from local state
                    setEvents(prevEvents => prevEvents.filter(e => e.id !== eventId));
                    console.log('Event erfolgreich gelöscht:', eventId);
                }
            } catch (error) {
                console.error('Error deleting event:', error);
            }
        }
    };const handleCloseModals = () => {
        setShowAddModal(false);
        setShowFilterModal(false);
        setEditingEvent(null);
        setSelectedEventDetail(null);
    };    // Kalender-Helper-Funktionen
    const getCurrentMonth = () => {
        const now = new Date();
        return {
            year: now.getFullYear(),
            month: now.getMonth()
        };
    };

    const getDaysInMonth = (year, month) => {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();
        
        const days = [];
        
        // Leere Tage am Anfang
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }
        
        // Tage des Monats
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(day);
        }
        
        return days;
    };

    const getEventsForDate = (year, month, day) => {
        const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return filteredEvents.filter(event => event.date === dateString);
    };

    const navigateMonth = (direction) => {
        setCurrentCalendarMonth(prev => {
            const newMonth = direction === 'prev' ? prev.month - 1 : prev.month + 1;
            if (newMonth < 0) {
                return { year: prev.year - 1, month: 11 };
            } else if (newMonth > 11) {
                return { year: prev.year + 1, month: 0 };
            }
            return { ...prev, month: newMonth };
        });
    };

    const monthNames = [
        'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
        'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
    ];

    const dayNames = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50 p-6">
                <PageHeader
                    title="Spielplan & Termine"
                    subtitle="Verwalte alle Spiele, Trainings und wichtige Termine deines Teams"
                    icon={FaCalendarAlt}
                    actions={                        <div className="flex gap-3">
                            <Button 
                                variant="secondary" 
                                icon={FaFilter}
                                onClick={handleShowFilter}
                            >
                                Filter
                            </Button>
                            <Button 
                                variant="primary" 
                                icon={FaPlus}
                                onClick={handleAddEvent}
                            >
                                Neuer Termin
                            </Button>
                        </div>
                    }
                />                {/* Schedule-Statistiken */}
                {scheduleStats && scheduleStats.length > 0 && (
                    <StatsGrid stats={scheduleStats} />
                )}

                {/* Filter-Leiste */}
                <Card className="p-4 mb-6">
                    <div className="flex flex-wrap gap-2 items-center">
                        <span className="text-sm font-medium text-gray-700 mr-2">Typ:</span>
                        {filterTypes.map(filter => (
                            <Button
                                key={filter.id}
                                variant={filterType === filter.id ? "primary" : "ghost"}
                                size="sm"
                                onClick={() => setFilterType(filter.id)}
                            >
                                {filter.label}
                            </Button>
                        ))}
                        <div className="ml-auto flex gap-2">
                            <Button
                                variant={selectedView === 'list' ? "primary" : "ghost"}
                                size="sm"
                                onClick={() => setSelectedView('list')}
                            >
                                Liste
                            </Button>
                            <Button
                                variant={selectedView === 'calendar' ? "primary" : "ghost"}
                                size="sm"
                                onClick={() => setSelectedView('calendar')}
                            >
                                Kalender
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Terminliste */}
                <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <FaCalendarAlt className="text-blue-500" />
                        Termine ({filteredEvents.length})
                    </h3>
                    
                    {filteredEvents.length === 0 ? (
                        <EmptyState
                            icon={FaCalendarAlt}
                            title="Keine Termine gefunden"
                            description="Erstelle deinen ersten Termin oder passe die Filter an"                            action={
                                <Button 
                                    variant="primary" 
                                    icon={FaPlus}
                                    onClick={handleAddEvent}
                                >
                                    Ersten Termin erstellen
                                </Button>
                            }                        />
                    ) : selectedView === 'calendar' ? (
                        /* Kalender-Ansicht */
                        <div className="space-y-4">
                            {/* Kalender Navigation */}
                            <div className="flex items-center justify-between mb-4">
                                <Button
                                    variant="ghost"
                                    onClick={() => navigateMonth('prev')}
                                    className="p-2"
                                >
                                    ←
                                </Button>
                                <h4 className="text-xl font-semibold">
                                    {monthNames[currentCalendarMonth.month]} {currentCalendarMonth.year}
                                </h4>
                                <Button
                                    variant="ghost"
                                    onClick={() => navigateMonth('next')}
                                    className="p-2"
                                >
                                    →
                                </Button>
                            </div>
                            
                            {/* Kalender Grid */}
                            <div className="grid grid-cols-7 gap-1">
                                {/* Wochentage Header */}
                                {dayNames.map(day => (
                                    <div key={day} className="p-2 text-center text-sm font-medium text-gray-600 bg-gray-50">
                                        {day}
                                    </div>
                                ))}
                                
                                {/* Kalendertage */}
                                {getDaysInMonth(currentCalendarMonth.year, currentCalendarMonth.month).map((day, index) => {
                                    if (!day) {
                                        return <div key={index} className="p-2 h-24"></div>;
                                    }
                                    
                                    const dayEvents = getEventsForDate(currentCalendarMonth.year, currentCalendarMonth.month, day);
                                    const isToday = new Date().toDateString() === new Date(currentCalendarMonth.year, currentCalendarMonth.month, day).toDateString();
                                    
                                    return (
                                        <div 
                                            key={day} 
                                            className={`p-1 h-24 border border-gray-200 bg-white ${isToday ? 'bg-blue-50 border-blue-300' : ''}`}
                                        >
                                            <div className={`text-sm font-medium mb-1 ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                                                {day}
                                            </div>
                                            <div className="space-y-1 overflow-hidden">
                                                {dayEvents.slice(0, 2).map(event => (
                                                    <div
                                                        key={event.id}
                                                        onClick={() => handleViewEvent(event.id)}
                                                        className={`text-xs p-1 rounded cursor-pointer hover:opacity-80 ${
                                                            event.type === 'match' ? 'bg-blue-500 text-white' :
                                                            event.type === 'training' ? 'bg-green-500 text-white' :
                                                            'bg-yellow-500 text-white'
                                                        }`}
                                                        title={`${event.title} um ${event.time}`}
                                                    >
                                                        {event.title.length > 10 ? `${event.title.substring(0, 10)}...` : event.title}
                                                    </div>
                                                ))}
                                                {dayEvents.length > 2 && (
                                                    <div className="text-xs text-gray-500">
                                                        +{dayEvents.length - 2} mehr
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        /* Listen-Ansicht */
                        <div className="space-y-4">
                            {filteredEvents
                                .sort((a, b) => new Date(a.date) - new Date(b.date))
                                .map(event => (
                                <div 
                                    key={event.id}
                                    className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">                                            <div className="flex items-center gap-3 mb-2">
                                                <h4 
                                                    className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
                                                    onClick={() => handleViewEvent(event.id)}
                                                    title="Klicken für Details"
                                                >
                                                    {event.title}
                                                </h4>
                                                <Badge variant={getEventTypeColor(event.type)}>
                                                    {getEventTypeLabel(event.type)}
                                                </Badge>
                                                <Badge variant={getStatusColor(event.status)}>
                                                    {getStatusLabel(event.status)}
                                                </Badge>
                                                {event.result && (
                                                    <Badge variant="success">
                                                        {event.result}
                                                    </Badge>
                                                )}
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <FaCalendarAlt className="text-blue-500" />
                                                    <span className="text-sm">
                                                        {new Date(event.date).toLocaleDateString('de-DE', { 
                                                            weekday: 'long', 
                                                            year: 'numeric', 
                                                            month: 'long', 
                                                            day: 'numeric' 
                                                        })}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <FaClock className="text-green-500" />
                                                    <span className="text-sm">{event.time}</span>
                                                    {event.duration && (
                                                        <span className="text-sm text-gray-500">({event.duration})</span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <FaMapMarkerAlt className="text-red-500" />
                                                    <span className="text-sm">{event.location}</span>
                                                </div>
                                            </div>

                                            {event.description && (
                                                <p className="text-gray-600 text-sm mb-3">
                                                    {event.description}
                                                </p>
                                            )}

                                            {event.opponent && (
                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                    <FaFutbol className="text-orange-500" />
                                                    <span>Gegner: <strong>{event.opponent}</strong></span>
                                                    <Badge variant="secondary">
                                                        {event.homeAway === 'home' ? 'Heimspiel' : 
                                                         event.homeAway === 'away' ? 'Auswärtsspiel' : 'Neutral'}
                                                    </Badge>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex gap-2 ml-4">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                icon={FaEye}
                                                onClick={() => handleViewEvent(event.id)}
                                            />
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                icon={FaEdit}
                                                onClick={() => handleEditEvent(event.id)}
                                            />
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                icon={FaTrash}
                                                className="text-red-600 hover:text-red-700"
                                                onClick={() => handleDeleteEvent(event.id)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>

                {/* Kommende Highlights */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <FaFutbol className="text-blue-500" />
                            Nächste Spiele
                        </h3>
                        <div className="space-y-3">
                            {events
                                .filter(e => e.type === 'match' && e.status === 'scheduled')
                                .slice(0, 3)
                                .map(event => (                                <div 
                                    key={event.id} 
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                                    onClick={() => handleViewEvent(event.id)}
                                >
                                    <div>
                                        <p className="font-medium text-gray-900 hover:text-blue-600">{event.title}</p>
                                        <p className="text-sm text-gray-600">
                                            {new Date(event.date).toLocaleDateString('de-DE')} um {event.time}
                                        </p>
                                    </div>
                                    <Badge variant={event.homeAway === 'home' ? 'success' : 'primary'}>
                                        {event.homeAway === 'home' ? 'Heim' : 'Auswärts'}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <FaUsers className="text-green-500" />
                            Kommende Trainings
                        </h3>
                        <div className="space-y-3">
                            {events
                                .filter(e => e.type === 'training' && e.status === 'scheduled')
                                .slice(0, 3)
                                .map(event => (                                <div 
                                    key={event.id} 
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                                    onClick={() => handleViewEvent(event.id)}
                                >
                                    <div>
                                        <p className="font-medium text-gray-900 hover:text-blue-600">{event.title}</p>
                                        <p className="text-sm text-gray-600">
                                            {new Date(event.date).toLocaleDateString('de-DE')} um {event.time}
                                        </p>
                                        <p className="text-sm text-gray-500">{event.location}</p>
                                    </div>
                                    <Badge variant="success">
                                        {event.duration}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>

            {/* Add Event Modal */}
            {(showAddModal || editingEvent) && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <Card className="w-full max-w-md p-6">
                        <h3 className="text-lg font-semibold mb-4">
                            {editingEvent ? 'Termin bearbeiten' : 'Neuer Termin'}
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Titel
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Termin-Titel"
                                    defaultValue={editingEvent?.title || ''}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Typ
                                </label>
                                <select 
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    defaultValue={editingEvent?.type || 'training'}
                                >
                                    <option value="training">Training</option>
                                    <option value="match">Spiel</option>
                                    <option value="friendly">Freundschaftsspiel</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Datum
                                    </label>
                                    <input
                                        type="date"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        defaultValue={editingEvent?.date || ''}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Zeit
                                    </label>
                                    <input
                                        type="time"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        defaultValue={editingEvent?.time || ''}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Ort
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Veranstaltungsort"
                                    defaultValue={editingEvent?.location || ''}
                                />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <Button
                                variant="secondary"
                                onClick={handleCloseModals}
                                className="flex-1"
                            >
                                Abbrechen
                            </Button>
                            <Button
                                variant="primary"
                                onClick={() => {
                                    console.log('Termin gespeichert');
                                    handleCloseModals();
                                }}
                                className="flex-1"
                            >
                                {editingEvent ? 'Aktualisieren' : 'Erstellen'}
                            </Button>
                        </div>
                    </Card>
                </div>
            )}

            {/* Filter Modal */}
            {showFilterModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <Card className="w-full max-w-sm p-6">
                        <h3 className="text-lg font-semibold mb-4">Filter-Optionen</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Zeitraum
                                </label>
                                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option value="all">Alle</option>
                                    <option value="today">Heute</option>
                                    <option value="week">Diese Woche</option>
                                    <option value="month">Dieser Monat</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status
                                </label>
                                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option value="all">Alle</option>
                                    <option value="scheduled">Geplant</option>
                                    <option value="completed">Abgeschlossen</option>
                                    <option value="cancelled">Abgesagt</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <Button
                                variant="secondary"
                                onClick={handleCloseModals}
                                className="flex-1"
                            >
                                Abbrechen
                            </Button>
                            <Button
                                variant="primary"
                                onClick={() => {
                                    console.log('Filter angewendet');
                                    handleCloseModals();
                                }}
                                className="flex-1"
                            >
                                Anwenden
                            </Button>
                        </div>
                    </Card>
                </div>
            )}

            {/* Event Detail Modal */}
            {selectedEventDetail && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <Card className="w-full max-w-2xl p-6 max-h-screen overflow-y-auto">
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="text-2xl font-bold text-gray-900">
                                {selectedEventDetail.title}
                            </h3>
                            <Button
                                variant="ghost"
                                onClick={handleCloseModals}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </Button>
                        </div>
                        
                        <div className="space-y-6">
                            {/* Event Badges */}
                            <div className="flex gap-2 flex-wrap">
                                <Badge variant={getEventTypeColor(selectedEventDetail.type)} size="lg">
                                    {getEventTypeLabel(selectedEventDetail.type)}
                                </Badge>
                                <Badge variant={getStatusColor(selectedEventDetail.status)} size="lg">
                                    {getStatusLabel(selectedEventDetail.status)}
                                </Badge>
                                {selectedEventDetail.result && (
                                    <Badge variant="success" size="lg">
                                        Ergebnis: {selectedEventDetail.result}
                                    </Badge>
                                )}
                                {selectedEventDetail.homeAway && (
                                    <Badge variant="secondary" size="lg">
                                        {selectedEventDetail.homeAway === 'home' ? 'Heimspiel' : 
                                         selectedEventDetail.homeAway === 'away' ? 'Auswärtsspiel' : 'Neutral'}
                                    </Badge>
                                )}
                            </div>

                            {/* Event Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <FaCalendarAlt className="text-blue-500 text-xl" />
                                        <div>
                                            <p className="text-sm text-gray-600">Datum</p>
                                            <p className="font-semibold">
                                                {new Date(selectedEventDetail.date).toLocaleDateString('de-DE', { 
                                                    weekday: 'long', 
                                                    year: 'numeric', 
                                                    month: 'long', 
                                                    day: 'numeric' 
                                                })}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <FaClock className="text-green-500 text-xl" />
                                        <div>
                                            <p className="text-sm text-gray-600">Zeit</p>
                                            <p className="font-semibold">
                                                {selectedEventDetail.time}
                                                {selectedEventDetail.duration && (
                                                    <span className="text-gray-500 ml-2">({selectedEventDetail.duration})</span>
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <FaMapMarkerAlt className="text-red-500 text-xl" />
                                        <div>
                                            <p className="text-sm text-gray-600">Ort</p>
                                            <p className="font-semibold">{selectedEventDetail.location}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {selectedEventDetail.opponent && (
                                        <div className="flex items-center gap-3">
                                            <FaFutbol className="text-orange-500 text-xl" />
                                            <div>
                                                <p className="text-sm text-gray-600">Gegner</p>
                                                <p className="font-semibold">{selectedEventDetail.opponent}</p>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {selectedEventDetail.description && (
                                        <div>
                                            <p className="text-sm text-gray-600 mb-2">Beschreibung</p>
                                            <p className="text-gray-800">{selectedEventDetail.description}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-4 border-t">
                                <Button
                                    variant="primary"
                                    icon={FaEdit}
                                    onClick={() => {
                                        setEditingEvent(selectedEventDetail);
                                        setSelectedEventDetail(null);
                                    }}
                                >
                                    Bearbeiten
                                </Button>
                                <Button
                                    variant="danger"
                                    icon={FaTrash}
                                    onClick={() => {
                                        handleDeleteEvent(selectedEventDetail.id);
                                        setSelectedEventDetail(null);
                                    }}
                                >
                                    Löschen
                                </Button>
                                <Button
                                    variant="secondary"
                                    onClick={handleCloseModals}
                                    className="ml-auto"
                                >
                                    Schließen
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            )}
        </Layout>
    );
};

export default Schedule;