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

const Schedule = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState('all');
    const [selectedView, setSelectedView] = useState('list');

    // Mock-Daten für Events
    const mockEvents = [
        {
            id: 1,
            title: 'vs. FC Rivalen',
            type: 'match',
            date: '2025-06-21',
            time: '15:00',
            location: 'Auswärtsspiel - Rivalenstadion',
            status: 'scheduled',
            description: 'Wichtiges Ligaspiel gegen den Hauptrivalen',
            opponent: 'FC Rivalen',
            homeAway: 'away'
        },
        {
            id: 2,
            title: 'Konditionstraining',
            type: 'training',
            date: '2025-06-18',
            time: '18:00',
            location: 'Sportplatz A',
            status: 'scheduled',
            description: 'Intensives Konditionstraining',
            duration: '90 min'
        },
        {
            id: 3,
            title: 'vs. SV Heimat',
            type: 'match',
            date: '2025-06-28',
            time: '14:00',
            location: 'Heimspiel - Unser Stadion',
            status: 'scheduled',
            description: 'Heimspiel in der Liga',
            opponent: 'SV Heimat',
            homeAway: 'home'
        },
        {
            id: 4,
            title: 'Taktiktraining',
            type: 'training',
            date: '2025-06-19',
            time: '19:00',
            location: 'Halle 1',
            status: 'scheduled',
            description: 'Vorbereitung auf das nächste Spiel',
            duration: '120 min'
        },
        {
            id: 5,
            title: 'Freundschaftsspiel',
            type: 'friendly',
            date: '2025-06-25',
            time: '16:00',
            location: 'Neutraler Platz',
            status: 'scheduled',
            description: 'Testspiel zur Vorbereitung',
            opponent: 'TSV Test',
            homeAway: 'neutral'
        },
        {
            id: 6,
            title: 'vs. Alte Herren',
            type: 'match',
            date: '2025-06-15',
            time: '13:00',
            location: 'Heimspiel - Unser Stadion',
            status: 'completed',
            description: 'Gewonnenes Spiel (3:1)',
            opponent: 'Alte Herren',
            homeAway: 'home',
            result: '3:1'
        }
    ];    useEffect(() => {
        // Simuliere API-Aufruf
        console.log('Schedule useEffect triggered');
        setLoading(true);
        const timer = setTimeout(() => {
            console.log('Setting events:', mockEvents);
            setEvents(mockEvents);
            setLoading(false);
            console.log('Loading finished');
        }, 500);
        
        return () => clearTimeout(timer);
    }, []);

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

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50 p-6">
                <PageHeader
                    title="Spielplan & Termine"
                    subtitle="Verwalte alle Spiele, Trainings und wichtige Termine deines Teams"
                    icon={FaCalendarAlt}
                    actions={
                        <div className="flex gap-3">
                            <Button 
                                variant="secondary" 
                                icon={FaFilter}
                            >
                                Filter
                            </Button>
                            <Button 
                                variant="primary" 
                                icon={FaPlus}
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
                            description="Erstelle deinen ersten Termin oder passe die Filter an"
                            action={
                                <Button 
                                    variant="primary" 
                                    icon={FaPlus}
                                >
                                    Ersten Termin erstellen
                                </Button>
                            }
                        />
                    ) : (
                        <div className="space-y-4">
                            {filteredEvents
                                .sort((a, b) => new Date(a.date) - new Date(b.date))
                                .map(event => (
                                <div 
                                    key={event.id}
                                    className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h4 className="text-lg font-semibold text-gray-900">
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
                                            />
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                icon={FaEdit}
                                            />
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                icon={FaTrash}
                                                className="text-red-600 hover:text-red-700"
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
                                .map(event => (
                                <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="font-medium text-gray-900">{event.title}</p>
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
                                .map(event => (
                                <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="font-medium text-gray-900">{event.title}</p>
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
        </Layout>
    );
};

export default Schedule;