import axiosInstance from './axiosInstance';
import moment from 'moment';

export const createSampleSeasonData = async () => {
    try {
        // Create sample training events for this week
        const thisWeek = moment().startOf('isoWeek');
        
        const sampleEvents = [
            {
                title: 'Mannschaftstraining',
                type: 'training',
                date: thisWeek.clone().add(1, 'days').format('YYYY-MM-DD'), // Tuesday
                time: '18:00',
                duration: 90,
                location: 'Trainingsplatz 1',
                description: 'Intensives Training mit Fokus auf Ballbesitz',
                trainingData: {
                    focus: 'technical',
                    intensity: 'high',
                    exercises: []
                }
            },
            {
                title: 'Spielvorbereitung',
                type: 'training',
                date: thisWeek.clone().add(4, 'days').format('YYYY-MM-DD'), // Friday
                time: '17:30',
                duration: 75,
                location: 'Trainingsplatz 1',
                description: 'Abschlusstraining vor dem Spiel',
                trainingData: {
                    focus: 'tactical',
                    intensity: 'medium',
                    exercises: []
                }
            },
            {
                title: 'Heimspiel vs. FC Beispiel',
                type: 'game',
                date: thisWeek.clone().add(5, 'days').format('YYYY-MM-DD'), // Saturday
                time: '15:00',
                duration: 90,
                location: 'Heimstadion',
                description: 'Wichtiges Ligaspiel gegen direkten Konkurrenten',
                gameData: {
                    opponent: 'FC Beispiel',
                    venue: 'home',
                    competition: 'Liga',
                    importance: 'high'
                }
            }
        ];

        // Create sample tasks
        const sampleTasks = [
            {
                title: 'Trainingsplan für diese Woche erstellen',
                content: 'Übungen und Schwerpunkte für die kommenden Trainingseinheiten festlegen',
                priority: 'high',
                dueDate: thisWeek.clone().add(1, 'days').toDate(),
                category: 'training-preparation',
                tags: ['weekly', 'training']
            },
            {
                title: 'Spielerleistung vom letzten Spiel bewerten',
                content: 'Individuelle Bewertungen der Spieler erstellen und Verbesserungspotentiale identifizieren',
                priority: 'medium',
                dueDate: thisWeek.clone().add(2, 'days').toDate(),
                category: 'player-analysis',
                tags: ['weekly', 'analysis']
            },
            {
                title: 'Material und Ausrüstung prüfen',
                content: 'Bälle, Hütchen und andere Trainingsmaterialien kontrollieren',
                priority: 'low',
                dueDate: thisWeek.clone().add(3, 'days').toDate(),
                category: 'organization',
                tags: ['weekly', 'equipment']
            }
        ];

        // Create sample exercises
        const sampleExercises = [
            {
                title: 'Passspiel im Quadrat',
                category: 'technical',
                difficulty: 'medium',
                duration: 15,
                playersCount: '8-12',
                description: 'Verbesserung der Passpräzision und des ersten Ballkontakts',
                instructions: '4 Spieler stehen in den Ecken eines 15x15m Quadrats. Die anderen bewegen sich frei im Feld.',
                equipment: ['8 Hütchen', '2 Bälle'],
                tags: ['passing', 'first-touch', 'movement']
            },
            {
                title: 'Torschuss unter Druck',
                category: 'finishing',
                difficulty: 'high',
                duration: 20,
                playersCount: '6-8',
                description: 'Torschussübung mit zeitlichem Druck und Verteidiger',
                instructions: 'Angreifer erhält Ball und muss binnen 3 Sekunden abschließen, während Verteidiger Druck ausübt.',
                equipment: ['1 Tor', '10 Bälle', '4 Hütchen'],
                tags: ['shooting', 'pressure', 'finishing']
            }
        ];

        // Create events
        for (const event of sampleEvents) {
            try {
                await axiosInstance.post('/add-event', event);
            } catch (error) {
                console.log('Event already exists or error:', error.response?.data?.message);
            }
        }

        // Create tasks
        for (const task of sampleTasks) {
            try {
                await axiosInstance.post('/add-task', task);
            } catch (error) {
                console.log('Task already exists or error:', error.response?.data?.message);
            }
        }

        // Create exercises
        for (const exercise of sampleExercises) {
            try {
                await axiosInstance.post('/add-exercise', exercise);
            } catch (error) {
                console.log('Exercise already exists or error:', error.response?.data?.message);
            }
        }

        return {
            success: true,
            message: 'Beispieldaten erfolgreich erstellt',
            created: {
                events: sampleEvents.length,
                tasks: sampleTasks.length,
                exercises: sampleExercises.length
            }
        };

    } catch (error) {
        console.error('Error creating sample data:', error);
        return {
            success: false,
            message: 'Fehler beim Erstellen der Beispieldaten',
            error: error.message
        };
    }
};

export const clearSampleData = async () => {
    try {
        // Note: This would require additional backend endpoints to clear data
        // For now, this is a placeholder
        console.log('Sample data clearing would happen here');
        return { success: true, message: 'Beispieldaten würden gelöscht' };
    } catch (error) {
        return { success: false, message: 'Fehler beim Löschen', error: error.message };
    }
};
