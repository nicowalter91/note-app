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
    totalPlayers = 0,
    availablePlayers = 0,
    injuredPlayers = 0,
    gamesWon = 0,
    averagePerformance = 0,
    performanceData = [],
    goalkeepers = 0,
    defenders = 0,
    midfielders = 0,
    forwards = 0,
    monthlyStats = {}
  } = statistics || {};

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
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Mannschaftsstruktur</h3>          <div className="space-y-4">
            {[
              { position: 'Torwart', count: goalkeepers, color: 'bg-green-600' },
              { position: 'Verteidigung', count: defenders, color: 'bg-blue-600' },
              { position: 'Mittelfeld', count: midfielders, color: 'bg-yellow-600' },
              { position: 'Sturm', count: forwards, color: 'bg-red-600' }
            ].map(({ position, count, color }) => (
              <div key={position} className="flex items-center">
                <span className="w-32 text-sm text-gray-600">{position}</span>
                <div className="flex-1 mx-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`${color} h-2 rounded-full transition-all duration-300`}
                      style={{
                        width: `${totalPlayers > 0 ? (count / totalPlayers) * 100 : 0}%`
                      }}
                    />
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-800 w-8 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamStatistics;
