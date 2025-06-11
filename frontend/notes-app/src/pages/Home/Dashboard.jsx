import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import axiosInstance from '../../utils/axiosInstance';
import { FaUser, FaCalendarAlt, FaFutbol, FaRunning, FaStickyNote, FaTasks } from 'react-icons/fa';
import { format, isFuture, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';

const Dashboard = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [nextEvent, setNextEvent] = useState(null);
  const [clubInfo, setClubInfo] = useState(null);
  const [statistics, setStatistics] = useState({
    totalPlayers: 0,
    upcomingGames: 0,
    trainingSessions: 0,
    totalNotes: 0,
    openTasks: 0,
    nextTrainingDate: null,
    nextGameDate: null
  });

  const navigate = useNavigate();

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
        await Promise.all([
          getStatistics(),
          getNextEvent(),
          getClubInfo()
        ]);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  const getStatistics = async () => {
    try {
      // Parallele API-Aufrufe für alle Daten
      const [
        playersResponse, 
        gamesResponse, 
        exercisesResponse, 
        notesResponse, 
        tasksResponse,
        eventsResponse
      ] = await Promise.all([
        axiosInstance.get("/get-all-players"),
        axiosInstance.get("/get-all-games"),
        axiosInstance.get("/get-all-exercises"),
        axiosInstance.get("/get-all-notes"),
        axiosInstance.get("/get-all-tasks"),
        axiosInstance.get("/get-all-events")
      ]);

      // Verarbeitung der Spiele
      const upcomingGames = gamesResponse.data?.filter(game => 
        isFuture(parseISO(game.date))
      ) || [];

      // Verarbeitung der Aufgaben
      const openTasks = tasksResponse.data?.filter(task => 
        !task.completed
      ) || [];

      // Nächstes Trainingsdatum finden
      const nextTraining = exercisesResponse.data?.exercise
        ?.filter(ex => isFuture(parseISO(ex.date)))
        ?.sort((a, b) => parseISO(a.date) - parseISO(b.date))[0];

      // Nächstes Spiel finden
      const nextGame = upcomingGames
        .sort((a, b) => parseISO(a.date) - parseISO(b.date))[0];

      setStatistics({
        totalPlayers: playersResponse.data?.length || 0,
        upcomingGames: upcomingGames.length,
        trainingSessions: exercisesResponse.data?.exercise?.length || 0,
        totalNotes: notesResponse.data?.notes?.length || 0,
        openTasks: openTasks.length,
        nextTrainingDate: nextTraining?.date || null,
        nextGameDate: nextGame?.date || null
      });

      // Setze das nächste Event basierend auf allen verfügbaren Events
      const allEvents = [
        ...(upcomingGames.map(game => ({
          type: 'Spiel',
          description: game.opponent ? `Gegen ${game.opponent}` : 'Spieltag',
          date: game.date
        }))) || [],
        ...(exercisesResponse.data?.exercise?.map(ex => ({
          type: 'Training',
          description: ex.title,
          date: ex.date
        })) || []),
        ...(eventsResponse.data?.map(event => ({
          type: event.type,
          description: event.description,
          date: event.date
        })) || [])
      ];

      const nextEvent = allEvents
        .filter(event => isFuture(parseISO(event.date)))
        .sort((a, b) => parseISO(a.date) - parseISO(b.date))[0];

      setNextEvent(nextEvent);

    } catch (error) {
      console.error("Fehler beim Laden der Statistiken:", error);
    }
  };

  const getClubInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-club-settings");
      if (response.data) {
        setClubInfo(response.data);
      }
    } catch (error) {
      console.error("Fehler beim Laden der Club-Informationen:", error);
    }
  };

  const getFirstName = (fullName) => {
    if (!fullName) return '';
    return fullName.split(' ')[0];
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Formatiere ein Datum für die Anzeige
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return format(parseISO(dateString), "EEEE, d. MMMM yyyy 'um' HH:mm 'Uhr'", { locale: de });
  };

  return (
    <Layout userInfo={userInfo} onLogout={handleLogout}>
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Header Section mit Begrüßung */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg p-8 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">
                  Willkommen zurück, {userInfo ? getFirstName(userInfo.fullName) : ''}
                </h1>
                <p className="mt-2 text-blue-100">
                  {format(new Date(), "EEEE, d. MMMM yyyy", { locale: de })}
                </p>
              </div>
              {clubInfo?.logo && (
                <img 
                  src={clubInfo.logo} 
                  alt="Club Logo" 
                  className="h-16 w-16 object-contain bg-white rounded-lg p-2"
                />
              )}
            </div>
          </div>

          {/* Statistik-Karten */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-4">
                <FaUser className="text-blue-500 text-2xl" />
                <div>
                  <p className="text-sm text-gray-500">Spieler</p>
                  <h3 className="text-xl font-bold text-gray-800">{statistics.totalPlayers}</h3>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-4">
                <FaFutbol className="text-blue-500 text-2xl" />
                <div>
                  <p className="text-sm text-gray-500">Anstehende Spiele</p>
                  <h3 className="text-xl font-bold text-gray-800">{statistics.upcomingGames}</h3>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-4">
                <FaRunning className="text-blue-500 text-2xl" />
                <div>
                  <p className="text-sm text-gray-500">Trainingseinheiten</p>
                  <h3 className="text-xl font-bold text-gray-800">{statistics.trainingSessions}</h3>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-4">
                <FaStickyNote className="text-blue-500 text-2xl" />
                <div>
                  <p className="text-sm text-gray-500">Notizen</p>
                  <h3 className="text-xl font-bold text-gray-800">{statistics.totalNotes}</h3>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-4">
                <FaTasks className="text-blue-500 text-2xl" />
                <div>
                  <p className="text-sm text-gray-500">Offene Aufgaben</p>
                  <h3 className="text-xl font-bold text-gray-800">{statistics.openTasks}</h3>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-4">
                <FaCalendarAlt className="text-blue-500 text-2xl" />
                <div>
                  <p className="text-sm text-gray-500">Nächstes Event</p>
                  <h3 className="text-xl font-bold text-gray-800">{nextEvent ? '1' : '0'}</h3>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Nächstes Event Card */}
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Nächstes Event</h2>
              {nextEvent ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-lg font-medium text-gray-800">{nextEvent.type}</p>
                      <p className="text-gray-600">{nextEvent.description}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        {formatDate(nextEvent.date)}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600">Keine anstehenden Events</p>
              )}
            </div>

            {/* Aktuelle Aufgaben Card */}
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Aktuelle Aufgaben</h2>
                <button 
                  onClick={() => navigate('/tasks')}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline"
                >
                  Alle anzeigen
                </button>
              </div>
              <div className="space-y-3">
                {statistics.openTasks > 0 ? (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-blue-600">
                      Sie haben {statistics.openTasks} offene {statistics.openTasks === 1 ? 'Aufgabe' : 'Aufgaben'}
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-600">Keine offenen Aufgaben</p>
                )}
              </div>
            </div>
          </div>

          {/* Übersichtskarten */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Spiele */}
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Spiele</h2>
                <button 
                  onClick={() => navigate('/games')}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline"
                >
                  Alle anzeigen
                </button>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-800">Nächstes Spiel</p>
                {statistics.nextGameDate ? (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">{formatDate(statistics.nextGameDate)}</p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-600 mt-1">Keine anstehenden Spiele</p>
                )}
              </div>
            </div>

            {/* Training */}
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Training</h2>
                <button 
                  onClick={() => navigate('/exercises')}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline"
                >
                  Alle anzeigen
                </button>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-800">Nächste Trainingseinheit</p>
                {statistics.nextTrainingDate ? (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">{formatDate(statistics.nextTrainingDate)}</p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-600 mt-1">Keine Trainingseinheiten geplant</p>
                )}
              </div>
            </div>

            {/* Notizen */}
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Notizen</h2>
                <button 
                  onClick={() => navigate('/notes')}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline"
                >
                  Alle anzeigen
                </button>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-800">Gespeicherte Notizen</p>
                <p className="text-sm text-gray-600 mt-1">
                  {statistics.totalNotes} {statistics.totalNotes === 1 ? 'Notiz' : 'Notizen'} verfügbar
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;