import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import axiosInstance from '../../utils/axiosInstance';
import { FaUserPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import Toast from '../../components/ToastMessage/Toast';

const Team = () => {
  const [players, setPlayers] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    number: '',
    birthdate: '',
    height: '',
    weight: '',
    notes: '',
    statistics: {
      gamesPlayed: 0,
      goals: 0,
      assists: 0,
      yellowCards: 0,
      redCards: 0
    },
    performanceMetrics: {
      technicalSkills: 5,
      tacticalUnderstanding: 5,
      physicalFitness: 5,
      mentalStrength: 5,
      teamwork: 5
    },
    strengths: [],
    weaknesses: []
  });

  const navigate = useNavigate();

  useEffect(() => {
    getPlayers();
    getUserInfo();
  }, []);

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data?.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  const getPlayers = async () => {
    try {
      const response = await axiosInstance.get('/get-all-players');
      if (response.data?.players) {
        setPlayers(response.data.players);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Fehler beim Laden der Spieler' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPlayer) {
        const response = await axiosInstance.put(`/edit-player/${editingPlayer._id}`, formData);
        if (response.data) {
          setPlayers(players.map(player => 
            player._id === editingPlayer._id ? response.data.player : player
          ));
          setMessage({ type: 'success', text: 'Spieler erfolgreich aktualisiert' });
        }
      } else {
        const response = await axiosInstance.post('/add-player', formData);
        if (response.data) {
          setPlayers([...players, response.data.player]);
          setMessage({ type: 'success', text: 'Spieler erfolgreich hinzugefügt' });
        }
      }
      resetForm();
    } catch (error) {
      setMessage({ type: 'error', text: 'Fehler beim Speichern des Spielers' });
    }
  };

  const handleEditPlayer = (player) => {
    setEditingPlayer(player);
    setFormData({
      name: player.name,
      position: player.position,
      number: player.number || '',
      birthdate: player.birthdate ? player.birthdate.split('T')[0] : '',
      height: player.height || '',
      weight: player.weight || '',
      notes: player.notes || '',
      statistics: player.statistics || {
        gamesPlayed: 0,
        goals: 0,
        assists: 0,
        yellowCards: 0,
        redCards: 0
      },
      performanceMetrics: player.performanceMetrics || {
        technicalSkills: 5,
        tacticalUnderstanding: 5,
        physicalFitness: 5,
        mentalStrength: 5,
        teamwork: 5
      },
      strengths: player.strengths || [],
      weaknesses: player.weaknesses || []
    });
    setShowAddForm(true);
  };

  const handleDeletePlayer = async (playerId) => {
    if (window.confirm('Möchten Sie diesen Spieler wirklich löschen?')) {
      try {
        await axiosInstance.delete(`/delete-player/${playerId}`);
        setPlayers(players.filter(player => player._id !== playerId));
        setMessage({ type: 'success', text: 'Spieler erfolgreich gelöscht' });
      } catch (error) {
        setMessage({ type: 'error', text: 'Fehler beim Löschen des Spielers' });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      position: '',
      number: '',
      birthdate: '',
      height: '',
      weight: '',
      notes: '',
      statistics: {
        gamesPlayed: 0,
        goals: 0,
        assists: 0,
        yellowCards: 0,
        redCards: 0
      },
      performanceMetrics: {
        technicalSkills: 5,
        tacticalUnderstanding: 5,
        physicalFitness: 5,
        mentalStrength: 5,
        teamwork: 5
      },
      strengths: [],
      weaknesses: []
    });
    setShowAddForm(false);
    setEditingPlayer(null);
  };

  const viewPlayerProfile = (playerId) => {
    navigate(`/team/player/${playerId}`);
  };

  return (
    <Layout userInfo={userInfo}>
      {message.text && (
        <Toast type={message.type} message={message.text} onClose={() => setMessage({ type: '', text: '' })} />
      )}
      
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header mit Titel und Button */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Teamverwaltung</h1>
            <button
              onClick={() => {
                if (!showAddForm) {
                  setEditingPlayer(null);
                  resetForm();
                }
                setShowAddForm(!showAddForm);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <FaUserPlus />
              {showAddForm ? 'Abbrechen' : 'Spieler hinzufügen'}
            </button>
          </div>

          {/* Formular zum Hinzufügen/Bearbeiten eines Spielers */}
          {showAddForm && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {editingPlayer ? 'Spieler bearbeiten' : 'Neuen Spieler hinzufügen'}
              </h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Position</label>
                  <select
                    required
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Bitte wählen</option>
                    <option value="Torwart">Torwart</option>
                    <option value="Verteidiger">Verteidiger</option>
                    <option value="Mittelfeld">Mittelfeld</option>
                    <option value="Stürmer">Stürmer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Trikotnummer</label>
                  <input
                    type="number"
                    value={formData.number}
                    onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Geburtsdatum</label>
                  <input
                    type="date"
                    value={formData.birthdate}
                    onChange={(e) => setFormData({ ...formData, birthdate: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Größe (cm)</label>
                  <input
                    type="number"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Gewicht (kg)</label>
                  <input
                    type="number"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Notizen</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows="3"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                {/* Spielerstatistiken */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Spielerstatistiken</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Spiele</label>
                      <input
                        type="number"
                        value={formData.statistics.gamesPlayed}
                        onChange={(e) => setFormData({ ...formData, statistics: { ...formData.statistics, gamesPlayed: e.target.value } })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Tore</label>
                      <input
                        type="number"
                        value={formData.statistics.goals}
                        onChange={(e) => setFormData({ ...formData, statistics: { ...formData.statistics, goals: e.target.value } })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Assists</label>
                      <input
                        type="number"
                        value={formData.statistics.assists}
                        onChange={(e) => setFormData({ ...formData, statistics: { ...formData.statistics, assists: e.target.value } })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Gelbe Karten</label>
                      <input
                        type="number"
                        value={formData.statistics.yellowCards}
                        onChange={(e) => setFormData({ ...formData, statistics: { ...formData.statistics, yellowCards: e.target.value } })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Rote Karten</label>
                      <input
                        type="number"
                        value={formData.statistics.redCards}
                        onChange={(e) => setFormData({ ...formData, statistics: { ...formData.statistics, redCards: e.target.value } })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Leistungskennzahlen */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Leistungskennzahlen</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Technische Fähigkeiten</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={formData.performanceMetrics.technicalSkills}
                        onChange={(e) => setFormData({ ...formData, performanceMetrics: { ...formData.performanceMetrics, technicalSkills: e.target.value } })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Taktisches Verständnis</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={formData.performanceMetrics.tacticalUnderstanding}
                        onChange={(e) => setFormData({ ...formData, performanceMetrics: { ...formData.performanceMetrics, tacticalUnderstanding: e.target.value } })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Kondition</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={formData.performanceMetrics.physicalFitness}
                        onChange={(e) => setFormData({ ...formData, performanceMetrics: { ...formData.performanceMetrics, physicalFitness: e.target.value } })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Mentale Stärke</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={formData.performanceMetrics.mentalStrength}
                        onChange={(e) => setFormData({ ...formData, performanceMetrics: { ...formData.performanceMetrics, mentalStrength: e.target.value } })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Teamarbeit</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={formData.performanceMetrics.teamwork}
                        onChange={(e) => setFormData({ ...formData, performanceMetrics: { ...formData.performanceMetrics, teamwork: e.target.value } })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    {editingPlayer ? 'Aktualisieren' : 'Hinzufügen'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Spielerliste */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {players.map((player) => (              <div key={player._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                      {player.image ? (
                        <img src={player.image} alt={player.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-3xl text-gray-400">{player.name.charAt(0)}</div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{player.name}</h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-600">{player.position}</span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                          #{player.number || '-'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-500">Alter:</span>
                      <span className="text-sm text-gray-900">
                        {player.birthdate ? `${new Date().getFullYear() - new Date(player.birthdate).getFullYear()} Jahre` : '-'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-500">Größe:</span>
                      <span className="text-sm text-gray-900">{player.height ? `${player.height} cm` : '-'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-500">Gewicht:</span>
                      <span className="text-sm text-gray-900">{player.weight ? `${player.weight} kg` : '-'}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-500">Spiele:</span>
                      <span className="text-sm text-gray-900">{player.statistics?.gamesPlayed || 0}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-500">Tore:</span>
                      <span className="text-sm text-gray-900">{player.statistics?.goals || 0}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-500">Assists:</span>
                      <span className="text-sm text-gray-900">{player.statistics?.assists || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Performance</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(player.performanceMetrics || {}).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                        <div className="w-24 h-2 bg-gray-200 rounded-full">
                          <div 
                            className="h-full bg-blue-600 rounded-full" 
                            style={{ width: `${(value || 0) * 10}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Current Status */}
                <div className="mb-4 flex items-center space-x-2">
                  {player.injuries?.some(i => i.status !== 'Geheilt') ? (
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Verletzt</span>
                  ) : (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Verfügbar</span>
                  )}
                  {player.attendance?.length > 0 && player.attendance[player.attendance.length - 1].status === 'Anwesend' && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Zuletzt anwesend</span>
                  )}
                </div>

                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    onClick={() => viewPlayerProfile(player._id)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                    title="Profil anzeigen"
                  >
                    <FaEye />
                  </button>
                  <button
                    onClick={() => handleEditPlayer(player)}
                    className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-full transition-colors"
                    title="Spieler bearbeiten"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeletePlayer(player._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    title="Spieler löschen"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Team;
