import React from 'react';
import { FaUsers, FaRunning, FaBed, FaTrophy, FaChartLine } from 'react-icons/fa';
import PerformanceChart from './PerformanceChart';

const StatCard = ({ title, value, icon: Icon, change }) => (
  <div className="bg-white rounded-lg shadow-sm p-4">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
      </div>
      <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
        <Icon className="text-blue-500 text-xl" />
      </div>
    </div>
    {change !== undefined && (
      <div className={`mt-2 text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
        {change >= 0 ? '↑' : '↓'} {Math.abs(change)}% seit letztem Monat
      </div>
    )}
  </div>
);

const TeamStatistics = ({ statistics }) => {
  const {
    totalPlayers,
    availablePlayers,
    injuredPlayers,
    gamesWon,
    averagePerformance,
    performanceData,
    monthlyStats
  } = statistics;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Gesamte Spieler"
          value={totalPlayers}
          icon={FaUsers}
          change={monthlyStats?.playerChange}
        />
        <StatCard
          title="Verfügbare Spieler"
          value={availablePlayers}
          icon={FaRunning}
        />
        <StatCard
          title="Verletzte Spieler"
          value={injuredPlayers}
          icon={FaBed}
        />
        <StatCard
          title="Gewonnene Spiele"
          value={gamesWon}
          icon={FaTrophy}
          change={monthlyStats?.winRateChange}
        />
        <StatCard
          title="Ø Performance"
          value={`${averagePerformance}/10`}
          icon={FaChartLine}
          change={monthlyStats?.performanceChange}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team Performance Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Team Performance</h3>
          <PerformanceChart data={performanceData} />
        </div>

        {/* Team Composition */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Mannschaftsstruktur</h3>
          <div className="space-y-4">
            {[
              { position: 'Torwart', count: statistics.goalkeepers || 0 },
              { position: 'Verteidigung', count: statistics.defenders || 0 },
              { position: 'Mittelfeld', count: statistics.midfielders || 0 },
              { position: 'Sturm', count: statistics.forwards || 0 }
            ].map(({ position, count }) => (
              <div key={position} className="flex items-center">
                <span className="w-32 text-sm text-gray-600">{position}</span>
                <div className="flex-1 mx-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${(count / totalPlayers) * 100}%`
                      }}
                    />
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-800">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamStatistics;
