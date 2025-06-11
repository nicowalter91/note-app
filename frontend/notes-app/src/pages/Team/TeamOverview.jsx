import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import PlayerList from './components/PlayerList/PlayerList';
import TeamStatistics from './components/Statistics/TeamStatistics';
import Toast from '../../components/ToastMessage/Toast';
import axiosInstance from '../../utils/axiosInstance';

const TeamOverview = () => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statistics, setStatistics] = useState({
    totalPlayers: 0,
    availablePlayers: 0,
    injuredPlayers: 0,
    gamesWon: 0,
    averagePerformance: 0,
    goalkeepers: 0,
    defenders: 0,
    midfielders: 0,
    forwards: 0,
    performanceData: []
  });  const [userInfo, setUserInfo] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchData();
  }, []);const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching team data...');
      
      const [playersRes, userRes] = await Promise.all([
        axiosInstance.get('/get-all-players'),
        axiosInstance.get('/get-user')
      ]);

      console.log('Players response:', playersRes);
      console.log('User response:', userRes);

      if (playersRes.data?.players) {
        setPlayers(playersRes.data.players);
        updateStatistics(playersRes.data.players);
      } else {
        console.warn('Keine Spielerdaten erhalten');
        setPlayers([]);
        updateStatistics([]);
      }

      if (userRes.data?.user) {
        setUserInfo(userRes.data.user);
      }
    } catch (error) {
      console.error('Fehler beim Laden der Daten:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      
      setError('Fehler beim Laden der Team-Daten');
      
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const updateStatistics = (playerList) => {
    const stats = {
      totalPlayers: playerList.length,
      availablePlayers: playerList.filter(p => !p.injuries?.some(i => i.status !== 'Geheilt')).length,
      injuredPlayers: playerList.filter(p => p.injuries?.some(i => i.status === 'Akut')).length,
      gamesWon: 0, // Diese Daten müssen noch vom Backend kommen
      averagePerformance: calculateAveragePerformance(playerList),
      goalkeepers: playerList.filter(p => p.position === 'Torwart').length,
      defenders: playerList.filter(p => p.position === 'Verteidigung').length,
      midfielders: playerList.filter(p => p.position === 'Mittelfeld').length,
      forwards: playerList.filter(p => p.position === 'Sturm').length,
      performanceData: generatePerformanceData(playerList)
    };

    setStatistics(stats);
  };

  const calculateAveragePerformance = (playerList) => {
    const validPlayers = playerList.filter(p => p.performanceMetrics?.technicalSkills);
    if (validPlayers.length === 0) return 0;

    const sum = validPlayers.reduce((acc, player) => {
      const metrics = player.performanceMetrics;
      return acc + (
        (metrics.technicalSkills +
        metrics.tacticalUnderstanding +
        metrics.physicalFitness +
        metrics.mentalStrength +
        metrics.teamwork) / 5
      );
    }, 0);

    return (sum / validPlayers.length).toFixed(1);
  };

  const generatePerformanceData = (playerList) => {
    // Hier würden normalerweise die Performance-Daten über Zeit kommen
    // Für das Beispiel generieren wir Dummy-Daten
    return [
      { date: '01.06', technicalSkills: 7.2, physicalFitness: 6.8, teamwork: 7.5 },
      { date: '02.06', technicalSkills: 7.4, physicalFitness: 7.0, teamwork: 7.6 },
      { date: '03.06', technicalSkills: 7.3, physicalFitness: 7.2, teamwork: 7.8 },
      { date: '04.06', technicalSkills: 7.5, physicalFitness: 7.3, teamwork: 7.7 },
      { date: '05.06', technicalSkills: 7.6, physicalFitness: 7.4, teamwork: 7.9 }
    ];
  };

  const handleAddPlayer = () => {
    navigate('/team/add');
  };

  const handleViewPlayer = (player) => {
    navigate(`/team/player/${player._id}`);
  };
  const handleEditPlayer = (player) => {
    navigate(`/team/edit/${player._id}`);
  };
  const handleDeletePlayer = async (player) => {
    try {
      await axiosInstance.delete(`/delete-player/${player._id}`);
      
      // Entferne den Spieler aus der lokalen Liste
      const updatedPlayers = players.filter(p => p._id !== player._id);
      setPlayers(updatedPlayers);
      updateStatistics(updatedPlayers);
      
      // Zeige Erfolgs-Toast
      setToastMessage({ 
        type: 'success', 
        text: `${player.name} wurde erfolgreich aus dem Team entfernt` 
      });
      setShowToast(true);
    } catch (error) {
      console.error('Fehler beim Löschen des Spielers:', error);
      setToastMessage({ 
        type: 'error', 
        text: 'Fehler beim Löschen des Spielers' 
      });
      setShowToast(true);
    }
  };

  const handleCloseToast = () => {
    setShowToast(false);
  };
  return (
    <Layout userInfo={userInfo}>
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Überschrift */}
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Teamübersicht</h1>
            <p className="text-gray-600 mt-2">
              Verwalten Sie Ihre Mannschaft und behalten Sie den Überblick über alle Spieler
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Lade Team-Daten...</span>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Fehler</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                  <div className="mt-3">
                    <button
                      onClick={fetchData}
                      className="bg-red-100 hover:bg-red-200 text-red-800 text-sm font-medium py-1 px-3 rounded"
                    >
                      Erneut versuchen
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Content */}
          {!loading && !error && (
            <>
              {/* Statistiken */}
              <TeamStatistics statistics={statistics} />              {/* Spielerliste */}
              <PlayerList
                players={players}
                onAddPlayer={handleAddPlayer}
                onViewPlayer={handleViewPlayer}
                onEditPlayer={handleEditPlayer}
                onDeletePlayer={handleDeletePlayer}
              />
            </>
          )}        </div>
      </div>

      {/* Toast Nachricht */}
      <Toast
        isShown={showToast}
        message={toastMessage.text}
        type={toastMessage.type}
        onClose={handleCloseToast}
      />
    </Layout>
  );
};

export default TeamOverview;
