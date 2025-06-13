import React, { useState } from 'react';
import Layout from '../../../components/Layout/Layout';
import { FaUserPlus, FaSearch, FaInfo, FaPen, FaTrashAlt, FaCheck, FaExclamation, FaFilter, FaTimes, FaStar } from 'react-icons/fa';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import { calculatePlayerScore, getScoreRating } from '../../../utils/playerScoreUtils.jsx';

const Players = () => {
    const [players, setPlayers] = useState([
        { 
            name: 'Barry Sanders', 
            position: 'GK', 
            age: 16, 
            number: 1, 
            status: 'Available', 
            dob: '11.12.2006',
            physicalAttributes: {
                speed: 72,
                strength: 68,
                agility: 75,
                endurance: 80,
                fitness: 85
            },
            skills: {
                goalkeeping: 85,
                passing: 70,
                positioning: 82,
                reflexes: 86,
                handling: 78
            },
            stats: {
                games: 24,
                cleanSheets: 10,
                savesPercentage: 78
            }
        },
        { 
            name: 'Hugh Grant', 
            position: 'GK', 
            age: 16, 
            number: 12, 
            status: 'Injured', 
            dob: '30.08.2007',
            physicalAttributes: {
                speed: 68,
                strength: 65,
                agility: 72,
                endurance: 70,
                fitness: 65
            },
            skills: {
                goalkeeping: 75,
                passing: 68,
                positioning: 77,
                reflexes: 82,
                handling: 76
            }
        },
        { 
            name: 'Ethan Brooks', 
            position: 'DF', 
            age: 15, 
            number: 37, 
            status: 'Available', 
            dob: '05.09.2007',
            physicalAttributes: {
                speed: 78,
                strength: 72,
                agility: 76,
                endurance: 82,
                fitness: 85
            },
            skills: {
                tackling: 76,
                passing: 74,
                positioning: 75,
                heading: 77,
                marking: 78
            }
        },
        { 
            name: 'Marcus Sanchez', 
            position: 'CB', 
            age: 17, 
            number: 7, 
            status: 'Away', 
            dob: '12.06.2006',
            physicalAttributes: {
                speed: 76,
                strength: 83,
                agility: 72,
                endurance: 80,
                fitness: 78
            },
            skills: {
                tackling: 85,
                passing: 70,
                positioning: 84,
                heading: 88,
                marking: 83
            },
            stats: {
                games: 22,
                goals: 3,
                assists: 1,
                yellowCards: 4,
                redCards: 0
            }
        },
        { 
            name: 'Lucas Roberts', 
            position: 'CB', 
            age: 16, 
            number: 23, 
            status: 'Available', 
            dob: '15.10.2006',
            physicalAttributes: {
                speed: 75,
                strength: 79,
                agility: 73,
                endurance: 81,
                fitness: 83
            },
            skills: {
                tackling: 80,
                passing: 72,
                positioning: 81,
                heading: 82,
                marking: 78
            },
            stats: {
                games: 20,
                goals: 1,
                assists: 2,
                yellowCards: 2,
                redCards: 0
            }
        },
    ]);
    const [newPlayer, setNewPlayer] = useState({ name: '', position: '', age: '', number: '', status: 'Available', dob: '' });
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPlayer, setEditingPlayer] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();

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
    };

    const addPlayer = () => {
        if (newPlayer.name && newPlayer.position && newPlayer.age && newPlayer.number) {
            // Erweitere den neuen Spieler mit Standard-Attributen basierend auf der Position
            const playerAttributes = getDefaultPlayerAttributes();
            const positionSkills = getPositionSkills(newPlayer.position);
            
            const playerWithAttributes = {
                ...newPlayer,
                physicalAttributes: playerAttributes.physicalAttributes,
                skills: positionSkills
            };
            
            if (isEditing && editingPlayer !== null) {
                const updatedPlayers = [...players];
                // Behalte vorhandene Attribute bei, falls vorhanden
                const existingAttributes = players[editingPlayer].physicalAttributes || playerAttributes.physicalAttributes;
                const existingSkills = players[editingPlayer].skills || positionSkills;
                
                updatedPlayers[editingPlayer] = {
                    ...playerWithAttributes,
                    physicalAttributes: existingAttributes,
                    skills: existingSkills
                };
                
                setPlayers(updatedPlayers);
                setIsEditing(false);
                setEditingPlayer(null);
            } else {
                setPlayers([...players, playerWithAttributes]);
            }
            setNewPlayer({ name: '', position: '', age: '', number: '', status: 'Available', dob: '' });
            setIsModalOpen(false);
        }
    };

    const confirmDeletePlayer = (index) => {
        if (window.confirm('Möchten Sie diesen Spieler wirklich entfernen?')) {
            setPlayers(players.filter((_, i) => i !== index));
        }
    };

    const editPlayer = (index) => {
        setEditingPlayer(index);
        setNewPlayer(players[index]);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const filteredPlayers = players.filter(player =>
        player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        player.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
        player.number.toString().includes(searchQuery)
    );

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
    };

    return (
        <Layout>
            <div className="container mx-auto py-8 px-4 max-w-7xl">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Spielerverwaltung</h1>
                    <button
                        onClick={() => {
                            setIsEditing(false);
                            setEditingPlayer(null);
                            setNewPlayer({ name: '', position: '', age: '', number: '', status: 'Available', dob: '' });
                            setIsModalOpen(true);
                        }}
                        className="px-4 py-2 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                    >
                        <FaUserPlus /> Spieler hinzufügen
                    </button>
                </div>

                {/* Search and Filter */}
                <div className="bg-white shadow-sm rounded-xl p-4 mb-8">
                    <div className="flex items-center border-b border-gray-200 pb-4 mb-4">
                        <FaSearch className="text-gray-400 mr-3" />
                        <input
                            type="text"
                            placeholder="Spieler suchen..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full focus:outline-none text-gray-700"
                        />
                        {searchQuery && (
                            <button 
                                onClick={() => setSearchQuery('')}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <FaTimes />
                            </button>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <span className="text-sm text-gray-500 mr-2">Filter:</span>
                        <button className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-800 hover:bg-gray-200">
                            Alle
                        </button>
                        <button className="px-3 py-1 text-xs rounded-full bg-emerald-50 text-emerald-800 hover:bg-emerald-100">
                            Verfügbar
                        </button>
                        <button className="px-3 py-1 text-xs rounded-full bg-red-50 text-red-800 hover:bg-red-100">
                            Verletzt
                        </button>
                        <button className="px-3 py-1 text-xs rounded-full bg-amber-50 text-amber-800 hover:bg-amber-100">
                            Abwesend
                        </button>
                    </div>
                </div>

                {/* Player Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredPlayers.map((player, index) => (
                        <div 
                            key={index} 
                            className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow"
                        >
                            <div className="bg-gray-50 p-4 flex justify-center">
                                <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
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
                                </div>                                {/* Player Score - Dezenteres Design */}
                                <div className="flex justify-end mb-3">
                                    <div className="absolute top-4 right-4">
                                        <div className="bg-white rounded-lg border border-gray-100 px-2 py-1 shadow-sm">
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
                                </div>
                                
                                <div className="flex items-center justify-between">
                                    <span className={`inline-flex items-center gap-1 text-xs rounded-full px-2 py-1 border ${getStatusColor(player.status)}`}>
                                        {getStatusIcon(player.status)} {player.status}
                                    </span>
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => navigate(`/team/players/${index}`)}
                                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full"
                                            title="Profil ansehen"
                                        >
                                            <FaInfo size={14} />
                                        </button>
                                        <button
                                            onClick={() => editPlayer(index)}
                                            className="p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-full"
                                            title="Bearbeiten"
                                        >
                                            <FaPen size={14} />
                                        </button>
                                        <button
                                            onClick={() => confirmDeletePlayer(index)}
                                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full"
                                            title="Löschen"
                                        >
                                            <FaTrashAlt size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredPlayers.length === 0 && (
                    <div className="bg-white rounded-xl p-10 flex flex-col items-center justify-center shadow-sm mt-6">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <FaSearch className="text-gray-400" size={24} />
                        </div>
                        <h3 className="text-xl font-medium text-gray-700">Keine Spieler gefunden</h3>
                        <p className="text-gray-500 text-center mt-2">
                            Versuchen Sie Ihre Suche anzupassen oder fügen Sie neue Spieler hinzu.
                        </p>
                    </div>
                )}

                {/* Modal for Adding/Editing Player */}
                <Modal
                    isOpen={isModalOpen}
                    onRequestClose={() => {
                        setIsModalOpen(false);
                        setIsEditing(false);
                    }}
                    style={{
                        overlay: { 
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        },
                        content: {
                            position: 'relative',
                            width: '95%',
                            maxWidth: '550px',
                            height: 'auto',
                            maxHeight: '90vh',
                            margin: '0 auto',
                            borderRadius: '12px',
                            padding: '0',
                            border: 'none',
                            overflow: 'auto',
                            inset: 'auto'
                        },
                    }}
                    contentLabel={isEditing ? "Spieler bearbeiten" : "Neuen Spieler hinzufügen"}
                >
                    <div className="bg-gray-50 p-6 border-b border-gray-200 sticky top-0 z-10">
                        <h2 className="text-2xl font-semibold text-gray-800">{isEditing ? "Spieler bearbeiten" : "Neuen Spieler hinzufügen"}</h2>
                    </div>
                    <div className="p-6">
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
                    </div>
                    <div className="bg-gray-50 p-6 border-t border-gray-200 flex justify-end gap-2">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            Abbrechen
                        </button>
                        <button
                            onClick={addPlayer}
                            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            {isEditing ? "Aktualisieren" : "Hinzufügen"}
                        </button>
                    </div>
                </Modal>
            </div>
        </Layout>
    );
};

export default Players;
