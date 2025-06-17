import React, { useState, useEffect } from 'react';
import Layout from '../../../../components/Layout/Layout';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    FaArrowLeft, FaEdit, FaUser, FaRunning, FaMedal, FaChartLine, 
    FaBandAid, FaNotesMedical, FaTrophy, FaClipboardList, FaUserFriends, 
    FaCalendarAlt, FaComment, FaDownload, FaChartBar, FaCaretUp, FaCaretDown,
    FaFilePdf, FaCheck, FaExclamation, FaStar
} from 'react-icons/fa';
import { calculatePlayerScore, getScoreRating } from '../../../../utils/playerScoreUtils.jsx';
import { getPlayerById } from '../../../../utils/playerService';
import ProfileImageUpload from '../../../../components/ProfileImageUpload/ProfileImageUpload';
import { exportPlayerProfileToPDF } from '../../../../utils/playerProfilePdf';

const PlayerProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [player, setPlayer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    
    // Funktion zum Exportieren des Profils als PDF
    const exportToPDF = () => {
        console.log('exportToPDF wurde aufgerufen', player);
        if (!player) {
            console.error('Kein Spieler verfügbar für PDF-Export');
            return;
        }

        try {
            console.log('PDF-Erstellung gestartet');
            // Use the imported exportPlayerProfileToPDF function
            exportPlayerProfileToPDF(player);
        } catch (error) {
            console.error('Fehler beim Erstellen des PDF:', error);
            if (error.stack) {
                console.error('Stack trace:', error.stack);
            }
        }
    };

    // Fetch player data from API
    useEffect(() => {
        const fetchPlayerData = async () => {
            try {
                setLoading(true);
                const playerData = await getPlayerById(id);
                console.log('Spielerdaten von API für Player ID:', id, playerData);
                setPlayer(playerData);
                setError(null);
            } catch (err) {
                console.error('Fehler beim Laden des Spielers:', err);
                setError('Fehler beim Laden des Spielers. Bitte versuchen Sie es später erneut.');
            } finally {
                setLoading(false);
            }
        };
        
        fetchPlayerData();
    }, [id]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Available': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'Injured': return 'bg-red-50 text-red-700 border-red-200';
            case 'Away': return 'bg-amber-50 text-amber-700 border-amber-200';
            default: return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    // Chart data for visualization
    const performanceLabels = ['Geschwindigkeit', 'Kraft', 'Beweglichkeit', 'Ausdauer', 'Fitness'];
    const performanceData = player?.physicalAttributes ? [
        player.physicalAttributes.speed, 
        player.physicalAttributes.strength, 
        player.physicalAttributes.agility, 
        player.physicalAttributes.endurance, 
        player.physicalAttributes.fitness
    ] : [];

    if (loading) {
        return (
            <Layout>
                <div className="container mx-auto py-8 px-4 max-w-7xl">
                    <div className="animate-pulse">
                        <div className="h-10 w-1/4 bg-gray-200 rounded mb-6"></div>
                        <div className="h-64 bg-gray-200 rounded-xl mb-6"></div>
                    </div>
                </div>
            </Layout>
        );
    }

    if (!player) {
        return (
            <Layout>
                <div className="container mx-auto py-8 px-4 max-w-7xl">
                    <div className="bg-white rounded-xl p-10 flex flex-col items-center justify-center shadow-sm">
                        <h3 className="text-xl font-medium text-gray-700">Spieler nicht gefunden</h3>
                        <p className="text-gray-500 text-center mt-2">
                            Der gesuchte Spieler konnte nicht gefunden werden.
                        </p>
                        <button 
                            onClick={() => navigate('/team/players')} 
                            className="mt-6 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            <FaArrowLeft size={14} /> Zurück zur Spielerliste
                        </button>
                    </div>
                </div>
            </Layout>
        );
    }

    const playerScore = calculatePlayerScore(player);
    const scoreRating = getScoreRating(playerScore);

    const renderTabContent = () => {
        if (!player) return null;
        
        switch (activeTab) {
            case 'overview':
                return (
                    <>
                        {/* Physical attributes */}
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
                            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                                    <FaRunning className="text-blue-500" /> Körperliche Daten
                                </h2>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                                    <div>
                                        <h3 className="text-sm text-gray-500 mb-1">Größe</h3>
                                        <p className="font-medium">{player.height || "-"} cm</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm text-gray-500 mb-1">Gewicht</h3>
                                        <p className="font-medium">{player.weight || "-"} kg</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm text-gray-500 mb-1">Bevorzugter Fuß</h3>
                                        <p className="font-medium">{player.personalInfo?.preferredFoot || "-"}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm text-gray-500 mb-1">Fitness-Level</h3>
                                        <p className="font-medium">{player.physicalAttributes?.fitness || "-"}/100</p>
                                    </div>
                                </div>
                                {player.physicalAttributes && (
                                    <div className="mt-6">
                                        <h3 className="text-sm text-gray-500 mb-3">Leistungsprofil</h3>
                                        <div className="grid grid-cols-5 gap-2">
                                            {performanceLabels.map((label, index) => (
                                                <div key={index} className="flex flex-col items-center">
                                                    <div className="w-full bg-gray-100 rounded-full h-40 flex flex-col justify-end overflow-hidden">
                                                        <div 
                                                            className="bg-blue-500" 
                                                            style={{height: `${performanceData[index]}%`}}
                                                        ></div>
                                                    </div>
                                                    <span className="text-xs text-gray-500 mt-1">{label}</span>
                                                    <span className="text-xs font-medium">{performanceData[index]}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Statistics */}
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
                            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                                    <FaChartBar className="text-blue-500" /> Statistiken
                                </h2>
                            </div>
                            <div className="p-6">
                                {player.stats ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                                        <div>
                                            <h3 className="text-sm text-gray-500 mb-1">Spiele</h3>
                                            <p className="font-medium">{player.stats.games}</p>
                                        </div>
                                        <div>
                                            <h3 className="text-sm text-gray-500 mb-1">Spielminuten</h3>
                                            <p className="font-medium">{player.stats.minutesPlayed}</p>
                                        </div>
                                        {player.position === 'GK' ? (
                                            <>
                                                <div>
                                                    <h3 className="text-sm text-gray-500 mb-1">Zu-Null-Spiele</h3>
                                                    <p className="font-medium">{player.stats.cleanSheets}</p>
                                                </div>
                                                <div>
                                                    <h3 className="text-sm text-gray-500 mb-1">Parade-Quote</h3>
                                                    <p className="font-medium">{player.stats.savesPercentage}%</p>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div>
                                                    <h3 className="text-sm text-gray-500 mb-1">Tore</h3>
                                                    <p className="font-medium">{player.stats.goals || 0}</p>
                                                </div>
                                                <div>
                                                    <h3 className="text-sm text-gray-500 mb-1">Vorlagen</h3>
                                                    <p className="font-medium">{player.stats.assists || 0}</p>
                                                </div>
                                            </>
                                        )}
                                        <div>
                                            <h3 className="text-sm text-gray-500 mb-1">Gelbe Karten</h3>
                                            <p className="font-medium">{player.stats.yellowCards}</p>
                                        </div>
                                        <div>
                                            <h3 className="text-sm text-gray-500 mb-1">Rote Karten</h3>
                                            <p className="font-medium">{player.stats.redCards}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-center py-6">
                                        Keine Statistiken verfügbar
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Skills section */}
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
                            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                                    <FaMedal className="text-blue-500" /> Fähigkeiten
                                </h2>
                                <div className="flex items-center">
                                    <span className="text-sm font-medium">
                                        Skill-Score: {player.skills ? Math.round(Object.values(player.skills).reduce((a, b) => a + b, 0) / Object.values(player.skills).length) : '-'}/100
                                    </span>
                                </div>
                            </div>
                            <div className="p-6">
                                {player.skills ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                                        {Object.entries(player.skills).map(([key, value]) => (
                                            <div key={key}>
                                                <h3 className="text-sm text-gray-500 mb-1 capitalize">{key}</h3>
                                                <div className="flex items-center">
                                                    <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                                                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${value}%` }}></div>
                                                    </div>
                                                    <span className="font-medium text-sm">{value}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-center py-6">
                                        Keine Fähigkeitsbewertungen verfügbar
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Team role */}
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                                    <FaUserFriends className="text-blue-500" /> Teamrolle
                                </h2>
                            </div>
                            <div className="p-6">
                                {player.teamRole ? (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <h3 className="text-sm text-gray-500 mb-1">Rolle</h3>
                                            <p className="font-medium">{player.teamRole.leadership || "-"}</p>
                                        </div>
                                        <div>
                                            <h3 className="text-sm text-gray-500 mb-1">Bevorzugte Spielpartner</h3>
                                            <p className="font-medium">
                                                {player.teamRole.preferredPartners?.join(', ') || "-"}
                                            </p>
                                        </div>
                                        <div>
                                            <h3 className="text-sm text-gray-500 mb-1">Teamchemie</h3>
                                            <p className="font-medium">{player.teamRole.chemistry || "-"}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-center py-6">
                                        Keine Teamrolleninformationen verfügbar
                                    </p>
                                )}
                            </div>
                        </div>
                    </>
                );

            case 'medical':
                return (
                    <>
                        {/* Injury history */}
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
                            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                                    <FaBandAid className="text-red-500" /> Verletzungshistorie
                                </h2>
                            </div>
                            <div className="p-6">
                                {player.injuries && player.injuries.length > 0 ? (
                                    <div className="divide-y divide-gray-100">
                                        {player.injuries.map((injury, index) => (
                                            <div key={index} className={`py-4 ${index === 0 ? 'pt-0' : ''}`}>
                                                <div className="flex justify-between items-center">
                                                    <h3 className="font-medium text-gray-800">{injury.type}</h3>
                                                    <span className={`px-2 py-1 rounded-full text-xs ${injury.status === 'Erholt' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                                                        {injury.status}
                                                    </span>
                                                </div>
                                                <div className="mt-1 flex gap-4 text-sm text-gray-500">
                                                    <span>Datum: {injury.date}</span>
                                                    <span>Dauer: {injury.duration}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-center py-6">
                                        Keine Verletzungen dokumentiert
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Medical documents */}
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
                            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                                    <FaNotesMedical className="text-red-500" /> Medizinische Dokumente
                                </h2>
                            </div>
                            <div className="p-6">
                                {player.documents && player.documents.filter(doc => doc.type === 'medical').length > 0 ? (
                                    <div className="divide-y divide-gray-100">
                                        {player.documents.filter(doc => doc.type === 'medical').map((doc, index) => (
                                            <div key={index} className={`py-4 ${index === 0 ? 'pt-0' : ''} flex justify-between items-center`}>
                                                <div>
                                                    <h3 className="font-medium text-gray-800">{doc.name}</h3>
                                                    <p className="text-sm text-gray-500">Datum: {doc.date}</p>
                                                </div>
                                                <button className="p-2 text-gray-500 hover:text-blue-600">
                                                    <FaDownload />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-center py-6">
                                        Keine medizinischen Dokumente vorhanden
                                    </p>
                                )}
                            </div>
                        </div>
                    </>
                );

            case 'development':
                return (
                    <>
                        {/* Development Goals */}
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
                            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                                    <FaTrophy className="text-amber-500" /> Entwicklungsziele
                                </h2>
                            </div>
                            <div className="p-6">
                                {player.development && player.development.goals ? (
                                    <div className="space-y-4">
                                        <h3 className="font-medium text-gray-800">Aktuelle Ziele:</h3>
                                        <ul className="list-disc pl-5 space-y-2">
                                            {player.development.goals.map((goal, index) => (
                                                <li key={index} className="text-gray-700">{goal}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-center py-6">
                                        Keine Entwicklungsziele definiert
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Recent Progress */}
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
                            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                                    <FaChartLine className="text-green-500" /> Entwicklungsfortschritt
                                </h2>
                            </div>
                            <div className="p-6">
                                {player.development && player.development.recentProgress ? (
                                    <div className="divide-y divide-gray-100">
                                        {player.development.recentProgress.map((progress, index) => (
                                            <div key={index} className={`py-4 ${index === 0 ? 'pt-0' : ''} flex justify-between items-center`}>
                                                <div>
                                                    <h3 className="font-medium text-gray-800">{progress.skill}</h3>
                                                    <p className="text-sm text-gray-500">Aktualisiert am: {progress.date}</p>
                                                </div>
                                                <div className={`flex items-center ${progress.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                    {progress.change > 0 ? <FaCaretUp /> : <FaCaretDown />}
                                                    <span className="font-medium">{Math.abs(progress.change)}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-center py-6">
                                        Keine Fortschrittsdaten verfügbar
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Training Information */}
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                                    <FaRunning className="text-blue-500" /> Trainingsinformationen
                                </h2>
                            </div>
                            <div className="p-6">
                                {player.training ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h3 className="text-sm text-gray-500 mb-1">Trainingsbeteiligung</h3>
                                            <p className="font-medium">{player.training.attendance}%</p>
                                        </div>
                                        {player.training.specialProgram && (
                                            <div>
                                                <h3 className="text-sm text-gray-500 mb-1">Spezielles Trainingsprogramm</h3>
                                                <p className="font-medium">{player.training.specialProgram}</p>
                                            </div>
                                        )}
                                        {player.training.recentPerformance && (
                                            <div className="col-span-2">
                                                <h3 className="text-sm text-gray-500 mb-3">Letzte Trainingsleistungen</h3>
                                                <div className="flex items-end h-16 gap-1">
                                                    {player.training.recentPerformance.map((perf, index) => (
                                                        <div key={index} className="flex-1 flex flex-col items-center">
                                                            <div className="w-full bg-gray-200 rounded-sm flex-1 flex flex-col justify-end">
                                                                <div
                                                                    className={`w-full ${perf >= 85 ? 'bg-green-500' : perf >= 70 ? 'bg-blue-500' : 'bg-amber-500'}`}
                                                                    style={{ height: `${perf}%` }}
                                                                ></div>
                                                            </div>
                                                            <span className="text-xs mt-1">{index + 1}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                                <p className="text-xs text-gray-500 mt-2 text-center">Letzte 5 Trainingseinheiten (Bewertung 0-100)</p>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-center py-6">
                                        Keine Trainingsinformationen verfügbar
                                    </p>
                                )}
                            </div>
                        </div>
                    </>
                );

            case 'personal':
                return (
                    <>
                        {/* Personal Information */}
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
                            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                                    <FaUser className="text-blue-500" /> Persönliche Informationen
                                </h2>
                            </div>
                            <div className="p-6">
                                {player.personalInfo ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {player.personalInfo.email && (
                                            <div>
                                                <h3 className="text-sm text-gray-500 mb-1">E-Mail</h3>
                                                <p className="font-medium">{player.personalInfo.email}</p>
                                            </div>
                                        )}
                                        {player.personalInfo.phone && (
                                            <div>
                                                <h3 className="text-sm text-gray-500 mb-1">Telefon</h3>
                                                <p className="font-medium">{player.personalInfo.phone}</p>
                                            </div>
                                        )}
                                        {player.personalInfo.emergencyContact && (
                                            <div>
                                                <h3 className="text-sm text-gray-500 mb-1">Notfallkontakt</h3>
                                                <p className="font-medium">{player.personalInfo.emergencyContact}</p>
                                            </div>
                                        )}
                                        {player.personalInfo.school && (
                                            <div>
                                                <h3 className="text-sm text-gray-500 mb-1">Schule/Ausbildung</h3>
                                                <p className="font-medium">{player.personalInfo.school}</p>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-center py-6">
                                        Keine persönlichen Informationen verfügbar
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Documents */}
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                                    <FaClipboardList className="text-blue-500" /> Dokumente
                                </h2>
                            </div>
                            <div className="p-6">
                                {player.documents && player.documents.length > 0 ? (
                                    <div className="divide-y divide-gray-100">
                                        {player.documents.filter(doc => doc.type !== 'medical').map((doc, index) => (
                                            <div key={index} className={`py-4 ${index === 0 ? 'pt-0' : ''} flex justify-between items-center`}>
                                                <div>
                                                    <h3 className="font-medium text-gray-800">{doc.name}</h3>
                                                    <p className="text-sm text-gray-500">Datum: {doc.date}</p>
                                                </div>
                                                <button className="p-2 text-gray-500 hover:text-blue-600">
                                                    <FaDownload />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-center py-6">
                                        Keine Dokumente vorhanden
                                    </p>
                                )}
                            </div>
                        </div>
                    </>
                );

            case 'notes':
                return (
                    <>
                        {/* Coach Notes */}
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                                    <FaComment className="text-blue-500" /> Trainernotizen
                                </h2>
                            </div>
                            <div className="p-6">
                                {player.notes && player.notes.length > 0 ? (
                                    <div className="space-y-4">
                                        {player.notes.map((note, index) => (
                                            <div key={index} className="bg-gray-50 p-4 rounded-lg">
                                                <div className="flex justify-between mb-2">
                                                    <h3 className="font-medium text-gray-800">{note.author}</h3>
                                                    <span className="text-sm text-gray-500">{note.date}</span>
                                                </div>
                                                <p className="text-gray-700">{note.text}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-center py-6">
                                        Keine Notizen vorhanden
                                    </p>
                                )}
                            </div>
                        </div>
                    </>
                );            default:
                return null;
        }
    };

    return (
        <Layout>
            <div className="container mx-auto py-8 px-4 max-w-7xl">
                {/* Header card with player info and score */}                <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
                    <div className="bg-gray-50 border-b border-gray-100 h-24"></div>
                    <div className="px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between relative">                        <div className="flex items-center -mt-16 md:-mt-12">
                            <ProfileImageUpload 
                                playerId={player._id}
                                currentImage={player.profileImage}
                                onImageUpdate={(newImagePath) => {
                                    setPlayer({...player, profileImage: newImagePath});
                                }}
                            />
                            <div className="pt-2 md:pt-0">
                                <h1 className="text-2xl font-bold text-gray-800">{player.name}</h1>
                                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mt-1">
                                    <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">{player.position}</span>
                                    <span>#{player.number}</span>
                                    <span>•</span>
                                    <span>{player.age} Jahre</span>
                                    <span>•</span>
                                    <span>Geb.: {player.dob}</span>
                                </div>
                                <span className={`mt-2 inline-flex items-center gap-1 text-xs rounded-full px-2 py-1 border ${getStatusColor(player.status)}`}>
                                    {player.status}
                                </span>
                            </div>
                        </div>                        <div className="flex items-center mt-4 md:mt-0 space-x-4">
                            <div className="flex items-center bg-gray-50 rounded-lg px-4 py-2 border border-gray-100">
                                <div className="mr-3">
                                    <span className="text-xs font-medium text-gray-500">LEISTUNGSPROFIL</span>
                                    <div className="flex items-center mt-1">
                                        <span className="text-2xl font-bold text-gray-800">{playerScore}</span>
                                        <span className={`ml-1.5 text-xs font-medium ${scoreRating.color}`}>
                                            {scoreRating.text}
                                        </span>
                                    </div>
                                </div>
                                <div className="h-10 w-px bg-gray-200 mx-1"></div>
                                <div className="text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        {player.physicalAttributes && (
                                            <div className="text-center">
                                                <p className="text-xs text-gray-500">Phys</p>
                                                <p className="font-medium text-gray-700 text-sm">
                                                    {Math.round(Object.values(player.physicalAttributes).reduce((a, b) => a + b, 0) / Object.values(player.physicalAttributes).length)}                                                </p>
                                            </div>
                                        )}
                                        <div className="h-8 w-px bg-gray-200"></div>
                                        {player.skills && (
                                            <div className="text-center">
                                                <p className="text-xs text-gray-500">Tech</p>
                                                <p className="font-medium text-gray-700 text-sm">
                                                    {Math.round(Object.values(player.skills).reduce((a, b) => a + b, 0) / Object.values(player.skills).length)}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row gap-2 mt-4 md:mt-0">
                            <button
                                onClick={() => navigate(`/team/players/edit/${id}`)}
                                className="px-4 py-2 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-1"
                            >
                                <FaEdit size={14} /> Bearbeiten
                            </button>                            <button
                                onClick={exportToPDF}
                                className="px-4 py-2 bg-green-50 text-green-700 text-sm font-medium rounded-lg hover:bg-green-100 transition-colors flex items-center justify-center gap-1"
                            >
                                <FaFilePdf size={14} /> PDF Export
                            </button>                            <button
                                onClick={() => navigate('/team/players')}
                                className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-1"
                            >
                                <FaArrowLeft size={14} /> Zurück zur Übersicht
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tab navigation */}
                <div className="bg-white shadow-sm rounded-xl mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="flex overflow-x-auto">
                            <button
                                className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${activeTab === 'overview' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                onClick={() => setActiveTab('overview')}
                            >
                                Übersicht
                            </button>
                            <button
                                className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${activeTab === 'medical' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                onClick={() => setActiveTab('medical')}
                            >
                                Medizinisch
                            </button>
                            <button
                                className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${activeTab === 'development' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                onClick={() => setActiveTab('development')}
                            >
                                Entwicklung
                            </button>
                            <button
                                className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${activeTab === 'personal' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                onClick={() => setActiveTab('personal')}
                            >
                                Persönlich
                            </button>                            <button
                                className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${activeTab === 'notes' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                                onClick={() => setActiveTab('notes')}>
                                Notizen
                            </button>
                        </nav>
                    </div>
                    <div className="p-6">
                        {renderTabContent()}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default PlayerProfile;
