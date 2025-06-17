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
    FaPlayCircle,
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
    };    if (loading) {
        return (
            <Layout>
                <div className="min-h-screen bg-gray-50 p-6">
                    <LoadingSpinner text="Lade Trainings..." />
                </div>
            </Layout>
        );
    }    return (
        <Layout>
            <div className="min-h-screen bg-gray-50 p-6">
                {/* Page Header */}
                <PageHeader
                    title="Trainingsplanung"
                    subtitle="Plane und verwalte alle Trainingseinheiten deines Teams"
                    icon={FaDumbbell}                    action={
                        <div className="flex gap-3">
                            <Button
                                onClick={() => navigate('/team/training/plan')}
                                variant="primary"
                                icon={FaPlus}
                            >
                                Training planen
                            </Button>
                            <Button
                                onClick={() => setShowAddTraining(true)}
                                variant="secondary"
                                icon={FaCalendarAlt}
                            >
                                Schnell hinzufügen
                            </Button>
                        </div>
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
                                value: getUpcomingTrainings().length,
                                label: 'Geplante Trainings'
                            },
                            {
                                icon: FaClipboardList,
                                value: exercises.length,
                                label: 'Verfügbare Übungen'
                            },
                            {
                                icon: FaDumbbell,
                                value: trainings.filter(t => {
                                    const trainDate = moment(t.date);
                                    return trainDate.isSame(moment(), 'week');
                                }).length,
                                label: 'Diese Woche'
                            },
                            {
                                icon: FaPlayCircle,
                                value: getPastTrainings().length,
                                label: 'Durchgeführt'
                            }
                        ]}
                    />
                </div>                {/* Filter and Training List */}
                <Card>
                    {/* Filter Tabs */}
                    <div className="mb-6">
                        <div className="flex flex-wrap gap-2">
                            <span className="text-sm text-gray-500 mr-2">Ansicht:</span>
                            
                            <Badge
                                variant={selectedView === 'upcoming' ? 'success' : 'secondary'}
                                onClick={() => setSelectedView('upcoming')}
                                className="cursor-pointer"
                            >
                                Anstehend ({trainings.filter(t => new Date(t.date) >= new Date()).length})
                            </Badge>
                            
                            <Badge
                                variant={selectedView === 'past' ? 'info' : 'secondary'}
                                onClick={() => setSelectedView('past')}
                                className="cursor-pointer"
                            >
                                Vergangen ({trainings.filter(t => new Date(t.date) < new Date()).length})
                            </Badge>
                            
                            <Badge
                                variant={selectedView === 'all' ? 'primary' : 'secondary'}
                                onClick={() => setSelectedView('all')}
                                className="cursor-pointer"
                            >
                                Alle ({trainings.length})
                            </Badge>
                        </div>
                    </div>

                    {/* Training List */}
                    <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
                            <FaCalendarAlt className="text-green-500 mr-2" />
                            {selectedView === 'upcoming' ? 'Anstehende Trainings' : 
                             selectedView === 'past' ? 'Vergangene Trainings' : 
                             'Alle Trainings'}
                        </h3>
                        
                        {getFilteredTrainings().length === 0 ? (
                            <EmptyState
                                icon={FaDumbbell}
                                title={
                                    selectedView === 'upcoming' ? 'Keine anstehenden Trainings' :
                                    selectedView === 'past' ? 'Noch keine Trainings durchgeführt' :
                                    'Keine Trainings vorhanden'
                                }
                                description={
                                    selectedView === 'upcoming' 
                                        ? 'Erstellen Sie Ihr erstes Training für das Team'
                                        : 'Trainings erscheinen hier nach der Erstellung'
                                }
                                action={selectedView !== 'past' && (
                                    <Button
                                        variant="primary"
                                        icon={FaPlus}
                                        onClick={() => setShowAddTraining(true)}
                                    >
                                        Erstes Training erstellen
                                    </Button>
                                )}
                            />
                        ) : (
                            <div className="space-y-4">
                                {getFilteredTrainings()
                                    .sort((a, b) => selectedView === 'past' 
                                        ? new Date(b.date) - new Date(a.date)
                                        : new Date(a.date) - new Date(b.date)
                                    )
                                    .map(training => (
                                    <Card key={training._id} className="hover:shadow-md transition-shadow">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-3 mb-3">
                                                    <h4 className="text-lg font-semibold text-gray-800">
                                                        {training.title}
                                                    </h4>
                                                    <Badge
                                                        variant={
                                                            new Date(training.date) >= new Date()
                                                                ? 'success'
                                                                : 'secondary'
                                                        }
                                                    >
                                                        {new Date(training.date) >= new Date() ? 'Geplant' : 'Abgeschlossen'}
                                                    </Badge>
                                                </div>
                                                
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm mb-3">
                                                    <div className="flex items-center text-gray-600">
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
                                                    <div className="flex items-center text-gray-600">
                                                        <HiClock className="mr-2 text-purple-500" />
                                                        <div>
                                                            <p className="font-medium">{training.time} Uhr</p>
                                                            <p className="text-xs">{training.duration || 90} Min</p>
                                                        </div>
                                                    </div>
                                                    {training.location && (
                                                        <div className="flex items-center text-gray-600">
                                                            <HiLocationMarker className="mr-2 text-orange-500" />
                                                            <div>
                                                                <p className="font-medium">{training.location}</p>
                                                                <p className="text-xs">Trainingsort</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                {training.trainingData?.exercises && training.trainingData.exercises.length > 0 && (
                                                    <div className="mb-3 text-sm">
                                                        <p className="text-gray-600 mb-1">
                                                            <FaClipboardList className="inline mr-1 text-green-500" />
                                                            {training.trainingData.exercises.length} Übung{training.trainingData.exercises.length !== 1 ? 'en' : ''}
                                                        </p>
                                                        <div className="flex flex-wrap gap-1">
                                                            {training.trainingData.exercises.slice(0, 3).map((exercise, index) => (
                                                                <Badge key={index} variant="success" size="sm">
                                                                    {exercise.title}
                                                                </Badge>
                                                            ))}
                                                            {training.trainingData.exercises.length > 3 && (
                                                                <Badge variant="secondary" size="sm">
                                                                    +{training.trainingData.exercises.length - 3} weitere
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                                
                                                {training.playerAttendance && training.playerAttendance.length > 0 && (
                                                    <div className="text-sm">
                                                        <p className="text-gray-600">
                                                            <FaUsers className="inline mr-1 text-blue-500" />
                                                            {training.playerAttendance.length} Spieler eingeladen
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            <div className="flex flex-col space-y-2 ml-4">
                                                <Button
                                                    variant="primary"
                                                    size="sm"
                                                    onClick={() => navigate(`/team/training/${training._id}`)}
                                                    icon={FaDumbbell}
                                                >
                                                    Details
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    icon={FaEdit}
                                                >
                                                    Bearbeiten
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </Card>                {/* Quick Actions */}
                <div className="mt-8">
                    <QuickActionsGrid
                        title="Schnellaktionen"
                        icon={FaPlus}
                        actions={[
                            {
                                title: 'Neues Training',
                                description: 'Training erstellen',
                                icon: FaPlus,
                                onClick: () => setShowAddTraining(true),
                                variant: 'success'
                            },
                            {
                                title: 'Übungen',
                                description: 'Übungen verwalten',
                                icon: FaDumbbell,
                                onClick: () => navigate('/exercises'),
                                variant: 'primary'
                            },
                            {
                                title: 'Kalender',
                                description: 'Alle Termine',
                                icon: FaCalendarAlt,
                                onClick: () => navigate('/team/schedule'),
                                variant: 'info'
                            }
                        ]}
                    />
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
