import React, { useState, useEffect } from 'react';
import Layout from '../../../components/Layout/Layout';
import AddMatchDay from '../../../components/MatchDay/AddMatchDay';
import { useNavigate } from 'react-router-dom';
import { 
    FaFutbol, 
    FaCalendarAlt, 
    FaClock, 
    FaMapMarkerAlt, 
    FaPlus,
    FaUsers,
    FaDrawPolygon,
    FaEye,
    FaPlay,
    FaChartLine,
    FaClipboardList,
    FaTrophy,
    FaHome,
    FaPlane,
    FaEdit,
    FaSearch
} from 'react-icons/fa';
import { HiCalendar, HiClock, HiLocationMarker, HiUsers as HiUsersIcon } from 'react-icons/hi';
import moment from 'moment';
import 'moment/locale/de';
import axiosInstance from '../../../utils/axiosInstance';

// Import Design System Components
import {
  PageHeader,
  Card,
  Button,
  Badge,
  LoadingSpinner,
  EmptyState,
  StatsGrid,
  QuickActionsGrid
} from '../../../components/UI/DesignSystem';

moment.locale('de');

const MatchDay = () => {
    const navigate = useNavigate();
    const [matches, setMatches] = useState([]);
    const [formations, setFormations] = useState([]);
    const [tactics, setTactics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddMatch, setShowAddMatch] = useState(false);
    const [selectedView, setSelectedView] = useState('upcoming'); // upcoming, past, all

    useEffect(() => {
        fetchMatches();
        fetchFormations();
        fetchTactics();
    }, []);

    const fetchMatches = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/get-all-events');
            const matchEvents = (response.data.events || []).filter(event => event.type === 'match');
            setMatches(matchEvents);
        } catch (err) {
            console.error('Fehler beim Laden der Spiele:', err);
            setError('Fehler beim Laden der Spiele');
        } finally {
            setLoading(false);
        }
    };

    const fetchFormations = async () => {
        try {
            // Hier würde normalerweise die Formations-API aufgerufen werden
            // Vorerst Mock-Daten
            setFormations([
                { id: 1, name: '4-4-2 Standard', formation: '4-4-2' },
                { id: 2, name: '4-3-3 Offensive', formation: '4-3-3' },
                { id: 3, name: '3-5-2 Defensive', formation: '3-5-2' }
            ]);
        } catch (err) {
            console.error('Fehler beim Laden der Formationen:', err);
        }
    };

    const fetchTactics = async () => {
        try {
            // Hier würde normalerweise die Taktik-API aufgerufen werden
            // Vorerst Mock-Daten
            setTactics([
                { id: 1, name: 'Pressing', type: 'Defensiv' },
                { id: 2, name: 'Konter', type: 'Offensiv' },
                { id: 3, name: 'Ballbesitz', type: 'Aufbau' }
            ]);
        } catch (err) {
            console.error('Fehler beim Laden der Taktiken:', err);
        }
    };

    const handleMatchAdded = () => {
        fetchMatches();
    };

    const getFilteredMatches = () => {
        const now = new Date();
        switch (selectedView) {
            case 'upcoming':
                return matches.filter(match => new Date(match.date) >= now);
            case 'past':
                return matches.filter(match => new Date(match.date) < now);
            default:
                return matches;
        }
    };

    const getUpcomingMatches = () => {
        const now = new Date();
        return matches
            .filter(match => new Date(match.date) >= now)
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 3);
    };

    const getPastMatches = () => {
        const now = new Date();
        return matches
            .filter(match => new Date(match.date) < now)
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);
    };

    const getMatchIcon = (isHome) => {
        return isHome ? FaHome : FaPlane;
    };

    const getMatchTypeColor = (isHome) => {
        return isHome ? 'text-green-600' : 'text-blue-600';
    };

    if (loading) {
        return (
            <Layout>
                <div className="min-h-screen bg-gray-50 p-6">
                    <LoadingSpinner text="Lade Spiele..." />
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50 p-6">
                {/* Page Header */}
                <PageHeader
                    title="Spieltagsplanung"
                    subtitle="Plane Taktiken, Aufstellungen und bereite dein Team vor"
                    icon={FaFutbol}
                    action={
                        <Button
                            onClick={() => setShowAddMatch(true)}
                            variant="primary"
                            icon={FaPlus}
                        >
                            Neues Spiel
                        </Button>
                    }
                />

                {/* Error Display */}
                {error && (
                    <Card className="border-red-200 bg-red-50 mb-6">
                        <div className="flex items-center text-red-700">
                            <FaSearch className="mr-2" />
                            {error}
                        </div>
                    </Card>
                )}

                {/* Statistics Grid */}
                <div className="mb-6">
                    <StatsGrid
                        stats={[
                            {
                                icon: FaCalendarAlt,
                                value: getUpcomingMatches().length,
                                label: 'Anstehende Spiele'
                            },
                            {
                                icon: FaUsers,
                                value: formations.length,
                                label: 'Formationen'
                            },
                            {
                                icon: FaDrawPolygon,
                                value: tactics.length,
                                label: 'Taktiken'
                            },
                            {
                                icon: FaTrophy,
                                value: matches.filter(m => {
                                    const matchDate = moment(m.date);
                                    return matchDate.isSame(moment(), 'month') && new Date(m.date) < new Date();
                                }).length,
                                label: 'Dieser Monat'
                            },
                            {
                                icon: FaHome,
                                value: matches.filter(m => m.isHome).length,
                                label: 'Heimspiele'
                            }
                        ]}
                    />
                </div>

                {/* Filter and Match List */}
                <Card>
                    {/* Filter Tabs */}
                    <div className="mb-6">
                        <div className="flex flex-wrap gap-2">
                            <span className="text-sm text-gray-500 mr-2">Ansicht:</span>
                            
                            <Badge
                                variant={selectedView === 'upcoming' ? 'primary' : 'secondary'}
                                onClick={() => setSelectedView('upcoming')}
                                className="cursor-pointer"
                            >
                                Anstehend ({matches.filter(m => new Date(m.date) >= new Date()).length})
                            </Badge>
                            
                            <Badge
                                variant={selectedView === 'past' ? 'info' : 'secondary'}
                                onClick={() => setSelectedView('past')}
                                className="cursor-pointer"
                            >
                                Gespielt ({matches.filter(m => new Date(m.date) < new Date()).length})
                            </Badge>
                            
                            <Badge
                                variant={selectedView === 'all' ? 'success' : 'secondary'}
                                onClick={() => setSelectedView('all')}
                                className="cursor-pointer"
                            >
                                Alle ({matches.length})
                            </Badge>
                        </div>
                    </div>

                    {/* Match List */}
                    <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
                            <FaFutbol className="text-blue-500 mr-2" />
                            {selectedView === 'upcoming' ? 'Anstehende Spiele' : 
                             selectedView === 'past' ? 'Gespielte Spiele' : 
                             'Alle Spiele'}
                        </h3>
                        
                        {getFilteredMatches().length === 0 ? (
                            <EmptyState
                                icon={FaFutbol}
                                title={
                                    selectedView === 'upcoming' ? 'Keine anstehenden Spiele' :
                                    selectedView === 'past' ? 'Noch keine Spiele gespielt' :
                                    'Keine Spiele vorhanden'
                                }
                                description={
                                    selectedView === 'upcoming' 
                                        ? 'Erstellen Sie Ihr erstes Spiel für das Team'
                                        : 'Spiele erscheinen hier nach der Erstellung'
                                }
                                action={selectedView !== 'past' && (
                                    <Button
                                        variant="primary"
                                        icon={FaPlus}
                                        onClick={() => setShowAddMatch(true)}
                                    >
                                        Erstes Spiel erstellen
                                    </Button>
                                )}
                            />
                        ) : (
                            <div className="space-y-4">
                                {getFilteredMatches()
                                    .sort((a, b) => selectedView === 'past' 
                                        ? new Date(b.date) - new Date(a.date)
                                        : new Date(a.date) - new Date(b.date)
                                    )
                                    .map(match => {
                                        const MatchIcon = getMatchIcon(match.isHome);
                                        return (
                                            <Card key={match._id} className="hover:shadow-md transition-shadow">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center space-x-3 mb-3">
                                                            <MatchIcon className={`text-lg ${getMatchTypeColor(match.isHome)}`} />
                                                            <h4 className="text-lg font-semibold text-gray-800">
                                                                {match.title}
                                                            </h4>
                                                            <Badge
                                                                variant={match.isHome ? 'success' : 'info'}
                                                            >
                                                                {match.isHome ? 'Heimspiel' : 'Auswärtsspiel'}
                                                            </Badge>
                                                            <Badge
                                                                variant={
                                                                    new Date(match.date) >= new Date()
                                                                        ? 'warning'
                                                                        : 'secondary'
                                                                }
                                                            >
                                                                {new Date(match.date) >= new Date() ? 'Geplant' : 'Gespielt'}
                                                            </Badge>
                                                        </div>
                                                        
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm mb-3">
                                                            <div className="flex items-center text-gray-600">
                                                                <HiCalendar className="mr-2 text-blue-500" />
                                                                <div>
                                                                    <p className="font-medium">
                                                                        {moment(match.date).format('dddd, DD. MMMM')}
                                                                    </p>
                                                                    <p className="text-xs">
                                                                        {moment(match.date).fromNow()}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center text-gray-600">
                                                                <HiClock className="mr-2 text-purple-500" />
                                                                <div>
                                                                    <p className="font-medium">{match.time} Uhr</p>
                                                                    <p className="text-xs">Anpfiff</p>
                                                                </div>
                                                            </div>
                                                            {match.location && (
                                                                <div className="flex items-center text-gray-600">
                                                                    <HiLocationMarker className="mr-2 text-orange-500" />
                                                                    <div>
                                                                        <p className="font-medium">{match.location}</p>
                                                                        <p className="text-xs">Spielort</p>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                        
                                                        {match.opponent && (
                                                            <div className="mb-3 text-sm">
                                                                <p className="text-gray-600 mb-1">
                                                                    <FaUsers className="inline mr-1 text-blue-500" />
                                                                    Gegner: <span className="font-medium">{match.opponent}</span>
                                                                </p>
                                                            </div>
                                                        )}
                                                        
                                                        {match.matchData?.formation && (
                                                            <div className="text-sm">
                                                                <p className="text-gray-600">
                                                                    <FaDrawPolygon className="inline mr-1 text-green-500" />
                                                                    Formation: <span className="font-medium">{match.matchData.formation}</span>
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                    
                                                    <div className="flex flex-col space-y-2 ml-4">
                                                        <Button
                                                            variant="primary"
                                                            size="sm"
                                                            onClick={() => navigate(`/team/matchday/${match._id}`)}
                                                            icon={FaEye}
                                                        >
                                                            Details
                                                        </Button>
                                                        <Button
                                                            variant="success"
                                                            size="sm"
                                                            onClick={() => navigate(`/team/formation?match=${match._id}`)}
                                                            icon={FaUsers}
                                                        >
                                                            Aufstellung
                                                        </Button>
                                                        <Button
                                                            variant="info"
                                                            size="sm"
                                                            onClick={() => navigate(`/team/tactics?match=${match._id}`)}
                                                            icon={FaDrawPolygon}
                                                        >
                                                            Taktik
                                                        </Button>
                                                    </div>
                                                </div>
                                            </Card>
                                        );
                                    })}
                            </div>
                        )}
                    </div>
                </Card>

                {/* Quick Actions */}
                <div className="mt-8">
                    <QuickActionsGrid
                        title="Spieltagsvorbereitung"
                        icon={FaPlay}
                        actions={[
                            {
                                title: 'Neues Spiel',
                                description: 'Spiel planen',
                                icon: FaPlus,
                                onClick: () => setShowAddMatch(true),
                                variant: 'primary'
                            },
                            {
                                title: 'Aufstellungen',
                                description: 'Formation planen',
                                icon: FaUsers,
                                onClick: () => navigate('/team/formation'),
                                variant: 'success'
                            },
                            {
                                title: 'Taktiken',
                                description: 'Spielzüge planen',
                                icon: FaDrawPolygon,
                                onClick: () => navigate('/team/tactics'),
                                variant: 'info'
                            },
                            {
                                title: 'Analysen',
                                description: 'Statistiken',
                                icon: FaChartLine,
                                onClick: () => navigate('/team/statistics'),
                                variant: 'warning'
                            }
                        ]}
                    />
                </div>
            </div>

            {/* Add Match Modal */}
            <AddMatchDay
                isOpen={showAddMatch}
                onClose={() => setShowAddMatch(false)}
                onMatchAdded={handleMatchAdded}
            />
        </Layout>
    );
};

export default MatchDay;
