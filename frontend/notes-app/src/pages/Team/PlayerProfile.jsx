import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import axiosInstance from '../../utils/axiosInstance';
import { FaEdit, FaSave, FaTimes, FaCalendarCheck, FaChartLine, FaPlusCircle } from 'react-icons/fa';
import Toast from '../../components/ToastMessage/Toast';

const PlayerProfile = () => {
  const { playerId } = useParams();
  const navigate = useNavigate();
  const [player, setPlayer] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
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

  useEffect(() => {
    getPlayerData();
    getUserInfo();
  }, [playerId]);

  const getPlayerData = async () => {
    try {
      const response = await axiosInstance.get(`/get-player/${playerId}`);
      if (response.data?.player) {
        setPlayer(response.data.player);
        setFormData({
          name: response.data.player.name || '',
          position: response.data.player.position || '',
          number: response.data.player.number || '',
          birthdate: response.data.player.birthdate ? response.data.player.birthdate.split('T')[0] : '',
          height: response.data.player.height || '',
          weight: response.data.player.weight || '',
          notes: response.data.player.notes || '',
          statistics: response.data.player.statistics || {
            gamesPlayed: 0,
            goals: 0,
            assists: 0,
            yellowCards: 0,
            redCards: 0
          },
          performanceMetrics: response.data.player.performanceMetrics || {
            technicalSkills: 5,
            tacticalUnderstanding: 5,
            physicalFitness: 5,
            mentalStrength: 5,
            teamwork: 5
          },
          strengths: response.data.player.strengths || [],
          weaknesses: response.data.player.weaknesses || []
        });
      }
    } catch (error) {
      console.error('Fehler beim Laden der Spielerdaten:', error);
    }
  };

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get('/user-info');
      setUserInfo(response.data);
    } catch (error) {
      console.error('Fehler beim Laden der Benutzerdaten:', error);
    }
  };

  const handleSave = async () => {
    try {
      const response = await axiosInstance.put(`/edit-player/${playerId}`, formData);
      if (response.data) {
        setPlayer(response.data.player);
        setEditing(false);
        setMessage({ type: 'success', text: 'Spielerdaten erfolgreich gespeichert' });
      }
    } catch (error) {
      console.error('Fehler beim Speichern der Spielerdaten:', error);
      setMessage({ type: 'error', text: 'Fehler beim Speichern der Spielerdaten' });
    }
  };

  const handleUpdateAttendance = async (status) => {
    try {
      await axiosInstance.put(`/update-attendance/${playerId}`, {
        date: new Date(),
        status,
        note: ''
      });
      setMessage({ type: 'success', text: 'Anwesenheit erfolgreich aktualisiert' });
      await getPlayerData();
    } catch (error) {
      setMessage({ type: 'error', text: 'Fehler beim Aktualisieren der Anwesenheit' });
    }
  };

  const handleAddDevelopmentGoal = async (goal) => {
    try {
      await axiosInstance.post(`/add-development-goal/${playerId}`, goal);
      setMessage({ type: 'success', text: 'Entwicklungsziel erfolgreich hinzugefügt' });
      await getPlayerData();
    } catch (error) {
      setMessage({ type: 'error', text: 'Fehler beim Hinzufügen des Entwicklungsziels' });
    }
  };

  const handleAddInjury = async (injury) => {
    try {
      await axiosInstance.post(`/add-injury/${playerId}`, injury);
      setMessage({ type: 'success', text: 'Verletzung erfolgreich hinzugefügt' });
      await getPlayerData();
    } catch (error) {
      setMessage({ type: 'error', text: 'Fehler beim Hinzufügen der Verletzung' });
    }
  };

  if (!player) {
    return (
      <Layout userInfo={userInfo}>
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <p>Laden...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout userInfo={userInfo}>
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => navigate('/team')}
              className="flex items-center text-gray-600 hover:text-gray-800"
            >
              <FaArrowLeft className="mr-2" /> Zurück zum Team
            </button>
            <button
              onClick={() => {
                if (editing) {
                  handleSave();
                } else {
                  setEditing(true);
                }
              }}
              className={`flex items-center px-4 py-2 rounded-lg ${
                editing ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
              } text-white`}
            >
              {editing ? (
                <>
                  <FaSave className="mr-2" /> Speichern
                </>
              ) : (
                <>
                  <FaEdit className="mr-2" /> Bearbeiten
                </>
              )}
            </button>
          </div>

          {/* Spieler Informationen */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Grundinformationen */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Grundinformationen</h2>
                {editing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Position</label>
                      <select
                        value={formData.position}
                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="">Position wählen</option>
                        <option value="Torwart">Torwart</option>
                        <option value="Abwehr">Abwehr</option>
                        <option value="Mittelfeld">Mittelfeld</option>
                        <option value="Sturm">Sturm</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Rückennummer</label>
                      <input
                        type="number"
                        value={formData.number}
                        onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Name:</span> {player.name}
                    </p>
                    <p>
                      <span className="font-medium">Position:</span> {player.position}
                    </p>
                    <p>
                      <span className="font-medium">Rückennummer:</span> {player.number || '-'}
                    </p>
                  </div>
                )}
              </div>

              {/* Persönliche Details */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Persönliche Details</h2>
                {editing ? (
                  <div className="space-y-4">
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
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Geburtsdatum:</span>{' '}
                      {player.birthdate ? new Date(player.birthdate).toLocaleDateString() : '-'}
                    </p>
                    <p>
                      <span className="font-medium">Größe:</span> {player.height ? `${player.height} cm` : '-'}
                    </p>
                    <p>
                      <span className="font-medium">Gewicht:</span> {player.weight ? `${player.weight} kg` : '-'}
                    </p>
                  </div>
                )}
              </div>

              {/* Stärken und Schwächen */}
              <div className="md:col-span-2">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Stärken und Schwächen</h2>
                {editing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Stärken</label>
                      <textarea
                        value={formData.strengths}
                        onChange={(e) => setFormData({ ...formData, strengths: e.target.value })}
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Schwächen</label>
                      <textarea
                        value={formData.weaknesses}
                        onChange={(e) => setFormData({ ...formData, weaknesses: e.target.value })}
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-2">Stärken</h3>
                      <p className="text-gray-600">{player.strengths || 'Keine Stärken eingetragen'}</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 mb-2">Schwächen</h3>
                      <p className="text-gray-600">{player.weaknesses || 'Keine Schwächen eingetragen'}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Notizen */}
              <div className="md:col-span-2">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Notizen</h2>
                {editing ? (
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-600">{player.notes || 'Keine Notizen vorhanden'}</p>
                )}
              </div>
            </div>
          </div>

          {/* Tabs for additional features */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex space-x-4 mb-4">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === 'overview'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Übersicht
              </button>
              <button
                onClick={() => setActiveTab('attendance')}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === 'attendance'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FaCalendarCheck className="mr-2" />
                Anwesenheit
              </button>
              <button
                onClick={() => setActiveTab('statistics')}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === 'statistics'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FaChartLine className="mr-2" />
                Statistiken
              </button>
            </div>

            {activeTab === 'overview' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Entwicklungsziele</h3>
                <div className="space-y-4">
                  {player.developmentGoals?.length > 0 ? (
                    player.developmentGoals.map((goal) => (
                      <div key={goal.id} className="p-4 bg-gray-50 rounded-lg shadow">
                        <p className="text-gray-800">{goal.description}</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-sm text-gray-500">
                            {new Date(goal.createdAt).toLocaleDateString()}
                          </span>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleAddDevelopmentGoal(goal)}
                              className="px-3 py-1 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-all"
                            >
                              Erledigt
                            </button>
                            <button
                              onClick={() => handleAddInjury(goal)}
                              className="px-3 py-1 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-all"
                            >
                              Verletzung
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">Keine Entwicklungsziele gefunden.</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'attendance' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Anwesenheit</h3>
                <div className="space-y-4">
                  {player.attendance?.length > 0 ? (
                    player.attendance.map((record) => (
                      <div key={record.id} className="p-4 bg-gray-50 rounded-lg shadow">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">
                            {new Date(record.date).toLocaleDateString()}
                          </span>
                          <span
                            className={`text-xs font-semibold rounded-full px-3 py-1 ${
                              record.status === 'present'
                                ? 'bg-green-100 text-green-800'
                                : record.status === 'absent'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {record.status === 'present' && 'Anwesend'}
                            {record.status === 'absent' && 'Abwesend'}
                            {record.status === 'late' && 'Verspätet'}
                          </span>
                        </div>
                        <div className="flex space-x-2 mt-2">
                          <button
                            onClick={() => handleUpdateAttendance('present')}
                            className="flex-1 px-3 py-1 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-all"
                          >
                            Anwesend
                          </button>
                          <button
                            onClick={() => handleUpdateAttendance('absent')}
                            className="flex-1 px-3 py-1 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-all"
                          >
                            Abwesend
                          </button>
                          <button
                            onClick={() => handleUpdateAttendance('late')}
                            className="flex-1 px-3 py-1 rounded-lg bg-yellow-600 text-white hover:bg-yellow-700 transition-all"
                          >
                            Verspätet
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">Keine Anwesenheitsdaten gefunden.</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'statistics' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Statistiken</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Spielerstatistiken */}
                  <div className="p-4 bg-gray-50 rounded-lg shadow">
                    <h4 className="font-semibold text-gray-800 mb-2">Spielerstatistiken</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-500">Spiele gespielt</span>
                        <p className="text-lg font-medium text-gray-800">{player.statistics.gamesPlayed}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Tore</span>
                        <p className="text-lg font-medium text-gray-800">{player.statistics.goals}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Vorlagen</span>
                        <p className="text-lg font-medium text-gray-800">{player.statistics.assists}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Gelbe Karten</span>
                        <p className="text-lg font-medium text-gray-800">{player.statistics.yellowCards}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Rote Karten</span>
                        <p className="text-lg font-medium text-gray-800">{player.statistics.redCards}</p>
                      </div>
                    </div>
                  </div>

                  {/* Leistungskennzahlen */}
                  <div className="p-4 bg-gray-50 rounded-lg shadow">
                    <h4 className="font-semibold text-gray-800 mb-2">Leistungskennzahlen</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-500">Technische Fähigkeiten</span>
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                            <div
                              className="bg-blue-600 h-2.5 rounded-full"
                              style={{ width: `${(player.performanceMetrics.technicalSkills / 10) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-500 ml-2">
                            {player.performanceMetrics.technicalSkills}/10
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Taktisches Verständnis</span>
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                            <div
                              className="bg-blue-600 h-2.5 rounded-full"
                              style={{ width: `${(player.performanceMetrics.tacticalUnderstanding / 10) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-500 ml-2">
                            {player.performanceMetrics.tacticalUnderstanding}/10
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Physische Fitness</span>
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                            <div
                              className="bg-blue-600 h-2.5 rounded-full"
                              style={{ width: `${(player.performanceMetrics.physicalFitness / 10) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-500 ml-2">
                            {player.performanceMetrics.physicalFitness}/10
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Mentale Stärke</span>
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                            <div
                              className="bg-blue-600 h-2.5 rounded-full"
                              style={{ width: `${(player.performanceMetrics.mentalStrength / 10) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-500 ml-2">
                            {player.performanceMetrics.mentalStrength}/10
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Teamarbeit</span>
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                            <div
                              className="bg-blue-600 h-2.5 rounded-full"
                              style={{ width: `${(player.performanceMetrics.teamwork / 10) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-500 ml-2">
                            {player.performanceMetrics.teamwork}/10
                          </span>
                        </div>
                      </div>
                    </div>
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

export default PlayerProfile;
