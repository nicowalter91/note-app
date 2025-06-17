import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import moment from 'moment';
import 'moment/locale/de';
import {
    FaCalendarAlt,
    FaUsers,
    FaDumbbell,
    FaTrophy,
    FaSnowflake,
    FaSun,
    FaLeaf,
    FaChartLine,
    FaChevronRight,
    FaCheckCircle,
    FaClock,
    FaExclamationTriangle,
    FaPlay,
    FaArrowRight
} from 'react-icons/fa';

const SeasonOverview = () => {
    const navigate = useNavigate();
    const [currentWeek, setCurrentWeek] = useState(moment().isoWeek());
    const [currentPhase, setCurrentPhase] = useState('');
    const [seasonData, setSeasonData] = useState({
        events: [],
        tasks: [],
        players: [],
        phases: {}
    });
    const [loading, setLoading] = useState(true);

    moment.locale('de');

    useEffect(() => {
        loadSeasonData();
        determineCurrentPhase();
    }, []);

    const loadSeasonData = async () => {
        setLoading(true);        try {
            // Parallel laden aller relevanten Daten
            const [eventsRes, tasksRes, playersRes] = await Promise.all([
                axiosInstance.get('/get-all-events'),
                axiosInstance.get('/get-all-tasks'),
                axiosInstance.get('/players')
            ]);

            const events = eventsRes.data.events || [];
            const tasks = tasksRes.data.tasks || [];
            const players = playersRes.data.players || [];

            // Saisonphasen basierend auf echten Daten berechnen
            const phases = calculateSeasonPhases(events, tasks);

            setSeasonData({
                events,
                tasks,
                players,
                phases
            });
        } catch (error) {
            console.error('Error loading season data:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateSeasonPhases = (events, tasks) => {
        const now = moment();
        const currentYear = now.year();
        
        // Definiere Saisonzeiträume (anpassbar je nach Liga)
        const phases = {
            preseason: {
                start: moment(`${currentYear}-05-01`),
                end: moment(`${currentYear}-06-30`),
                title: 'Vorsaison',
                color: 'purple'
            },
            summerPrep: {
                start: moment(`${currentYear}-07-01`),
                end: moment(`${currentYear}-08-15`),
                title: 'Sommervorbereitung',
                color: 'yellow'
            },
            firstHalf: {
                start: moment(`${currentYear}-08-16`),
                end: moment(`${currentYear}-12-15`),
                title: 'Vorrunde',
                color: 'green'
            },
            winterPrep: {
                start: moment(`${currentYear}-12-16`),
                end: moment(`${currentYear + 1}-01-31`),
                title: 'Wintervorbereitung',
                color: 'blue'
            },
            secondHalf: {
                start: moment(`${currentYear + 1}-02-01`),
                end: moment(`${currentYear + 1}-05-31`),
                title: 'Rückrunde',
                color: 'red'
            },
            analysis: {
                start: moment(`${currentYear + 1}-06-01`),
                end: moment(`${currentYear + 1}-06-30`),
                title: 'Saisonanalyse',
                color: 'indigo'
            }
        };

        // Berechne Fortschritt und Status für jede Phase
        Object.keys(phases).forEach(phaseKey => {
            const phase = phases[phaseKey];
            const phaseEvents = events.filter(event => 
                moment(event.date).isBetween(phase.start, phase.end, null, '[]')
            );
            const phaseTasks = tasks.filter(task => 
                moment(task.dueDate || task.createdAt).isBetween(phase.start, phase.end, null, '[]')
            );

            // Status bestimmen
            if (now.isBefore(phase.start)) {
                phase.status = 'upcoming';
            } else if (now.isAfter(phase.end)) {
                phase.status = 'completed';
            } else {
                phase.status = 'active';
            }

            // Fortschritt berechnen
            if (phase.status === 'completed') {
                phase.progress = 100;
            } else if (phase.status === 'upcoming') {
                phase.progress = 0;
            } else {
                const totalDays = phase.end.diff(phase.start, 'days');
                const daysPassed = now.diff(phase.start, 'days');
                phase.progress = Math.max(0, Math.min(100, (daysPassed / totalDays) * 100));
            }

            // Ereignisse und Aufgaben zuordnen
            phase.events = phaseEvents;
            phase.tasks = phaseTasks;
            phase.completedTasks = phaseTasks.filter(task => task.isCompleted).length;
            phase.totalTasks = phaseTasks.length;
        });

        return phases;
    };

    const determineCurrentPhase = () => {
        const now = moment();
        const month = now.month() + 1; // moment months are 0-based
        
        if (month >= 5 && month <= 6) {
            setCurrentPhase('preseason');
        } else if (month >= 7 && month <= 8) {
            setCurrentPhase('summerPrep');
        } else if (month >= 9 || month <= 12) {
            setCurrentPhase('firstHalf');
        } else if (month >= 1 && month <= 1) {
            setCurrentPhase('winterPrep');
        } else if (month >= 2 && month <= 5) {
            setCurrentPhase('secondHalf');
        }
    };

    // Saisonphasen Definition
    const seasonPhases = [
        {
            id: 'preseason',
            title: 'Vorsaison',
            subtitle: 'Kaderplanung & Vorbereitung',
            icon: FaUsers,
            color: 'purple',
            description: 'Strategische Planung für die kommende Saison',
            weeks: 8,
            tasks: [
                'Kaderanalyse durchführen',
                'Transferziele definieren',
                'Trainingscamp planen',
                'Medizinische Tests'
            ]
        },
        {
            id: 'summerPrep',
            title: 'Sommervorbereitung',
            subtitle: 'Fitness & Teambuilding',
            icon: FaSun,
            color: 'yellow',
            description: 'Konditionsaufbau und Mannschaftsfindung',
            weeks: 6,
            tasks: [
                'Fitnessaufbau',
                'Taktische Grundlagen',
                'Testspiele',
                'Teambuilding'
            ]
        },
        {
            id: 'firstHalf',
            title: 'Vorrunde',
            subtitle: 'Punktspiele & Wettkampf',
            icon: FaTrophy,
            color: 'green',
            description: 'Erste Saisonhälfte mit Ligaspielen',
            weeks: 17,
            tasks: [
                'Wöchentliche Spielvorbereitung',
                'Leistungsanalyse',
                'Taktische Anpassungen',
                'Verletzungsprävention'
            ]
        },
        {
            id: 'winterPrep',
            title: 'Wintervorbereitung',
            subtitle: 'Regeneration & Optimierung',
            icon: FaSnowflake,
            color: 'blue',
            description: 'Winterpause für Erholung und Verbesserungen',
            weeks: 4,
            tasks: [
                'Halbzeitanalyse',
                'Kaderjustierungen',
                'Trainingslager',
                'Taktische Weiterentwicklung'
            ]
        },
        {
            id: 'secondHalf',
            title: 'Rückrunde',
            subtitle: 'Zielgerade & Saisonfinish',
            icon: FaLeaf,
            color: 'orange',
            description: 'Entscheidende Saisonphase',
            weeks: 17,
            tasks: [
                'Saisonziele verfolgen',
                'Formkurve optimieren',
                'Playoffs vorbereiten',
                'Nachwuchsförderung'
            ]
        },        {
            id: 'seasonEnd',
            title: 'Saisonanalyse',
            subtitle: 'Auswertung & Planung',
            icon: FaChartLine,
            color: 'gray',
            description: 'Saisonrückblick und Zukunftsplanung',
            weeks: 2,
            tasks: [
                'Saisonauswertung',
                'Spielerbewertungen',
                'Planungen für nächste Saison',
                'Abschlussgespräche'
            ]
        }
    ];

    const getPhaseColor = (color) => {
        const colors = {
            purple: 'bg-purple-500',
            yellow: 'bg-yellow-500',
            green: 'bg-green-500',
            blue: 'bg-blue-500',
            orange: 'bg-orange-500',
            gray: 'bg-gray-500'
        };
        return colors[color] || 'bg-gray-500';
    };

    const getPhaseStatus = (phaseId) => {
        if (currentPhase === phaseId) return 'active';
        const phaseIndex = seasonPhases.findIndex(p => p.id === phaseId);
        const currentIndex = seasonPhases.findIndex(p => p.id === currentPhase);
        return phaseIndex < currentIndex ? 'completed' : 'upcoming';
    };

    const navigateToPhase = (phaseId) => {
        navigate(`/season/${phaseId}`);
    };

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50 p-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">Saison 2024/2025</h1>
                            <p className="text-blue-100">
                                Wochenweise Führung durch alle Saisonphasen
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold">Woche {currentWeek}</div>
                            <div className="text-blue-200">von 52 Wochen</div>
                        </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mt-4">
                        <div className="flex justify-between text-sm text-blue-200 mb-2">
                            <span>Saisonfortschritt</span>
                            <span>{Math.round((currentWeek / 52) * 100)}%</span>
                        </div>
                        <div className="w-full bg-blue-800/30 rounded-full h-2">
                            <div 
                                className="bg-white h-2 rounded-full transition-all duration-300"
                                style={{ width: `${(currentWeek / 52) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Current Week Overview */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Diese Woche - {seasonPhases.find(p => p.id === currentPhase)?.title}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-green-50 p-4 rounded-lg">
                            <h3 className="font-medium text-green-800 mb-2">Prioritäten</h3>
                            <ul className="text-sm text-green-700 space-y-1">
                                <li>• Nächstes Spiel vorbereiten</li>
                                <li>• Trainingseinheiten planen</li>
                                <li>• Spieleranalyse durchführen</li>
                            </ul>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h3 className="font-medium text-blue-800 mb-2">Anstehende Termine</h3>
                            <ul className="text-sm text-blue-700 space-y-1">
                                <li>• Training Dienstag 18:00</li>
                                <li>• Spiel Samstag 15:00</li>
                                <li>• Taktikbesprechung</li>
                            </ul>
                        </div>
                        <div className="bg-orange-50 p-4 rounded-lg">
                            <h3 className="font-medium text-orange-800 mb-2">Wichtige Aufgaben</h3>
                            <ul className="text-sm text-orange-700 space-y-1">
                                <li>• Aufstellung festlegen</li>
                                <li>• Verletzungsupdate</li>
                                <li>• Gegneranalyse</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Season Phases */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-6">Saisonphasen</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {seasonPhases.map((phase, index) => {
                            const status = getPhaseStatus(phase.id);
                            return (
                                <div
                                    key={phase.id}
                                    onClick={() => navigateToPhase(phase.id)}
                                    className={`border rounded-xl p-6 cursor-pointer transition-all hover:shadow-md ${
                                        status === 'active' 
                                            ? 'ring-2 ring-blue-500 bg-blue-50' 
                                            : status === 'completed'
                                            ? 'bg-green-50 border-green-200'
                                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                                    }`}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`p-3 rounded-lg ${getPhaseColor(phase.color)} bg-opacity-20`}>
                                            <phase.icon className={`text-xl text-${phase.color}-600`} />
                                        </div>
                                        <div className="flex items-center text-sm">
                                            {status === 'active' && (
                                                <div className="flex items-center text-blue-600">
                                                    <FaClock className="mr-1" />
                                                    Aktiv
                                                </div>
                                            )}
                                            {status === 'completed' && (
                                                <div className="flex items-center text-green-600">
                                                    <FaCheckCircle className="mr-1" />
                                                    Abgeschlossen
                                                </div>
                                            )}
                                            {status === 'upcoming' && (
                                                <div className="flex items-center text-gray-500">
                                                    <FaClock className="mr-1" />
                                                    Geplant
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <h3 className="text-lg font-semibold text-gray-800 mb-1">
                                        {phase.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-2">
                                        {phase.subtitle}
                                    </p>
                                    <p className="text-sm text-gray-500 mb-4">
                                        {phase.description}
                                    </p>
                                    
                                    <div className="text-sm text-gray-600 mb-4">
                                        <strong>{phase.weeks} Wochen</strong>
                                    </div>
                                    
                                    <ul className="text-xs text-gray-600 space-y-1 mb-4">
                                        {phase.tasks.slice(0, 3).map((task, taskIndex) => (
                                            <li key={taskIndex}>• {task}</li>
                                        ))}
                                    </ul>
                                    
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-500">
                                            {status === 'active' ? 'Woche 2 von 8' : ''}
                                        </span>
                                        <FaChevronRight className="text-gray-400" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Schnellzugriff</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <button
                            onClick={() => navigate('/team/training')}
                            className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-center transition-colors"
                        >
                            <FaDumbbell className="text-2xl text-green-600 mx-auto mb-2" />
                            <span className="text-sm font-medium text-gray-800">Training planen</span>
                        </button>
                        
                        <button
                            onClick={() => navigate('/team/schedule')}
                            className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-center transition-colors"
                        >
                            <FaCalendarAlt className="text-2xl text-blue-600 mx-auto mb-2" />
                            <span className="text-sm font-medium text-gray-800">Spielplan</span>
                        </button>
                        
                        <button
                            onClick={() => navigate('/team/players')}
                            className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-center transition-colors"
                        >
                            <FaUsers className="text-2xl text-purple-600 mx-auto mb-2" />
                            <span className="text-sm font-medium text-gray-800">Spieler</span>
                        </button>
                          <button
                            onClick={() => navigate('/team/statistics')}
                            className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg text-center transition-colors"
                        >
                            <FaChartLine className="text-2xl text-orange-600 mx-auto mb-2" />
                            <span className="text-sm font-medium text-gray-800">Statistiken</span>
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default SeasonOverview;
