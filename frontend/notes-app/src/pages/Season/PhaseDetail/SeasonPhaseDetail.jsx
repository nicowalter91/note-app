import React, { useState, useEffect } from 'react';
import Layout from '../../../components/Layout/Layout';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utils/axiosInstance';
import {
    FaArrowLeft,
    FaChevronLeft,
    FaChevronRight,
    FaCalendarAlt,
    FaUsers,
    FaDumbbell,
    FaTrophy,
    FaClipboardCheck,
    FaExclamationTriangle,    FaCheckCircle,
    FaPlus,
    FaEdit,
    FaStar,
    FaBullseye,
    FaChartLine
} from 'react-icons/fa';

const SeasonPhaseDetail = () => {
    const { phaseId } = useParams();
    const navigate = useNavigate();
    const [currentWeek, setCurrentWeek] = useState(1);
    const [phaseData, setPhaseData] = useState(null);
    const [weeklyTasks, setWeeklyTasks] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);

    // Phasen-spezifische Daten
    const phaseConfigs = {
        preseason: {
            title: 'Vorsaison',
            subtitle: 'Kaderplanung & Strategische Vorbereitung',
            totalWeeks: 8,
            color: 'purple',
            weeklyFocus: [
                { week: 1, focus: 'Saisonziele definieren', priority: 'Strategische Planung' },
                { week: 2, focus: 'Kaderanalyse durchführen', priority: 'Spielerbewertung' },
                { week: 3, focus: 'Transferziele identifizieren', priority: 'Kaderstrategie' },
                { week: 4, focus: 'Budget & Finanzen planen', priority: 'Finanzplanung' },
                { week: 5, focus: 'Trainingskonzept entwickeln', priority: 'Methodology' },
                { week: 6, focus: 'Medizinische Tests planen', priority: 'Gesundheitscheck' },
                { week: 7, focus: 'Saisonplanung finalisieren', priority: 'Kalenderplanung' },
                { week: 8, focus: 'Team-Präsentation vorbereiten', priority: 'Kommunikation' }
            ]
        },
        summerPrep: {
            title: 'Sommervorbereitung',
            subtitle: 'Fitness, Taktik & Teambuilding',
            totalWeeks: 6,
            color: 'yellow',
            weeklyFocus: [
                { week: 1, focus: 'Konditionsaufbau starten', priority: 'Fitness Base' },
                { week: 2, focus: 'Taktische Grundlagen', priority: 'System Introduction' },
                { week: 3, focus: 'Erste Testspiele', priority: 'Spielpraxis' },
                { week: 4, focus: 'Teambuilding & Integration', priority: 'Mannschaftsgefühl' },
                { week: 5, focus: 'Wettkampfspezifisches Training', priority: 'Match Preparation' },
                { week: 6, focus: 'Saisonstart-Vorbereitung', priority: 'Final Preparation' }
            ]
        },
        firstHalf: {
            title: 'Vorrunde',
            subtitle: 'Wettkampfphase der ersten Saisonhälfte',
            totalWeeks: 17,
            color: 'green',
            weeklyFocus: [
                { week: 1, focus: 'Saisoneröffnung', priority: 'First Impression' },
                { week: 2, focus: 'Routine entwickeln', priority: 'Weekly Rhythm' },
                { week: 3, focus: 'Taktische Feinabstimmung', priority: 'System Optimization' },
                { week: 4, focus: 'Leistungsanalyse', priority: 'Performance Review' },
                // ... weitere Wochen
            ]
        },
        winterPrep: {
            title: 'Wintervorbereitung',
            subtitle: 'Regeneration & Optimierung zur Halbzeit',
            totalWeeks: 4,
            color: 'blue',
            weeklyFocus: [
                { week: 1, focus: 'Halbzeitanalyse', priority: 'Season Review' },
                { week: 2, focus: 'Erholung & Regeneration', priority: 'Recovery' },
                { week: 3, focus: 'Taktische Anpassungen', priority: 'System Updates' },
                { week: 4, focus: 'Rückrunden-Vorbereitung', priority: 'Second Half Prep' }
            ]
        },
        secondHalf: {
            title: 'Rückrunde',
            subtitle: 'Entscheidende Saisonphase',
            totalWeeks: 17,
            color: 'orange',
            weeklyFocus: [
                { week: 1, focus: 'Starker Rückrundenstart', priority: 'Momentum Building' },
                { week: 2, focus: 'Konstanz entwickeln', priority: 'Consistency' },
                // ... weitere Wochen
            ]
        },
        seasonEnd: {
            title: 'Saisonanalyse',
            subtitle: 'Auswertung & Zukunftsplanung',
            totalWeeks: 2,
            color: 'gray',
            weeklyFocus: [
                { week: 1, focus: 'Saisonauswertung', priority: 'Complete Analysis' },
                { week: 2, focus: 'Zukunftsplanung', priority: 'Next Season Prep' }
            ]
        }
    };

    useEffect(() => {
        if (phaseId && phaseConfigs[phaseId]) {
            setPhaseData(phaseConfigs[phaseId]);
            loadWeeklyData();
        }
    }, [phaseId, currentWeek]);

    const loadWeeklyData = async () => {
        try {
            // Lade Events und Aufgaben für die aktuelle Woche
            const eventsResponse = await axiosInstance.get('/get-all-events');
            const tasksResponse = await axiosInstance.get('/get-all-tasks');
            
            // Filter für aktuelle Woche
            const weekStart = new Date();
            weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1); // Start of week (Monday)
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6); // End of week (Sunday)
            
            const weekEvents = eventsResponse.data.events?.filter(event => {
                const eventDate = new Date(event.date);
                return eventDate >= weekStart && eventDate <= weekEnd;
            }) || [];
            
            setUpcomingEvents(weekEvents);
        } catch (error) {
            console.error('Error loading weekly data:', error);
        }
    };

    const navigateWeek = (direction) => {
        const newWeek = currentWeek + direction;
        if (newWeek >= 1 && newWeek <= phaseData.totalWeeks) {
            setCurrentWeek(newWeek);
        }
    };

    const getCurrentWeekFocus = () => {
        return phaseData?.weeklyFocus?.find(w => w.week === currentWeek) || {};
    };

    const getWeeklyTasks = () => {
        const currentFocus = getCurrentWeekFocus();
        
        // Basis-Aufgaben je nach Phase
        const baseTasks = {
            preseason: [
                'Saisonziele überprüfen',
                'Kaderplanung vorantreiben',
                'Trainingskonzept entwickeln',
                'Budget-Meetings durchführen'
            ],
            summerPrep: [
                'Trainingseinheiten planen',
                'Fitness-Tests durchführen',
                'Taktische Übungen',
                'Teambuilding-Aktivitäten'
            ],
            firstHalf: [
                'Spielanalyse vom letzten Match',
                'Nächstes Spiel vorbereiten',
                'Wöchentliche Trainings planen',
                'Spielerrotation optimieren'
            ],
            winterPrep: [
                'Halbzeit-Bilanz ziehen',
                'Trainingscamp organisieren',
                'Taktische Neuerungen testen',
                'Kaderjustierungen prüfen'
            ],
            secondHalf: [
                'Saisonziele verfolgen',
                'Formkurve analysieren',
                'Playoffs vorbereiten',
                'Nachwuchs integrieren'
            ]
        };

        return baseTasks[phaseId] || [];
    };

    if (!phaseData) {
        return (
            <Layout>
                <div className="min-h-screen bg-gray-50 p-6">
                    <div className="text-center">
                        <h2 className="text-2xl font-semibold text-gray-800">Phase nicht gefunden</h2>
                        <button
                            onClick={() => navigate('/season')}
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            Zurück zur Saisonübersicht
                        </button>
                    </div>
                </div>
            </Layout>
        );
    }

    const currentFocus = getCurrentWeekFocus();

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50 p-6">
                {/* Header */}
                <div className="flex items-center mb-6">
                    <button
                        onClick={() => navigate('/season')}
                        className="mr-4 p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        <FaArrowLeft className="text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">{phaseData.title}</h1>
                        <p className="text-gray-600">{phaseData.subtitle}</p>
                    </div>
                </div>

                {/* Week Navigation */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <button
                            onClick={() => navigateWeek(-1)}
                            disabled={currentWeek <= 1}
                            className={`p-2 rounded-lg transition-colors ${
                                currentWeek <= 1 
                                    ? 'text-gray-400 cursor-not-allowed' 
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            <FaChevronLeft />
                        </button>
                        
                        <div className="text-center">
                            <h2 className="text-xl font-semibold text-gray-800">
                                Woche {currentWeek} von {phaseData.totalWeeks}
                            </h2>
                            <p className="text-gray-600">{currentFocus.focus}</p>
                        </div>
                        
                        <button
                            onClick={() => navigateWeek(1)}
                            disabled={currentWeek >= phaseData.totalWeeks}
                            className={`p-2 rounded-lg transition-colors ${
                                currentWeek >= phaseData.totalWeeks 
                                    ? 'text-gray-400 cursor-not-allowed' 
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            <FaChevronRight />
                        </button>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                            className={`bg-${phaseData.color}-500 h-2 rounded-full transition-all duration-300`}
                            style={{ width: `${(currentWeek / phaseData.totalWeeks) * 100}%` }}
                        ></div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                        <span>Start</span>
                        <span>{Math.round((currentWeek / phaseData.totalWeeks) * 100)}% abgeschlossen</span>
                        <span>Ende</span>
                    </div>
                </div>

                {/* Week Focus */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <FaBullseye className={`text-${phaseData.color}-500 mr-2`} />
                        Wochenschwerpunkt
                    </h3>
                    <div className={`bg-${phaseData.color}-50 p-4 rounded-lg`}>
                        <h4 className={`font-medium text-${phaseData.color}-800 mb-2`}>
                            {currentFocus.focus}
                        </h4>
                        <p className={`text-${phaseData.color}-700 text-sm`}>
                            Priorität: {currentFocus.priority}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Weekly Tasks */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                                <FaClipboardCheck className="text-blue-500 mr-2" />
                                Wochenaufgaben
                            </h3>
                            <button
                                onClick={() => navigate('/tasks')}
                                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <FaPlus />
                            </button>
                        </div>
                        <div className="space-y-3">
                            {getWeeklyTasks().map((task, index) => (
                                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                                    <FaCheckCircle className="text-green-500 mr-3" />
                                    <span className="text-gray-700">{task}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Upcoming Events */}
                    <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                                <FaCalendarAlt className="text-green-500 mr-2" />
                                Diese Woche
                            </h3>
                            <button
                                onClick={() => navigate('/team/schedule')}
                                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <FaEdit />
                            </button>
                        </div>
                        <div className="space-y-3">
                            {upcomingEvents.length > 0 ? (
                                upcomingEvents.map((event, index) => (
                                    <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                                        {event.type === 'training' ? (
                                            <FaDumbbell className="text-blue-500 mr-3" />
                                        ) : (
                                            <FaTrophy className="text-yellow-500 mr-3" />
                                        )}
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-800">{event.title}</p>
                                            <p className="text-sm text-gray-600">
                                                {new Date(event.date).toLocaleDateString('de-DE')} • {event.time}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <FaCalendarAlt className="text-4xl mx-auto mb-2 opacity-50" />
                                    <p>Keine Termine diese Woche</p>
                                    <button
                                        onClick={() => navigate('/team/planning')}
                                        className="mt-2 text-blue-500 hover:text-blue-600 text-sm"
                                    >
                                        Termin hinzufügen
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Schnellaktionen</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <button
                            onClick={() => navigate('/team/training')}
                            className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-center transition-colors"
                        >
                            <FaDumbbell className="text-2xl text-blue-600 mx-auto mb-2" />
                            <span className="text-sm font-medium text-gray-800">Training planen</span>
                        </button>
                        
                        <button
                            onClick={() => navigate('/team/matchday')}
                            className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-center transition-colors"
                        >
                            <FaTrophy className="text-2xl text-green-600 mx-auto mb-2" />
                            <span className="text-sm font-medium text-gray-800">Spiel vorbereiten</span>
                        </button>
                        
                        <button
                            onClick={() => navigate('/team/players')}
                            className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-center transition-colors"
                        >
                            <FaUsers className="text-2xl text-purple-600 mx-auto mb-2" />
                            <span className="text-sm font-medium text-gray-800">Spieler verwalten</span>
                        </button>
                          <button
                            onClick={() => navigate('/team/statistics')}
                            className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg text-center transition-colors"
                        >
                            <FaChartLine className="text-2xl text-orange-600 mx-auto mb-2" />
                            <span className="text-sm font-medium text-gray-800">Leistung analysieren</span>
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default SeasonPhaseDetail;
