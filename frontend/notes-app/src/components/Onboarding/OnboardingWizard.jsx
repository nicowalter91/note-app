import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Button, 
    Input, 
    Card, 
    LoadingSpinner 
} from '../UI/DesignSystem';
import { 
    FaUsers, 
    FaFootballBall, 
    FaCheckCircle, 
    FaArrowRight, 
    FaArrowLeft,
    FaUpload,
    FaImage,
    FaBuilding,
    FaUserPlus,
    FaTasks,
    FaCalendarAlt
} from 'react-icons/fa';
import { updateClubSettings } from '../../utils/clubSettingsService';
import { startOnboardingTracking, trackOnboardingStep, completeOnboardingTracking } from '../../utils/analyticsService';
import axiosInstance from '../../utils/axiosInstance';

const OnboardingWizard = ({ onComplete }) => {
    const navigate = useNavigate();    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState(null);
    const [analyticsSessionId, setAnalyticsSessionId] = useState(null);
    const [stepStartTime, setStepStartTime] = useState(Date.now());
    const [wizardStartTime] = useState(Date.now());

    // Wizard Data
    const [wizardData, setWizardData] = useState({
        // Club Settings
        clubName: '',
        clubLogo: null,
        primaryColor: '#3b82f6',
        secondaryColor: '#10b981',
        founded: new Date().getFullYear(),
        address: '',
        phone: '',
        email: '',
        
        // Initial Players (optional)
        players: [],
        
        // First Task
        firstTask: {
            title: '',
            description: ''
        }
    });

    const totalSteps = 5;    useEffect(() => {
        fetchUserData();
        initAnalytics();
    }, []);

    useEffect(() => {
        // Track step change
        setStepStartTime(Date.now());
    }, [currentStep]);

    const initAnalytics = async () => {
        try {
            const response = await startOnboardingTracking('wizard', totalSteps);
            if (response.success) {
                setAnalyticsSessionId(response.sessionId);
            }
        } catch (error) {
            console.error('Failed to start analytics tracking:', error);
            // Continue without analytics
        }
    };    const trackCurrentStep = async (skipped = false) => {
        if (analyticsSessionId) {
            const timeSpent = Math.round((Date.now() - stepStartTime) / 1000);
            const stepTitle = getStepTitleForAnalytics(currentStep);
            await trackOnboardingStep(analyticsSessionId, currentStep - 1, stepTitle, timeSpent, skipped);
        }
    };

    const getStepTitleForAnalytics = (step) => {
        const titles = {
            1: 'Vereinseinstellungen',
            2: 'Kontaktinformationen',
            3: 'Spieler hinzufügen',
            4: 'Erste Aufgabe',
            5: 'Abschluss'
        };
        return titles[step] || `Schritt ${step}`;
    };

    const fetchUserData = async () => {
        try {
            const response = await axiosInstance.get('/get-user');
            setUserData(response.data.user);
            // Pre-fill email if available
            if (response.data.user?.email) {
                setWizardData(prev => ({
                    ...prev,
                    email: response.data.user.email
                }));
            }
        } catch (error) {
            console.error('Fehler beim Laden der Benutzerdaten:', error);
        }
    };    const handleNext = async () => {
        // Track current step before moving
        await trackCurrentStep(false);
        
        if (currentStep < totalSteps) {
            // Save current step data
            await saveStepData(currentStep);
            setCurrentStep(currentStep + 1);
        } else {
            // Complete onboarding
            await completeOnboarding();
        }
    };

    const handlePrev = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const saveStepData = async (step) => {
        try {
            setLoading(true);
            
            switch (step) {
                case 1:
                    // Save club basic info
                    await updateClubSettings({
                        name: wizardData.clubName,
                        logo: wizardData.clubLogo,
                        primaryColor: wizardData.primaryColor,
                        secondaryColor: wizardData.secondaryColor
                    });
                    break;
                    
                case 2:
                    // Save club contact info
                    await updateClubSettings({
                        founded: wizardData.founded,
                        address: wizardData.address,
                        phone: wizardData.phone,
                        email: wizardData.email
                    });
                    break;
                    
                case 3:
                    // Save initial players
                    if (wizardData.players.length > 0) {
                        for (const player of wizardData.players) {
                            await axiosInstance.post('/players', player);
                        }
                    }
                    break;
                    
                case 4:
                    // Save first task
                    if (wizardData.firstTask.title) {
                        await axiosInstance.post('/add-task', {
                            title: wizardData.firstTask.title,
                            content: wizardData.firstTask.description,
                            priority: 'medium',
                            status: 'pending'
                        });
                    }
                    break;
            }
        } catch (error) {
            console.error('Fehler beim Speichern der Daten:', error);
        } finally {
            setLoading(false);
        }
    };    const completeOnboarding = async () => {
        try {
            setLoading(true);
            
            // Track final step
            await trackCurrentStep(false);
            
            // Mark onboarding as completed
            await axiosInstance.put('/complete-onboarding');
            
            // Complete analytics tracking
            if (analyticsSessionId) {
                const totalTime = Math.round((Date.now() - wizardStartTime) / 1000);
                await completeOnboardingTracking(analyticsSessionId, 'completed', totalTime);
            }
            
            // Call completion callback
            if (onComplete) {
                onComplete();
            }
            
            // Navigate to dashboard
            navigate('/dashboard');
            
        } catch (error) {
            console.error('Fehler beim Abschließen des Onboardings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogoUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setWizardData(prev => ({
                    ...prev,
                    clubLogo: e.target.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const addPlayer = () => {
        setWizardData(prev => ({
            ...prev,
            players: [...prev.players, {
                name: '',
                position: 'Mittelfeld',
                jerseyNumber: prev.players.length + 1,
                dateOfBirth: '',
                phone: '',
                email: ''
            }]
        }));
    };

    const updatePlayer = (index, field, value) => {
        setWizardData(prev => ({
            ...prev,
            players: prev.players.map((player, i) => 
                i === index ? { ...player, [field]: value } : player
            )
        }));
    };

    const removePlayer = (index) => {
        setWizardData(prev => ({
            ...prev,
            players: prev.players.filter((_, i) => i !== index)
        }));
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="text-center space-y-6">
                        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                            <FaFootballBall className="text-3xl text-blue-600" />
                        </div>
                        
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                Willkommen bei Football Trainer! ⚽
                            </h2>
                            <p className="text-gray-600">
                                Lass uns deinen Verein einrichten. Das dauert nur wenige Minuten.
                            </p>
                        </div>

                        <div className="space-y-4 max-w-md mx-auto">
                            <Input
                                label="Vereinsname"
                                value={wizardData.clubName}
                                onChange={(e) => setWizardData(prev => ({...prev, clubName: e.target.value}))}
                                placeholder="FC Beispiel"
                                required
                            />

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Vereinslogo (optional)
                                </label>
                                <div className="flex items-center space-x-4">
                                    {wizardData.clubLogo ? (
                                        <img 
                                            src={wizardData.clubLogo} 
                                            alt="Vereinslogo" 
                                            className="w-16 h-16 object-cover rounded-lg border"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 bg-gray-100 rounded-lg border border-dashed border-gray-300 flex items-center justify-center">
                                            <FaImage className="text-gray-400" />
                                        </div>
                                    )}
                                    <div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleLogoUpload}
                                            className="hidden"
                                            id="logo-upload"
                                        />
                                        <label 
                                            htmlFor="logo-upload"
                                            className="cursor-pointer inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                        >
                                            <FaUpload className="mr-2" />
                                            Logo hochladen
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Primärfarbe
                                    </label>
                                    <input
                                        type="color"
                                        value={wizardData.primaryColor}
                                        onChange={(e) => setWizardData(prev => ({...prev, primaryColor: e.target.value}))}
                                        className="w-full h-10 border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Sekundärfarbe
                                    </label>
                                    <input
                                        type="color"
                                        value={wizardData.secondaryColor}
                                        onChange={(e) => setWizardData(prev => ({...prev, secondaryColor: e.target.value}))}
                                        className="w-full h-10 border border-gray-300 rounded-md"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="text-center space-y-6">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                            <FaBuilding className="text-3xl text-green-600" />
                        </div>
                        
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                Kontaktinformationen
                            </h2>
                            <p className="text-gray-600">
                                Diese Informationen helfen bei der Organisation und Kommunikation.
                            </p>
                        </div>

                        <div className="space-y-4 max-w-md mx-auto">
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Gründungsjahr"
                                    type="number"
                                    value={wizardData.founded}
                                    onChange={(e) => setWizardData(prev => ({...prev, founded: e.target.value}))}
                                    placeholder="1999"
                                />
                                <Input
                                    label="E-Mail"
                                    type="email"
                                    value={wizardData.email}
                                    onChange={(e) => setWizardData(prev => ({...prev, email: e.target.value}))}
                                    placeholder="info@verein.de"
                                />
                            </div>
                            
                            <Input
                                label="Telefon"
                                value={wizardData.phone}
                                onChange={(e) => setWizardData(prev => ({...prev, phone: e.target.value}))}
                                placeholder="+49 123 456789"
                            />
                            
                            <Input
                                label="Adresse"
                                value={wizardData.address}
                                onChange={(e) => setWizardData(prev => ({...prev, address: e.target.value}))}
                                placeholder="Musterstraße 123, 12345 Musterstadt"
                            />
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="text-center space-y-6">
                        <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                            <FaUsers className="text-3xl text-purple-600" />
                        </div>
                        
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                Erste Spieler hinzufügen
                            </h2>
                            <p className="text-gray-600">
                                Du kannst jetzt schon ein paar Spieler hinzufügen oder das später machen.
                            </p>
                        </div>

                        <div className="max-w-2xl mx-auto">
                            {wizardData.players.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-500 mb-4">Noch keine Spieler hinzugefügt</p>
                                    <Button onClick={addPlayer} variant="primary">
                                        <FaUserPlus className="mr-2" />
                                        Ersten Spieler hinzufügen
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {wizardData.players.map((player, index) => (
                                        <Card key={index} className="p-4">
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                <Input
                                                    label="Name"
                                                    value={player.name}
                                                    onChange={(e) => updatePlayer(index, 'name', e.target.value)}
                                                    placeholder="Max Mustermann"
                                                />
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Position
                                                    </label>
                                                    <select
                                                        value={player.position}
                                                        onChange={(e) => updatePlayer(index, 'position', e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    >
                                                        <option>Tor</option>
                                                        <option>Abwehr</option>
                                                        <option>Mittelfeld</option>
                                                        <option>Angriff</option>
                                                    </select>
                                                </div>
                                                <Input
                                                    label="Rückennummer"
                                                    type="number"
                                                    value={player.jerseyNumber}
                                                    onChange={(e) => updatePlayer(index, 'jerseyNumber', e.target.value)}
                                                />
                                            </div>
                                            <div className="flex justify-end mt-4">
                                                <Button 
                                                    variant="secondary" 
                                                    size="sm"
                                                    onClick={() => removePlayer(index)}
                                                >
                                                    Entfernen
                                                </Button>
                                            </div>
                                        </Card>
                                    ))}
                                    
                                    <div className="text-center">
                                        <Button onClick={addPlayer} variant="secondary">
                                            <FaUserPlus className="mr-2" />
                                            Weiteren Spieler hinzufügen
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="text-center space-y-6">
                        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
                            <FaTasks className="text-3xl text-yellow-600" />
                        </div>
                        
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                Erste Aufgabe erstellen
                            </h2>
                            <p className="text-gray-600">
                                Erstelle deine erste Aufgabe, um direkt mit der Organisation zu beginnen.
                            </p>
                        </div>

                        <div className="space-y-4 max-w-md mx-auto">
                            <Input
                                label="Aufgaben-Titel"
                                value={wizardData.firstTask.title}
                                onChange={(e) => setWizardData(prev => ({
                                    ...prev, 
                                    firstTask: {...prev.firstTask, title: e.target.value}
                                }))}
                                placeholder="Nächstes Training planen"
                            />
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Beschreibung (optional)
                                </label>
                                <textarea
                                    value={wizardData.firstTask.description}
                                    onChange={(e) => setWizardData(prev => ({
                                        ...prev, 
                                        firstTask: {...prev.firstTask, description: e.target.value}
                                    }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    rows="3"
                                    placeholder="Übungen auswählen, Trainingsplatz buchen, Material vorbereiten..."
                                />
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <p className="text-sm text-blue-800">
                                    💡 <strong>Tipp:</strong> Du kannst später weitere Aufgaben erstellen und sie deinem Team zuweisen.
                                </p>
                            </div>
                        </div>
                    </div>
                );

            case 5:
                return (
                    <div className="text-center space-y-6">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                            <FaCheckCircle className="text-3xl text-green-600" />
                        </div>
                        
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                Glückwunsch! 🎉
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Dein Verein <strong>{wizardData.clubName}</strong> ist jetzt eingerichtet!
                            </p>
                        </div>

                        <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-6 max-w-md mx-auto">
                            <h3 className="font-semibold text-gray-900 mb-4">Was du jetzt machen kannst:</h3>
                            <div className="space-y-3 text-sm text-gray-700 text-left">
                                <div className="flex items-center space-x-2">
                                    <FaUsers className="text-blue-600 flex-shrink-0" />
                                    <span>Weitere Spieler und Team-Mitglieder hinzufügen</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <FaCalendarAlt className="text-green-600 flex-shrink-0" />
                                    <span>Trainings und Spiele planen</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <FaTasks className="text-purple-600 flex-shrink-0" />
                                    <span>Aufgaben erstellen und verwalten</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <FaFootballBall className="text-orange-600 flex-shrink-0" />
                                    <span>Übungen zeichnen und speichern</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md mx-auto">
                            <p className="text-sm text-yellow-800">
                                🚀 <strong>Pro-Tipp:</strong> Schaue dir den Wochenassistenten an - er hilft dir bei der wöchentlichen Planung!
                            </p>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    const getStepTitle = () => {
        const titles = [
            'Grundeinstellungen',
            'Kontaktdaten', 
            'Spieler hinzufügen',
            'Erste Aufgabe',
            'Fertig!'
        ];
        return titles[currentStep - 1];
    };

    const canProceed = () => {
        switch (currentStep) {
            case 1:
                return wizardData.clubName.trim() !== '';
            case 2:
                return true; // Optional fields
            case 3:
                return true; // Optional players
            case 4:
                return true; // Optional task
            case 5:
                return true;
            default:
                return false;
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="border-b border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">
                                {getStepTitle()}
                            </h1>
                            <p className="text-sm text-gray-500">
                                Schritt {currentStep} von {totalSteps}
                            </p>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="flex items-center space-x-2">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                                <div 
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                                ></div>
                            </div>
                            <span className="text-sm text-gray-500">
                                {Math.round((currentStep / totalSteps) * 100)}%
                            </span>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8">
                    {renderStepContent()}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 p-6 flex justify-between">
                    <Button 
                        variant="secondary"
                        onClick={handlePrev}
                        disabled={currentStep === 1}
                    >
                        <FaArrowLeft className="mr-2" />
                        Zurück
                    </Button>
                    
                    <div className="flex space-x-3">
                        <Button 
                            variant="secondary"
                            onClick={() => navigate('/dashboard')}
                        >
                            Überspringen
                        </Button>
                        
                        <Button 
                            variant="primary"
                            onClick={handleNext}
                            disabled={!canProceed()}
                            loading={loading}
                        >
                            {currentStep === totalSteps ? 'Fertigstellen' : 'Weiter'}
                            {currentStep < totalSteps && <FaArrowRight className="ml-2" />}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OnboardingWizard;
