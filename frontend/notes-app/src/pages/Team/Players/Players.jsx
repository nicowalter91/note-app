import React, { useState, useEffect } from 'react';
import Layout from '../../../components/Layout/Layout';
import { FaUserPlus, FaSearch, FaInfo, FaPen, FaTrashAlt, FaCheck, FaExclamation, FaFilter, FaTimes, FaStar, FaUsers } from 'react-icons/fa';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import { calculatePlayerScore, getScoreRating } from '../../../utils/playerScoreUtils.jsx';
import { getAllPlayers, addPlayer as addPlayerAPI, updatePlayer as updatePlayerAPI, deletePlayer as deletePlayerAPI, getProfileImageUrl } from '../../../utils/playerService';

// Import Design System Components
import {
  PageHeader,
  Card,
  Button,
  Badge,
  LoadingSpinner,
  EmptyState,
  StatsGrid
} from '../../../components/UI/DesignSystem';

const Players = () => {    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newPlayer, setNewPlayer] = useState({ name: '', position: '', age: '', number: '', status: 'Available', dob: '' });
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPlayer, setEditingPlayer] = useState(null);
    const [isEditing, setIsEditing] = useState(false);    const [statusFilter, setStatusFilter] = useState('all');
    const navigate = useNavigate();// Fetch players from API
    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                setLoading(true);
                const playersData = await getAllPlayers();                console.log('Spielerdaten von API:', playersData);
                console.log('Erste 3 Spieler IDs:', playersData.slice(0, 3).map(p => ({ id: p._id, name: p.name })));
                setPlayers(playersData || []);
                setError(null);
            } catch (err) {
                console.error('Fehler beim Laden der Spieler:', err);
                setError('Fehler beim Laden der Spieler. Bitte versuchen Sie es später erneut.');
            } finally {
                setLoading(false);
            }
        };
        
        fetchPlayers();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPlayer({ ...newPlayer, [name]: value });
    };

    const getDefaultPlayerAttributes = () => {
        return {
            physicalAttributes: {
                speed: 50,
                strength: 50,
                agility: 50,
                endurance: 50,
                fitness: 50
            },
            skills: {
                // Die Skills werden je nach Position angepasst
            }
        };
    };

    const getPositionSkills = (position) => {
        // Standardskills je nach Spielerposition
        switch(position) {
            case 'GK':
                return {
                    goalkeeping: 50,
                    passing: 50,
                    positioning: 50,
                    reflexes: 50,
                    handling: 50
                };
            case 'DF':
            case 'CB':
            case 'RB':
            case 'LB':
                return {
                    tackling: 50,
                    passing: 50,
                    positioning: 50,
                    heading: 50,
                    marking: 50
                };
            case 'MF':
            case 'CM':
            case 'CDM':
            case 'CAM':
                return {
                    passing: 50,
                    vision: 50,
                    dribbling: 50,
                    tackling: 50,
                    shooting: 50
                };
            case 'ST':
            case 'CF':
            case 'RW':
            case 'LW':
                return {
                    shooting: 50,
                    dribbling: 50,
                    pace: 50,
                    positioning: 50,
                    finishing: 50
                };
            default:
                return {
                    passing: 50,
                    tackling: 50,
                    positioning: 50
                };
        }
    };    const addPlayer = async () => {
        if (newPlayer.name && newPlayer.position && newPlayer.age && newPlayer.number) {
            try {
                setLoading(true);
                
                // Erweitere den neuen Spieler mit Standard-Attributen basierend auf der Position
                const playerAttributes = getDefaultPlayerAttributes();
                const positionSkills = getPositionSkills(newPlayer.position);
                
                const playerWithAttributes = {
                    ...newPlayer,
                    physicalAttributes: playerAttributes.physicalAttributes,
                    skills: positionSkills
                };
                
                if (isEditing && editingPlayer !== null) {
                    // Behalte vorhandene Attribute bei, falls vorhanden
                    const currentPlayer = players[editingPlayer];
                    const existingAttributes = currentPlayer.physicalAttributes || playerAttributes.physicalAttributes;
                    const existingSkills = currentPlayer.skills || positionSkills;
                    
                    const updatedPlayer = {
                        ...playerWithAttributes,
                        physicalAttributes: existingAttributes,
                        skills: existingSkills
                    };
                    
                    // API-Aufruf zum Aktualisieren des Spielers
                    const response = await updatePlayerAPI(currentPlayer._id, updatedPlayer);
                    
                    // Aktualisiere die lokale Spielerliste
                    const updatedPlayers = [...players];
                    updatedPlayers[editingPlayer] = response;
                    setPlayers(updatedPlayers);
                    
                    setIsEditing(false);
                    setEditingPlayer(null);
                } else {
                    // API-Aufruf zum Hinzufügen eines Spielers
                    const response = await addPlayerAPI(playerWithAttributes);
                    
                    // Aktualisiere die lokale Spielerliste
                    setPlayers([...players, response]);
                }
                
                setNewPlayer({ name: '', position: '', age: '', number: '', status: 'Available', dob: '' });
                setIsModalOpen(false);
            } catch (err) {
                console.error('Fehler beim Speichern des Spielers:', err);
                alert('Fehler beim Speichern des Spielers. Bitte versuchen Sie es später erneut.');
            } finally {
                setLoading(false);
            }
        } else {
            alert('Bitte füllen Sie alle Pflichtfelder aus.');
        }
    };    const confirmDeletePlayer = async (index) => {
        try {
            const player = players[index];
            if (window.confirm('Möchten Sie diesen Spieler wirklich entfernen?')) {
                setLoading(true);
                // API-Aufruf zum Löschen des Spielers
                await deletePlayerAPI(player._id);
                
                // Aktualisiere die lokale Spielerliste
                setPlayers(players.filter((_, i) => i !== index));
                setLoading(false);
            }        } catch (err) {
            console.error('Fehler beim Löschen des Spielers:', err);
            alert('Fehler beim Löschen des Spielers. Bitte versuchen Sie es später erneut.');
            setLoading(false);
        }
    };

    const editPlayer = (index) => {
        const player = players[index];
        setEditingPlayer(index);
        // Stelle sicher, dass alle notwendigen Felder vorhanden sind
        setNewPlayer({
            ...player,
            // Konvertiere numerische Felder für Formularfelder
            age: player.age.toString(),
            number: player.number.toString()
        });
        setIsEditing(true);
        setIsModalOpen(true);
    };

    // Filter players based on search and status
    const displayPlayers = players.filter(player => {
        const matchesSearch = player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            player.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
            player.number.toString().includes(searchQuery);
        
        const matchesStatus = statusFilter === 'all' || player.status === statusFilter;
        
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'Available': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'Injured': return 'bg-red-50 text-red-700 border-red-200';
            case 'Away': return 'bg-amber-50 text-amber-700 border-amber-200';
            default: return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Available': return <FaCheck className="text-emerald-500" />;
            case 'Injured': return <FaExclamation className="text-red-500" />;
            case 'Away': return <FaExclamation className="text-amber-500" />;
            default: return null;
        }
    };    return (
        <Layout>
            <div className="min-h-screen bg-gray-50 p-6">
                {/* Page Header */}
                <PageHeader
                    title="Spielerverwaltung"
                    subtitle="Verwalten Sie Ihr Team und die Spielerprofile"
                    icon={FaUsers}
                    action={
                        <Button
                            onClick={() => {
                                setIsEditing(false);
                                setEditingPlayer(null);
                                setNewPlayer({ name: '', position: '', age: '', number: '', status: 'Available', dob: '' });
                                setIsModalOpen(true);
                            }}
                            variant="primary"
                            icon={FaUserPlus}
                            disabled={loading}
                        >
                            Spieler hinzufügen
                        </Button>
                    }
                />

                {/* Error Display */}
                {error && (
                    <Card className="border-red-200 bg-red-50 mb-6">
                        <div className="flex items-center text-red-700">
                            <FaExclamation className="mr-2" />
                            {error}
                        </div>
                    </Card>
                )}

                {/* Loading State */}
                {loading && <LoadingSpinner text="Lade Spielerdaten..." />}

                {/* Statistics Grid */}
                {!loading && players.length > 0 && (
                    <div className="mb-6">
                        <StatsGrid
                            stats={[
                                {
                                    icon: FaUsers,
                                    value: players.length,
                                    label: 'Gesamt Spieler'
                                },
                                {
                                    icon: FaCheck,
                                    value: players.filter(p => p.status === 'Available').length,
                                    label: 'Verfügbar'
                                },
                                {
                                    icon: FaExclamation,
                                    value: players.filter(p => p.status === 'Injured').length,
                                    label: 'Verletzt'
                                },
                                {
                                    icon: FaStar,
                                    value: Math.round(players.reduce((sum, p) => sum + calculatePlayerScore(p), 0) / players.length),
                                    label: 'Ø Bewertung'
                                }
                            ]}
                        />
                    </div>
                )}

                {/* Search and Filter */}
                <Card className="mb-6">
                    <div className="space-y-4">
                        {/* Search Bar */}
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Spieler durchsuchen..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <FaTimes />
                                </button>
                            )}
                        </div>

                        {/* Status Filters */}
                        <div className="flex flex-wrap gap-2">
                            <span className="text-sm text-gray-500 mr-2">Status:</span>
                            
                            <Badge
                                variant={statusFilter === 'all' ? 'primary' : 'secondary'}
                                onClick={() => setStatusFilter('all')}
                                className="cursor-pointer"
                            >
                                Alle ({players.length})
                            </Badge>
                            
                            <Badge
                                variant={statusFilter === 'Available' ? 'success' : 'secondary'}
                                onClick={() => setStatusFilter('Available')}
                                className="cursor-pointer"
                            >
                                Verfügbar ({players.filter(p => p.status === 'Available').length})
                            </Badge>
                            
                            <Badge
                                variant={statusFilter === 'Injured' ? 'danger' : 'secondary'}
                                onClick={() => setStatusFilter('Injured')}
                                className="cursor-pointer"
                            >
                                Verletzt ({players.filter(p => p.status === 'Injured').length})
                            </Badge>
                            
                            <Badge
                                variant={statusFilter === 'Away' ? 'warning' : 'secondary'}
                                onClick={() => setStatusFilter('Away')}
                                className="cursor-pointer"
                            >
                                Abwesend ({players.filter(p => p.status === 'Away').length})
                            </Badge>
                        </div>
                    </div>
                </Card>                {/* Player Grid */}
                {!loading && displayPlayers.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {displayPlayers.map((player, index) => (
                            <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
                                <div className="bg-gray-50 p-4 flex justify-center">
                                    {player.profileImage ? (
                                        <img 
                                            src={`${getProfileImageUrl(player._id)}?t=${new Date().getTime()}`} 
                                            alt={player.name}
                                            className="w-20 h-20 object-cover rounded-full"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = '/default-avatar.png';
                                            }}
                                        />
                                    ) : (
                                        <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                                            <span className="text-gray-500 text-2xl font-bold">
                                                {player.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="p-5">
                                    <h3 className="text-lg font-semibold text-gray-800 text-center mb-3">{player.name}</h3>
                                    
                                    <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                                        <div>
                                            <p className="text-gray-500">Position</p>
                                            <p className="font-medium">{player.position}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Nummer</p>
                                            <p className="font-medium">#{player.number}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Alter</p>
                                            <p className="font-medium">{player.age}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Geb.</p>
                                            <p className="font-medium">{player.dob}</p>
                                        </div>
                                    </div>

                                    {/* Player Score */}
                                    <div className="flex justify-center mb-3">
                                        <div className="bg-gray-100 rounded-lg px-3 py-1">
                                            <div className="flex items-center">
                                                <span className="text-gray-800 text-lg font-bold">
                                                    {calculatePlayerScore(player)}
                                                </span>
                                                <span className={`ml-1 text-xs font-medium ${getScoreRating(calculatePlayerScore(player)).color}`}>
                                                    {getScoreRating(calculatePlayerScore(player)).text.substring(0, 4)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                        <Badge
                                            variant={
                                                player.status === 'Available' ? 'success' :
                                                player.status === 'Injured' ? 'danger' :
                                                player.status === 'Away' ? 'warning' : 'secondary'
                                            }
                                        >
                                            {getStatusIcon(player.status)} {player.status}
                                        </Badge>

                                        <div className="flex gap-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => navigate(`/team/players/${player._id}`)}
                                                icon={FaInfo}
                                                title="Profil ansehen"
                                            />
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => editPlayer(index)}
                                                icon={FaPen}
                                                title="Bearbeiten"
                                            />
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => confirmDeletePlayer(index)}
                                                icon={FaTrashAlt}
                                                title="Löschen"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : !loading && (
                    <EmptyState
                        icon={FaSearch}
                        title="Keine Spieler gefunden"
                        description={
                            searchQuery || statusFilter !== 'all'
                                ? "Versuchen Sie Ihre Suche anzupassen oder Filter zu ändern."
                                : "Erstellen Sie Ihr erstes Spielerprofil, um zu beginnen."
                        }
                        action={
                            <Button
                                variant="primary"
                                icon={FaUserPlus}
                                onClick={() => {
                                    setIsEditing(false);
                                    setEditingPlayer(null);
                                    setNewPlayer({ name: '', position: '', age: '', number: '', status: 'Available', dob: '' });
                                    setIsModalOpen(true);
                                }}
                            >
                                Ersten Spieler erstellen
                            </Button>
                        }
                    />
                )}                {/* Modal for Adding/Editing Player */}
                <Modal
                    isOpen={isModalOpen}
                    onRequestClose={() => {
                        setIsModalOpen(false);
                        setIsEditing(false);
                    }}
                    style={{
                        overlay: { 
                            backgroundColor: 'rgba(0, 0, 0, 0.6)',
                            zIndex: 1000,
                        },
                        content: {
                            top: '50%',
                            left: '50%',
                            right: 'auto',
                            bottom: 'auto',
                            marginRight: '-50%',
                            transform: 'translate(-50%, -50%)',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '0',
                            width: '90%',
                            maxWidth: '600px',
                            maxHeight: '90vh',
                            overflow: 'auto',
                        },
                    }}
                    contentLabel={isEditing ? "Spieler bearbeiten" : "Neuen Spieler hinzufügen"}
                >
                    <Card className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-semibold text-gray-800">
                                {isEditing ? "Spieler bearbeiten" : "Neuen Spieler hinzufügen"}
                            </h2>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsModalOpen(false)}
                                icon={FaTimes}
                            />
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">Name</label>
                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    placeholder="Name"
                                    value={newPlayer.name}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="position">Position</label>
                                <input
                                    id="position"
                                    type="text"
                                    name="position"
                                    placeholder="Position"
                                    value={newPlayer.position}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="age">Alter</label>
                                <input
                                    id="age"
                                    type="number"
                                    name="age"
                                    placeholder="Alter"
                                    value={newPlayer.age}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="number">Trikotnummer</label>
                                <input
                                    id="number"
                                    type="number"
                                    name="number"
                                    placeholder="Trikotnummer"
                                    value={newPlayer.number}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="dob">Geburtsdatum</label>
                                <input
                                    id="dob"
                                    type="text"
                                    name="dob"
                                    placeholder="DD.MM.YYYY"
                                    value={newPlayer.dob}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="status">Status</label>
                                <select
                                    id="status"
                                    name="status"
                                    value={newPlayer.status}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="Available">Verfügbar</option>
                                    <option value="Injured">Verletzt</option>
                                    <option value="Away">Abwesend</option>
                                </select>
                            </div>
                        </div>
                        
                        <div className="mt-6 flex justify-end gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Abbrechen
                            </Button>
                            <Button
                                variant="primary"
                                onClick={addPlayer}
                            >
                                {isEditing ? "Aktualisieren" : "Hinzufügen"}
                            </Button>
                        </div>
                    </Card>
                </Modal>
            </div>
        </Layout>
    );
};

export default Players;
