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

const Statistics = () => {
  const [loading, setLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('season');
  const [selectedView, setSelectedView] = useState('team');

  // Mock-Daten für Statistiken
  const teamStats = [
    {
      label: 'Spiele gespielt',
      value: '15',
      trend: '+3',
      icon: FaFutbol,
      color: 'blue'
    },
    {
      label: 'Siege',
      value: '10',
      trend: '+2',
      icon: FaTrophy,
      color: 'green'
    },    {
      label: 'Tore geschossen',
      value: '28',
      trend: '+5',
      icon: FaBullseye,
      color: 'yellow'
    },
    {
      label: 'Tore kassiert',
      value: '12',
      trend: '-2',
      icon: FaBullseye,
      color: 'red'
    }
  ];

  // Mock-Daten für Charts
  const performanceData = [
    { name: 'Sep', siege: 3, niederlagen: 1, unentschieden: 0 },
    { name: 'Okt', siege: 4, niederlagen: 1, unentschieden: 1 },
    { name: 'Nov', siege: 3, niederlagen: 2, unentschieden: 1 },
    { name: 'Dez', siege: 2, niederlagen: 1, unentschieden: 1 }
  ];

  const goalData = [
    { name: 'Woche 1', tore: 3, gegentore: 1 },
    { name: 'Woche 2', tore: 2, gegentore: 2 },
    { name: 'Woche 3', tore: 4, gegentore: 0 },
    { name: 'Woche 4', tore: 1, gegentore: 3 },
    { name: 'Woche 5', tore: 3, gegentore: 1 },
    { name: 'Woche 6', tore: 2, gegentore: 1 }
  ];

  const positionData = [
    { name: 'Sturm', value: 35, color: '#3b82f6' },
    { name: 'Mittelfeld', value: 30, color: '#10b981' },
    { name: 'Verteidigung', value: 25, color: '#f59e0b' },
    { name: 'Torwart', value: 10, color: '#ef4444' }
  ];

  const topPlayers = [
    { name: 'Max Müller', position: 'Sturm', goals: 8, assists: 3, rating: 8.5 },
    { name: 'Tom Schmidt', position: 'Mittelfeld', goals: 4, assists: 7, rating: 8.2 },
    { name: 'Jan Weber', position: 'Verteidigung', goals: 2, assists: 2, rating: 7.9 },
    { name: 'Paul Fischer', position: 'Torwart', goals: 0, assists: 1, rating: 7.8 },
    { name: 'Lars Klein', position: 'Mittelfeld', goals: 3, assists: 4, rating: 7.6 }
  ];

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
              </Button>
              <Button 
                variant="secondary" 
                icon={FaDownload}
              >
                Export
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
        </Card>

        {/* Team-Statistiken Übersicht */}
        <StatsGrid stats={teamStats} />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
          {/* Leistungsverlauf */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FaChartBar className="text-blue-500" />
              Leistungsverlauf
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={performanceData}>
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
              <LineChart data={goalData}>
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
                    {topPlayers.map((player, index) => (
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
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={positionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {positionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {positionData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm text-gray-700">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium">{item.value}%</span>
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
