import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import {
    FaCalendarWeek,
    FaChevronLeft,
    FaChevronRight,
    FaCheckCircle,
    FaClock,
    FaExclamationTriangle,
    FaUsers,
    FaDumbbell,
    FaTrophy,
    FaClipboardList,
    FaChartLine,
    FaBullseye,
    FaLightbulb,
    FaPlay,
    FaPause,
    FaStop,
    FaRoute,
    FaStar,
    FaArrowRight,
    FaRunning
} from 'react-icons/fa';
import moment from 'moment';
import 'moment/locale/de';

const WeeklyCoach = () => {
    const navigate = useNavigate();
    const [currentWeek, setCurrentWeek] = useState(moment());
    const [weeklyData, setWeeklyData] = useState({
        events: [],
        tasks: [],
        players: [],
        priorities: [],
        completed: []
    });
    const [weekStatus, setWeekStatus] = useState('planning'); // planning, active, completed
    const [coachingTips, setCoachingTips] = useState([]);
    const [currentSeasonPhase, setCurrentSeasonPhase] = useState('');
    const [apiError, setApiError] = useState(null);

    moment.locale('de');

    useEffect(() => {
        loadWeeklyData();
        determineSeasonPhase();
    }, [currentWeek]);

    const determineSeasonPhase = () => {
        const month = currentWeek.month() + 1; // moment months are 0-based
        
        if (month >= 1 && month <= 2) {
            setCurrentSeasonPhase('Wintervorbereitung');
        } else if (month >= 3 && month <= 6) {
            setCurrentSeasonPhase('Rückrunde');
        } else if (month >= 7 && month <= 8) {
            setCurrentSeasonPhase('Sommervorbereitung');
        } else if (month >= 9 && month <= 12) {
            setCurrentSeasonPhase('Vorrunde');
        }
    };

    const loadWeeklyData = async () => {
        try {
            const weekStart = currentWeek.clone().startOf('isoWeek');
            const weekEnd = currentWeek.clone().endOf('isoWeek');

            // Events für die Woche laden
            const eventsResponse = await axiosInstance.get('/get-all-events');
            const weekEvents = eventsResponse.data.events?.filter(event => {
                const eventDate = moment(event.date);
                return eventDate.isBetween(weekStart, weekEnd, null, '[]');
            }) || [];

            // Tasks laden
            const tasksResponse = await axiosInstance.get('/get-all-tasks');
            const weekTasks = tasksResponse.data.tasks?.filter(task => {
                const taskDate = moment(task.dueDate || task.createdAt);
                return taskDate.isBetween(weekStart, weekEnd, null, '[]');
            }) || [];

            // Spieler-Performance Daten
            const playersResponse = await axiosInstance.get('/players');

            setWeeklyData({
                events: weekEvents,
                tasks: weekTasks,
                players: playersResponse.data.players || [],
                priorities: generateWeeklyPriorities(weekEvents),
                completed: []
            });

            // Coaching Tips basierend auf Woche und Saisonphase generieren
            setCoachingTips(generateCoachingTips(weekEvents, currentSeasonPhase));

        } catch (error) {
            handleApiError(error, 'wöchentlichen');
        }
    };    const generateWeeklyPriorities = (events) => {
        const priorities = [];
        
        // Kommende Spiele priorisieren
        const upcomingGames = events.filter(e => e.type === 'game' || e.type === 'match');
        if (upcomingGames.length > 0) {
            upcomingGames.forEach(game => {
                priorities.push({
                    id: `game-prep-${game._id}`,
                    title: `Spielvorbereitung: ${game.title}`,
                    description: `Gegner: ${game.gameData?.opponent || 'TBD'} | ${moment(game.date).format('dddd, DD.MM')} um ${game.time}`,
                    priority: 'high',
                    category: 'match',
                    action: () => navigate(`/team/event/${game._id}`),
                    estimated: '2-3 Stunden',
                    icon: FaTrophy,
                    dueDate: game.date
                });
            });
        }

        // Training planen
        const trainings = events.filter(e => e.type === 'training');
        if (trainings.length > 0) {
            trainings.forEach(training => {
                priorities.push({
                    id: `training-prep-${training._id}`,
                    title: `Training vorbereiten: ${training.title}`,
                    description: `${moment(training.date).format('dddd, DD.MM')} um ${training.time} | ${training.duration || 90} Min.`,
                    priority: 'medium',
                    category: 'training',
                    action: () => navigate(`/team/training/${training._id}`),
                    estimated: '1-2 Stunden',
                    icon: FaDumbbell,
                    dueDate: training.date
                });
            });
        }

        // Saisonphasen-spezifische Aufgaben
        const phaseSpecificTasks = getPhaseSpecificTasks();
        priorities.push(...phaseSpecificTasks);

        // Nach Priorität und Datum sortieren
        return priorities.sort((a, b) => {
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
                return priorityOrder[b.priority] - priorityOrder[a.priority];
            }
            return new Date(a.dueDate || Date.now()) - new Date(b.dueDate || Date.now());
        });
    };

    const getPhaseSpecificTasks = () => {
        const tasks = [];
        const weekStart = currentWeek.clone().startOf('isoWeek');
        
        switch (currentSeasonPhase) {
            case 'Sommervorbereitung':
                tasks.push({
                    id: 'summer-prep-fitness',
                    title: 'Konditionstraining planen',
                    description: 'Aufbautraining für die neue Saison',
                    priority: 'high',
                    category: 'preparation',
                    action: () => navigate('/exercises?filter=kondition'),
                    estimated: '1 Stunde',
                    icon: FaRunning,
                    dueDate: weekStart.clone().add(2, 'days').toDate()
                });
                break;
                
            case 'Vorrunde':
            case 'Rückrunde':
                tasks.push({
                    id: 'season-analysis',
                    title: 'Spielerleistung bewerten',
                    description: 'Wöchentliche Leistungsanalyse durchführen',
                    priority: 'medium',
                    category: 'analysis',
                    action: () => navigate('/team/statistics'),
                    estimated: '45 Minuten',
                    icon: FaChartLine,
                    dueDate: weekStart.clone().add(6, 'days').toDate() // Sonntag
                });
                break;
                
            case 'Wintervorbereitung':
                tasks.push({
                    id: 'winter-prep-tactics',
                    title: 'Taktik verfeinern',
                    description: 'Neue Spielsysteme einüben',
                    priority: 'medium',
                    category: 'tactics',
                    action: () => navigate('/team/tactics'),
                    estimated: '2 Stunden',
                    icon: FaBullseye,
                    dueDate: weekStart.clone().add(3, 'days').toDate()
                });
                break;
        }

        // Wöchentliche Standard-Aufgaben
        tasks.push({
            id: 'weekly-planning',
            title: 'Nächste Woche planen',
            description: 'Termine und Training für kommende Woche festlegen',
            priority: 'low',
            category: 'planning',
            action: () => navigate('/team/schedule'),
            estimated: '30 Minuten',
            icon: FaCalendarWeek,
            dueDate: weekStart.clone().add(6, 'days').toDate()
        });

        return tasks;
    };    const generateCoachingTips = (events, seasonPhase) => {
        const tips = [];
        
        // Tipps basierend auf kommenden Events
        const hasGame = events.some(e => e.type === 'game' || e.type === 'match');
        const hasTraining = events.some(e => e.type === 'training');
        const nextGame = events.find(e => e.type === 'game' || e.type === 'match');
        
        if (hasGame && nextGame) {
            const daysUntilGame = moment(nextGame.date).diff(moment(), 'days');
            if (daysUntilGame <= 2) {
                tips.push({
                    category: 'Spielvorbereitung',
                    tip: `Spiel in ${daysUntilGame + 1} Tag(en): Konzentrieren Sie sich auf Standardsituationen und mentale Vorbereitung. Vermeiden Sie intensive körperliche Belastung.`,
                    icon: FaTrophy,
                    priority: 'high'
                });
            } else {
                tips.push({
                    category: 'Spielvorbereitung',
                    tip: `Analysieren Sie den Gegner "${nextGame.gameData?.opponent || 'TBD'}" und bereiten Sie spezifische taktische Maßnahmen vor.`,
                    icon: FaTrophy,
                    priority: 'medium'
                });
            }
        }
        
        if (hasTraining) {
            const nextTraining = events.find(e => e.type === 'training');
            tips.push({
                category: 'Training',
                tip: `Nächstes Training "${nextTraining.title}": Stellen Sie sicher, dass alle Materialien vorbereitet sind und die Übungen den Lernzielen entsprechen.`,
                icon: FaDumbbell,
                priority: 'medium'
            });
        }

        // Saisonphasen-spezifische Tips
        const phaseTips = getSeasonPhaseTips(seasonPhase);
        tips.push(...phaseTips);

        // Wochenspezifische Tips basierend auf Wochentag
        const weekdayTips = getWeekdayTips();
        tips.push(...weekdayTips);

        return tips.slice(0, 6); // Maximal 6 Tips anzeigen
    };

    const getSeasonPhaseTips = (phase) => {
        const tips = [];
        
        switch (phase) {
            case 'Sommervorbereitung':
                tips.push(
                    {
                        category: 'Kondition',
                        tip: 'Bauen Sie die Grundlagenausdauer schrittweise auf. 70% der Trainingszeit sollte aerob sein.',
                        icon: FaRunning,
                        priority: 'medium'
                    },
                    {
                        category: 'Teambuilding',
                        tip: 'Nutzen Sie Trainingslager und gemeinsame Aktivitäten, um den Teamgeist zu stärken.',
                        icon: FaUsers,
                        priority: 'low'
                    }
                );
                break;
                
            case 'Vorrunde':
                tips.push(
                    {
                        category: 'Taktik',
                        tip: 'Etablieren Sie Ihr Grundsystem. Variationen können später eingeführt werden.',
                        icon: FaBullseye,
                        priority: 'medium'
                    },
                    {
                        category: 'Rotation',
                        tip: 'Rotieren Sie bewusst, um alle Spieler match-fit zu halten.',
                        icon: FaUsers,
                        priority: 'medium'
                    }
                );
                break;
                
            case 'Wintervorbereitung':
                tips.push(
                    {
                        category: 'Regeneration',
                        tip: 'Geben Sie den Spielern ausreichend Erholung. Mental wie körperlich.',
                        icon: FaPause,
                        priority: 'high'
                    },
                    {
                        category: 'Taktik',
                        tip: 'Perfekte Zeit für taktische Verfeinerungen und neue Varianten.',
                        icon: FaBullseye,
                        priority: 'medium'
                    }
                );
                break;
                
            case 'Rückrunde':
                tips.push(
                    {
                        category: 'Endspurt',
                        tip: 'Jetzt zählt jeder Punkt. Fokus auf Konstanz und Mentalität.',
                        icon: FaTrophy,
                        priority: 'high'
                    },
                    {
                        category: 'Belastung',
                        tip: 'Achten Sie auf Überlastung. Spieler sind am Saisonende müder.',
                        icon: FaClock,
                        priority: 'medium'
                    }
                );
                break;
        }
        
        return tips;
    };

    const getWeekdayTips = () => {
        const today = moment().isoWeekday(); // 1 = Montag, 7 = Sonntag
        const tips = [];
        
        switch (today) {
            case 1: // Montag
                tips.push({
                    category: 'Wochenstart',
                    tip: 'Analysieren Sie das Wochenende und planen Sie die neue Woche. Teamgespräch ist wichtig.',
                    icon: FaLightbulb,
                    priority: 'medium'
                });
                break;
            case 2: // Dienstag
                tips.push({
                    category: 'Training',
                    tip: 'Intensives Training ist heute ideal. Die Spieler sind erholt vom Wochenende.',
                    icon: FaDumbbell,
                    priority: 'medium'
                });
                break;
            case 5: // Freitag
                tips.push({
                    category: 'Spielvorbereitung',
                    tip: 'Abschlusstraining sollte kurz und präzise sein. Fokus auf Selbstvertrauen.',
                    icon: FaTrophy,
                    priority: 'medium'
                });
                break;
            case 7: // Sonntag
                tips.push({
                    category: 'Regeneration',
                    tip: 'Planen Sie die kommende Woche und gönnen Sie sich auch Erholung.',
                    icon: FaPause,
                    priority: 'low'
                });
                break;
        }
        
        return tips;
    };

    const navigateWeek = (direction) => {
        setCurrentWeek(currentWeek.clone().add(direction, 'week'));
    };

    const toggleTaskCompletion = async (taskId) => {
        const isCompleted = weeklyData.completed.includes(taskId);
        
        try {
            // Update local state immediately for better UX
            setWeeklyData(prev => ({
                ...prev,
                completed: isCompleted
                    ? prev.completed.filter(id => id !== taskId)
                    : [...prev.completed, taskId]
            }));

            // Save to backend if it's a real task (has database ID)
            const task = weeklyData.tasks.find(t => t._id === taskId);
            if (task) {
                await axiosInstance.put(`/edit-task/${taskId}`, {
                    ...task,
                    isCompleted: !isCompleted,
                    completedAt: !isCompleted ? new Date() : null
                });
            } else {
                // For priority tasks, save completion state to localStorage
                const completedTasks = JSON.parse(localStorage.getItem('completedWeeklyTasks') || '{}');
                const weekKey = currentWeek.format('YYYY-WW');
                
                if (!completedTasks[weekKey]) {
                    completedTasks[weekKey] = [];
                }
                
                if (isCompleted) {
                    completedTasks[weekKey] = completedTasks[weekKey].filter(id => id !== taskId);
                } else {
                    completedTasks[weekKey].push(taskId);
                }
                
                localStorage.setItem('completedWeeklyTasks', JSON.stringify(completedTasks));
            }
        } catch (error) {
            console.error('Error updating task completion:', error);
            // Revert local state on error
            setWeeklyData(prev => ({
                ...prev,
                completed: isCompleted
                    ? [...prev.completed, taskId]
                    : prev.completed.filter(id => id !== taskId)
            }));
        }
    };

    const loadCompletedTasks = () => {
        const completedTasks = JSON.parse(localStorage.getItem('completedWeeklyTasks') || '{}');
        const weekKey = currentWeek.format('YYYY-WW');
        return completedTasks[weekKey] || [];
    };

    // Load completed tasks when week changes
    useEffect(() => {
        const completed = loadCompletedTasks();
        setWeeklyData(prev => ({
            ...prev,
            completed
        }));
    }, [currentWeek]);

    const createQuickTask = async (title, description, priority = 'medium') => {
        try {
            const taskData = {
                title,
                content: description,
                priority,
                dueDate: currentWeek.clone().endOf('isoWeek').toDate(),
                isCompleted: false,
                category: 'weekly-planning'
            };

            const response = await axiosInstance.post('/add-task', taskData);
            
            if (response.data && !response.data.error) {
                // Reload weekly data to include new task
                loadWeeklyData();
                return true;
            }
        } catch (error) {
            console.error('Error creating quick task:', error);
        }
        return false;
    };

    // Error handling for API failures
    const handleApiError = (error, context) => {
        console.error(`Error in ${context}:`, error);
        setApiError(`Fehler beim Laden der ${context}-Daten. Bitte versuchen Sie es später erneut.`);
        
        // Auto-clear error after 5 seconds
        setTimeout(() => setApiError(null), 5000);
    };

    const createWeeklyTask = async (title, description, priority = 'medium', dueDate = null) => {
        try {
            const taskData = {
                title,
                content: description,
                priority,
                dueDate: dueDate || currentWeek.clone().endOf('isoWeek').toDate(),
                isCompleted: false,
                category: 'weekly-planning',
                tags: ['weekly', currentSeasonPhase.toLowerCase().replace(' ', '-')]
            };

            const response = await axiosInstance.post('/add-task', taskData);
            
            if (response.data && !response.data.error) {
                // Reload weekly data to include new task
                loadWeeklyData();
                return response.data.task;
            }
        } catch (error) {
            console.error('Error creating weekly task:', error);
            return null;
        }
    };

    const generateSeasonalWeeklyTasks = async () => {
        const existingTasks = weeklyData.tasks.filter(task => 
            task.category === 'weekly-planning' && 
            task.tags?.includes('auto-generated')
        );

        // Avoid creating duplicate tasks
        if (existingTasks.length > 0) return;

        const tasks = [];
        const weekStart = currentWeek.clone().startOf('isoWeek');

        switch (currentSeasonPhase) {
            case 'Sommervorbereitung':
                tasks.push({
                    title: 'Konditionstest durchführen',
                    description: 'Fitness-Level der Spieler zu Saisonbeginn messen',
                    priority: 'high',
                    dueDate: weekStart.clone().add(2, 'days').toDate()
                });
                break;
                
            case 'Vorrunde':
            case 'Rückrunde':
                tasks.push({
                    title: 'Gegneranalyse vorbereiten',
                    description: 'Nächsten Gegner analysieren und Taktik anpassen',
                    priority: 'high',
                    dueDate: weekStart.clone().add(1, 'days').toDate()
                });
                break;
        }

        // Create tasks in backend
        for (const task of tasks) {
            await createWeeklyTask(task.title, task.description, task.priority, task.dueDate);
        }
    };

    // Auto-generate weekly tasks when needed
    useEffect(() => {
        if (weeklyData.events.length > 0 && weeklyData.tasks.length === 0) {
            generateSeasonalWeeklyTasks();
        }
    }, [weeklyData.events, currentSeasonPhase]);    return (
        <Layout>
            <div className="min-h-screen bg-gray-50 p-6">
                {/* Header mit Wochennavigation */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                            <FaCalendarWeek className="mr-3 text-blue-600" />
                            Wochenassistent
                        </h1>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setCurrentWeek(currentWeek.clone().subtract(1, 'week'))}
                                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                            >
                                <FaChevronLeft />
                            </button>
                            <div className="text-center">
                                <div className="text-lg font-semibold text-gray-800">
                                    {currentWeek.format('DD.MM')} - {currentWeek.clone().endOf('isoWeek').format('DD.MM.YYYY')}
                                </div>
                                <div className="text-sm text-gray-600">
                                    Kalenderwoche {currentWeek.format('WW')} | {currentSeasonPhase}
                                </div>
                            </div>
                            <button
                                onClick={() => setCurrentWeek(currentWeek.clone().add(1, 'week'))}
                                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                            >
                                <FaChevronRight />
                            </button>
                        </div>
                    </div>

                    {/* Wochenstatus */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                                weekStatus === 'planning' ? 'bg-blue-100 text-blue-800' :
                                weekStatus === 'active' ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'
                            }`}>
                                {weekStatus === 'planning' ? 'Planung' :
                                 weekStatus === 'active' ? 'Aktive Woche' : 'Abgeschlossen'}
                            </div>
                            <div className="text-sm text-gray-600">
                                {weeklyData.events.length} Termine | {weeklyData.tasks.length} Aufgaben
                            </div>
                        </div>
                    </div>
                </div>

                {/* API Error Display */}
                {apiError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                        <FaExclamationTriangle className="inline mr-2" />
                        {apiError}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Linke Spalte: Wochenprioritäten */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                <FaBullseye className="mr-2 text-red-500" />
                                Wochenprioritäten
                            </h2>
                            
                            {weeklyData.priorities.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <FaCalendarWeek className="mx-auto text-4xl mb-4 opacity-50" />
                                    <p>Keine Prioritäten für diese Woche</p>
                                    <p className="text-sm">Events und Aufgaben werden automatisch zu Prioritäten</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {weeklyData.priorities.map((priority) => {
                                        const IconComponent = priority.icon;
                                        const isCompleted = weeklyData.completed.includes(priority.id);
                                        
                                        return (
                                            <div
                                                key={priority.id}
                                                className={`border rounded-lg p-4 transition-all hover:shadow-md ${
                                                    isCompleted ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
                                                } ${
                                                    priority.priority === 'high' ? 'border-l-4 border-l-red-500' :
                                                    priority.priority === 'medium' ? 'border-l-4 border-l-yellow-500' :
                                                    'border-l-4 border-l-blue-500'
                                                }`}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-start space-x-3 flex-1">
                                                        <button
                                                            onClick={() => toggleTaskCompletion(priority.id)}
                                                            className={`mt-1 ${
                                                                isCompleted ? 'text-green-600' : 'text-gray-400 hover:text-green-600'
                                                            }`}
                                                        >
                                                            <FaCheckCircle size={20} />
                                                        </button>
                                                        
                                                        <div className="flex-1">
                                                            <div className="flex items-center space-x-2 mb-2">
                                                                <IconComponent className={`${
                                                                    priority.priority === 'high' ? 'text-red-500' :
                                                                    priority.priority === 'medium' ? 'text-yellow-500' :
                                                                    'text-blue-500'
                                                                }`} />
                                                                <h3 className={`font-semibold ${
                                                                    isCompleted ? 'line-through text-gray-500' : 'text-gray-800'
                                                                }`}>
                                                                    {priority.title}
                                                                </h3>
                                                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                                    priority.priority === 'high' ? 'bg-red-100 text-red-800' :
                                                                    priority.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                                                    'bg-blue-100 text-blue-800'
                                                                }`}>
                                                                    {priority.priority === 'high' ? 'Hoch' :
                                                                     priority.priority === 'medium' ? 'Mittel' : 'Niedrig'}
                                                                </span>
                                                            </div>
                                                            <p className={`text-sm mb-2 ${
                                                                isCompleted ? 'text-gray-400' : 'text-gray-600'
                                                            }`}>
                                                                {priority.description}
                                                            </p>
                                                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                                                                <span className="flex items-center">
                                                                    <FaClock className="mr-1" />
                                                                    {priority.estimated}
                                                                </span>
                                                                {priority.dueDate && (
                                                                    <span>
                                                                        Bis: {moment(priority.dueDate).format('DD.MM')}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    {priority.action && (
                                                        <button
                                                            onClick={priority.action}
                                                            className="ml-4 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                                                        >
                                                            <FaArrowRight className="inline mr-1" />
                                                            Öffnen
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Events dieser Woche */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                <FaCalendarWeek className="mr-2 text-green-500" />
                                Events dieser Woche
                            </h2>
                            
                            {weeklyData.events.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <FaCalendarWeek className="mx-auto text-4xl mb-4 opacity-50" />
                                    <p>Keine Events in dieser Woche</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {weeklyData.events.map((event) => (
                                        <div
                                            key={event._id}
                                            className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                                            onClick={() => navigate(`/team/event/${event._id}`)}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <div className={`p-2 rounded ${
                                                        event.type === 'game' || event.type === 'match' ? 'bg-red-100 text-red-600' :
                                                        event.type === 'training' ? 'bg-blue-100 text-blue-600' :
                                                        'bg-gray-100 text-gray-600'
                                                    }`}>
                                                        {event.type === 'game' || event.type === 'match' ? <FaTrophy /> : <FaDumbbell />}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-gray-800">{event.title}</h3>
                                                        <p className="text-sm text-gray-600">
                                                            {moment(event.date).format('dddd, DD.MM')} um {event.time}
                                                            {event.gameData?.opponent && ` | vs. ${event.gameData.opponent}`}
                                                        </p>
                                                    </div>
                                                </div>
                                                <FaArrowRight className="text-gray-400" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Rechte Spalte: Coaching Tips & Quick Actions */}
                    <div className="space-y-6">
                        {/* Coaching Tips */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                <FaLightbulb className="mr-2 text-yellow-500" />
                                Coaching Tips
                            </h2>
                            
                            {coachingTips.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <FaLightbulb className="mx-auto text-4xl mb-4 opacity-50" />
                                    <p>Keine spezifischen Tips für diese Woche</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {coachingTips.map((tip, index) => {
                                        const IconComponent = tip.icon;
                                        return (
                                            <div
                                                key={index}
                                                className={`border-l-4 pl-4 py-3 ${
                                                    tip.priority === 'high' ? 'border-red-500 bg-red-50' :
                                                    tip.priority === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                                                    'border-blue-500 bg-blue-50'
                                                }`}
                                            >
                                                <div className="flex items-start space-x-2">
                                                    <IconComponent className={`mt-1 ${
                                                        tip.priority === 'high' ? 'text-red-600' :
                                                        tip.priority === 'medium' ? 'text-yellow-600' :
                                                        'text-blue-600'
                                                    }`} />
                                                    <div>
                                                        <h4 className="font-semibold text-gray-800 text-sm">
                                                            {tip.category}
                                                        </h4>
                                                        <p className="text-sm text-gray-700 mt-1">
                                                            {tip.tip}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                <FaClipboardList className="mr-2 text-purple-500" />
                                Quick Actions
                            </h2>
                            
                            <div className="space-y-3">
                                <button
                                    onClick={() => navigate('/team/schedule')}
                                    className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center space-x-3">
                                        <FaCalendarWeek className="text-blue-600" />
                                        <span className="font-medium">Woche planen</span>
                                    </div>
                                </button>
                                
                                <button
                                    onClick={() => navigate('/exercises')}
                                    className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center space-x-3">
                                        <FaDumbbell className="text-green-600" />
                                        <span className="font-medium">Übungen suchen</span>
                                    </div>
                                </button>
                                
                                <button
                                    onClick={() => navigate('/team/players')}
                                    className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center space-x-3">
                                        <FaUsers className="text-purple-600" />
                                        <span className="font-medium">Spieler verwalten</span>
                                    </div>
                                </button>
                                
                                <button
                                    onClick={() => navigate('/notes')}
                                    className="w-full text-left p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center space-x-3">
                                        <FaClipboardList className="text-yellow-600" />
                                        <span className="font-medium">Notizen erstellen</span>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Spieler-Statistiken */}
                        {weeklyData.players.length > 0 && (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                    <FaUsers className="mr-2 text-indigo-500" />
                                    Team-Status
                                </h2>
                                
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Aktive Spieler</span>
                                        <span className="font-semibold">{weeklyData.players.length}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Events diese Woche</span>
                                        <span className="font-semibold">{weeklyData.events.length}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Offene Aufgaben</span>
                                        <span className="font-semibold">
                                            {weeklyData.tasks.filter(task => !task.isCompleted).length}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default WeeklyCoach;
