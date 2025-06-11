import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import PlayerList from '../components/PlayerList/PlayerList';
import TeamStatistics from '../components/Statistics/TeamStatistics';
import axiosInstance from '../../../utils/axiosInstance';

const TeamOverview = () => {
  const [players, setPlayers] = useState([]);
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
  });
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [playersRes, userRes] = await Promise.all([
        axiosInstance.get('/get-all-players'),
        axiosInstance.get('/get-user')
      ]);

      if (playersRes.data?.players) {
        setPlayers(playersRes.data.players);
        updateStatistics(playersRes.data.players);
      }

      if (userRes.data?.user) {
        setUserInfo(userRes.data.user);
      }
    } catch (error) {
      console.error('Fehler beim Laden der Daten:', error);
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
    // Implementierung folgt
  };

  const handleViewPlayer = (player) => {
    navigate(`/team/player/${player._id}`);
  };

  const handleEditPlayer = (player) => {
    // Implementierung folgt
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

          {/* Statistiken */}
          <TeamStatistics statistics={statistics} />

          {/* Spielerliste */}
          <PlayerList
            players={players}
            onAddPlayer={handleAddPlayer}
            onViewPlayer={handleViewPlayer}
            onEditPlayer={handleEditPlayer}
          />
        </div>
      </div>
    </Layout>
  );
};

export default TeamOverview;
