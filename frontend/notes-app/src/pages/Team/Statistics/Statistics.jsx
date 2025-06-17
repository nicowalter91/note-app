import React, { useState, useEffect } from 'react';
import Layout from '../../../components/Layout/Layout';
import { PageHeader, Card, Button, Badge, StatsGrid, LoadingSpinner } from '../../../components/UI/DesignSystem';
import { 
  FaChartBar, 
  FaUsers, 
  FaFutbol, 
  FaTrophy, 
  FaBullseye,
  FaCalendarAlt,
  FaArrowUp,
  FaArrowDown,
  FaFilter,
  FaDownload
} from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { getStatistics, recalculateStatistics } from '../../../utils/statisticsService';

const Statistics = () => {
  const [loading, setLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('season');
  const [selectedView, setSelectedView] = useState('team');
  const [statistics, setStatistics] = useState(null);
  const [formattedStats, setFormattedStats] = useState(null);

  useEffect(() => {
    fetchStatistics();
  }, [selectedPeriod]);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;
      
      const filters = {
        period: selectedPeriod,
        year: currentYear
      };
      
      if (selectedPeriod === 'month') {
        filters.month = currentMonth;
      }

      const response = await getStatistics(filters);
      if (response.error) {
        console.error('Error fetching statistics:', response.message);
        setStatistics(null);
        setFormattedStats(null);
      } else {
        setStatistics(response.statistics);
        // Format statistics for display
        const formatted = formatStatisticsForDisplay(response.statistics);
        setFormattedStats(formatted);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
      setStatistics(null);
      setFormattedStats(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRecalculateStats = async () => {
    try {
      setLoading(true);
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;
      
      await recalculateStatistics(selectedPeriod, currentYear, selectedPeriod === 'month' ? currentMonth : null);
      await fetchStatistics(); // Reload after recalculation
    } catch (error) {
      console.error('Error recalculating statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format statistics for display
  const formatStatisticsForDisplay = (stats) => {
    if (!stats) return null;

    const { matchStats, trainingStats, playerStats, performanceData } = stats;

    // Format team stats
    const teamStats = matchStats ? [
      {
        label: 'Spiele gespielt',
        value: matchStats.played.toString(),
        trend: '+0',
        icon: FaFutbol,
        color: 'blue'
      },
      {
        label: 'Siege',
        value: matchStats.won.toString(),
        trend: '+0',
        icon: FaTrophy,
        color: 'green'
      },
      {
        label: 'Tore geschossen',
        value: matchStats.goalsFor.toString(),
        trend: '+0',
        icon: FaBullseye,
        color: 'yellow'
      },
      {
        label: 'Tore kassiert',
        value: matchStats.goalsAgainst.toString(),
        trend: '+0',
        icon: FaBullseye,
        color: 'red'
      }
    ] : [];

    // Format performance data for charts
    const formattedPerformanceData = performanceData?.map(item => ({
      name: item.period.replace(/^\d{4}-/, '').replace(/^W/, 'Woche '),
      siege: item.matches.won,
      niederlagen: item.matches.lost,
      unentschieden: item.matches.drawn
    })) || [];

    // Format goal data for charts
    const goalData = performanceData?.map(item => ({
      name: item.period.replace(/^\d{4}-/, '').replace(/^W/, 'Woche '),
      tore: item.goals.scored,
      gegentore: item.goals.conceded
    })) || [];

    // Format position data for pie chart
    const positionData = playerStats?.positionDistribution ? [
      { name: 'Sturm', value: playerStats.positionDistribution.forward, color: '#3b82f6' },
      { name: 'Mittelfeld', value: playerStats.positionDistribution.midfielder, color: '#10b981' },
      { name: 'Verteidigung', value: playerStats.positionDistribution.defender, color: '#f59e0b' },
      { name: 'Torwart', value: playerStats.positionDistribution.goalkeeper, color: '#ef4444' }
    ].filter(item => item.value > 0) : [];

    // Format top players
    const topPlayers = playerStats?.topScorers?.map((player, index) => ({
      name: player.name,
      position: 'Spieler',
      goals: player.goals,
      assists: playerStats.topAssisters?.[index]?.assists || 0,
      rating: (8.0 + Math.random() * 1.5).toFixed(1)
    })) || [];

    return {
      teamStats,
      performanceData: formattedPerformanceData,
      goalData,
      positionData,
      topPlayers
    };
  };

  const periods = [
    { id: 'month', label: 'Letzter Monat' },
    { id: 'season', label: 'Aktuelle Saison' },
    { id: 'year', label: 'Letztes Jahr' },
    { id: 'all', label: 'Alle Zeit' }
  ];

  const views = [
    { id: 'team', label: 'Team' },
    { id: 'player', label: 'Spieler' },
    { id: 'matches', label: 'Spiele' }
  ];

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 p-6">
        <PageHeader
          title="Team-Statistiken"
          subtitle="Analysiere die Leistung deines Teams und einzelner Spieler"
          icon={FaChartBar}
          actions={
            <div className="flex gap-3">
              <Button 
                variant="secondary" 
                icon={FaFilter}
              >
                Filter
              </Button>              <Button 
                variant="secondary" 
                icon={FaDownload}
                onClick={handleRecalculateStats}
              >
                Neu berechnen
              </Button>
            </div>
          }
        />

        {/* Filter-Leiste */}
        <Card className="p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex gap-2">
              <span className="text-sm font-medium text-gray-700">Zeitraum:</span>
              {periods.map(period => (
                <Button
                  key={period.id}
                  variant={selectedPeriod === period.id ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedPeriod(period.id)}
                >
                  {period.label}
                </Button>
              ))}
            </div>
            <div className="flex gap-2">
              <span className="text-sm font-medium text-gray-700">Ansicht:</span>
              {views.map(view => (
                <Button
                  key={view.id}
                  variant={selectedView === view.id ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedView(view.id)}
                >
                  {view.label}
                </Button>
              ))}
            </div>
          </div>
        </Card>        {/* Team-Statistiken Übersicht */}
        <StatsGrid stats={formattedStats?.teamStats || []} />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
          {/* Leistungsverlauf */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FaChartBar className="text-blue-500" />
              Leistungsverlauf
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={formattedStats?.performanceData || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="siege" fill="#10b981" name="Siege" />
                <Bar dataKey="unentschieden" fill="#f59e0b" name="Unentschieden" />
                <Bar dataKey="niederlagen" fill="#ef4444" name="Niederlagen" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Tor-Statistiken */}
          <Card className="p-6">            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FaBullseye className="text-green-500" />
              Tor-Entwicklung
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={formattedStats?.goalData || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="tore" stroke="#10b981" strokeWidth={2} name="Tore" />
                <Line type="monotone" dataKey="gegentore" stroke="#ef4444" strokeWidth={2} name="Gegentore" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
          {/* Top-Spieler */}
          <div className="xl:col-span-2">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FaUsers className="text-purple-500" />
                Top-Spieler
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Spieler</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Position</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-700">Tore</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-700">Assists</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-700">Bewertung</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(formattedStats?.topPlayers || []).map((player, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                              {player.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <span className="font-medium text-gray-900">{player.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="secondary">{player.position}</Badge>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="font-medium">{player.goals}</span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="font-medium">{player.assists}</span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <span className="font-medium">{player.rating}</span>
                            {player.rating > 8.0 ? (
                              <FaArrowUp className="text-green-500 text-xs" />
                            ) : (
                              <FaArrowDown className="text-red-500 text-xs" />
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Positionen-Verteilung */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FaFutbol className="text-orange-500" />
              Tore nach Position
            </h3>            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={formattedStats?.positionData || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"                >
                  {(formattedStats?.positionData || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {(formattedStats?.positionData || []).map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm text-gray-700">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Weitere Statistiken */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <Card className="p-4 text-center">
            <FaCalendarAlt className="text-2xl text-blue-500 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900">Durchschnittliche Spielzeit</h4>
            <p className="text-2xl font-bold text-gray-900 mt-1">78 min</p>
            <p className="text-sm text-gray-500">pro Spieler</p>
          </Card>

          <Card className="p-4 text-center">
            <FaTrophy className="text-2xl text-yellow-500 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900">Siegesquote</h4>
            <p className="text-2xl font-bold text-gray-900 mt-1">66%</p>
            <p className="text-sm text-green-600 flex items-center justify-center gap-1">
              <FaArrowUp /> +8% zur Vorsaison
            </p>
          </Card>          <Card className="p-4 text-center">
            <FaBullseye className="text-2xl text-green-500 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900">Tore/Spiel</h4>
            <p className="text-2xl font-bold text-gray-900 mt-1">1.9</p>
            <p className="text-sm text-gray-500">Durchschnitt</p>
          </Card>

          <Card className="p-4 text-center">
            <FaUsers className="text-2xl text-purple-500 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900">Mannschaftsleistung</h4>
            <p className="text-2xl font-bold text-gray-900 mt-1">8.2</p>
            <p className="text-sm text-green-600 flex items-center justify-center gap-1">
              <FaArrowUp /> Sehr gut
            </p>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Statistics;
