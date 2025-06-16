import React, { useState } from 'react';
import { 
    FaDumbbell, 
    FaRunning, 
    FaFutbol, 
    FaUsers, 
    FaStopwatch,
    FaPlay
} from 'react-icons/fa';

const TrainingTemplates = ({ onSelectTemplate }) => {
    const [selectedTemplate, setSelectedTemplate] = useState(null);

    const templates = [
        {
            id: 'kondition',
            title: 'Konditionstraining',
            description: 'Ausdauer, Schnelligkeit und Kraftausdauer',
            icon: FaRunning,
            color: 'red',
            duration: 90,
            exercises: [
                { title: 'Warmlaufen', duration: 15, category: 'Aufwärmen' },
                { title: 'Sprints', duration: 20, category: 'Schnelligkeit' },
                { title: 'Zirkeltraining', duration: 25, category: 'Kraft' },
                { title: 'Ausdauerlauf', duration: 20, category: 'Ausdauer' },
                { title: 'Cool Down', duration: 10, category: 'Abwärmen' }
            ]
        },
        {
            id: 'technik',
            title: 'Techniktraining',
            description: 'Ballkontrolle, Passing und Schuss',
            icon: FaFutbol,
            color: 'blue',
            duration: 90,
            exercises: [
                { title: 'Ballgewöhnung', duration: 15, category: 'Aufwärmen' },
                { title: 'Passübungen', duration: 25, category: 'Technik' },
                { title: 'Dribbel-Parcours', duration: 20, category: 'Technik' },
                { title: 'Torschuss-Training', duration: 20, category: 'Technik' },
                { title: 'Stretching', duration: 10, category: 'Abwärmen' }
            ]
        },
        {
            id: 'taktik',
            title: 'Taktiktraining',
            description: 'Spielzüge, Positionsspiel und Pressig',
            icon: FaUsers,
            color: 'green',
            duration: 90,
            exercises: [
                { title: 'Kurzes Aufwärmen', duration: 10, category: 'Aufwärmen' },
                { title: 'Positionsspiel 6v4', duration: 25, category: 'Taktik' },
                { title: 'Standardsituationen', duration: 20, category: 'Taktik' },
                { title: 'Spielformen 11v11', duration: 25, category: 'Spiel' },
                { title: 'Auslaufen', duration: 10, category: 'Abwärmen' }
            ]
        },
        {
            id: 'spielvorbereitung',
            title: 'Spielvorbereitung',
            description: 'Aktivierung und taktische Einstellung',
            icon: FaStopwatch,
            color: 'purple',
            duration: 60,
            exercises: [
                { title: 'Aktivierung', duration: 15, category: 'Aufwärmen' },
                { title: 'Passspiel', duration: 15, category: 'Technik' },
                { title: 'Taktikbesprechung', duration: 15, category: 'Taktik' },
                { title: 'Standardsituationen', duration: 10, category: 'Taktik' },
                { title: 'Lockerung', duration: 5, category: 'Abwärmen' }
            ]
        },
        {
            id: 'regeneration',
            title: 'Regenerationstraining',
            description: 'Lockeres Training zur Erholung',
            icon: FaDumbbell,
            color: 'gray',
            duration: 60,
            exercises: [
                { title: 'Lockeres Laufen', duration: 15, category: 'Aufwärmen' },
                { title: 'Balljonglage', duration: 15, category: 'Technik' },
                { title: 'Stretching', duration: 15, category: 'Beweglichkeit' },
                { title: 'Entspannung', duration: 15, category: 'Regeneration' }
            ]
        },
        {
            id: 'custom',
            title: 'Individuelles Training',
            description: 'Eigenes Training von Grund auf erstellen',
            icon: FaPlay,
            color: 'orange',
            duration: 90,
            exercises: []
        }
    ];

    const getColorClasses = (color) => {
        const colorMap = {
            red: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900 dark:text-red-300 dark:border-red-800',
            blue: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-800',
            green: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-800',
            purple: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900 dark:text-purple-300 dark:border-purple-800',
            gray: 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-800',
            orange: 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900 dark:text-orange-300 dark:border-orange-800'
        };
        return colorMap[color] || colorMap.gray;
    };

    const getIconColorClasses = (color) => {
        const colorMap = {
            red: 'text-red-500',
            blue: 'text-blue-500',
            green: 'text-green-500',
            purple: 'text-purple-500',
            gray: 'text-gray-500',
            orange: 'text-orange-500'
        };
        return colorMap[color] || colorMap.gray;
    };

    const handleSelectTemplate = (template) => {
        setSelectedTemplate(template);
        if (onSelectTemplate) {
            onSelectTemplate(template);
        }
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                    Trainingsvorlagen
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Wählen Sie eine Vorlage oder erstellen Sie ein individuelles Training
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map(template => {
                    const IconComponent = template.icon;
                    const isSelected = selectedTemplate?.id === template.id;
                    
                    return (
                        <div
                            key={template.id}
                            onClick={() => handleSelectTemplate(template)}
                            className={`relative cursor-pointer border-2 rounded-xl p-4 transition-all duration-200 hover:shadow-md ${
                                isSelected 
                                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                            }`}
                        >
                            {isSelected && (
                                <div className="absolute top-2 right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                </div>
                            )}
                            
                            <div className="flex items-start space-x-3 mb-3">
                                <div className={`w-10 h-10 rounded-lg ${getColorClasses(template.color)} flex items-center justify-center`}>
                                    <IconComponent className={`text-lg ${getIconColorClasses(template.color)}`} />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-gray-800 dark:text-white text-sm">
                                        {template.title}
                                    </h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        {template.description}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-300">Dauer:</span>
                                    <span className="font-medium text-gray-800 dark:text-white">
                                        {template.duration} Min
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-300">Übungen:</span>
                                    <span className="font-medium text-gray-800 dark:text-white">
                                        {template.exercises.length}
                                        {template.id === 'custom' && ' (frei wählbar)'}
                                    </span>
                                </div>
                            </div>

                            {template.exercises.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                                        Übungsablauf:
                                    </p>
                                    <div className="space-y-1">
                                        {template.exercises.slice(0, 3).map((exercise, index) => (
                                            <div key={index} className="flex items-center justify-between text-xs">
                                                <span className="text-gray-600 dark:text-gray-300 truncate">
                                                    {exercise.title}
                                                </span>
                                                <span className="text-gray-500 dark:text-gray-400 ml-2">
                                                    {exercise.duration}min
                                                </span>
                                            </div>
                                        ))}
                                        {template.exercises.length > 3 && (
                                            <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                                                +{template.exercises.length - 3} weitere...
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {selectedTemplate && (
                <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                        <span className="font-medium text-green-800 dark:text-green-300">
                            Vorlage ausgewählt: {selectedTemplate.title}
                        </span>
                    </div>
                    <p className="text-sm text-green-700 dark:text-green-400">
                        Diese Vorlage wird als Basis für Ihr Training verwendet. Sie können alle Details anpassen.
                    </p>
                </div>
            )}
        </div>
    );
};

export default TrainingTemplates;
