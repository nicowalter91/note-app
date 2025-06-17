import axiosInstance from './axiosInstance';

const API_BASE_URL = '/api/statistics';

// Get team statistics
export const getStatistics = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    
    if (filters.period) {
      params.append('period', filters.period);
    }
    if (filters.year) {
      params.append('year', filters.year);
    }
    if (filters.month) {
      params.append('month', filters.month);
    }

    const response = await axiosInstance.get(`${API_BASE_URL}?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching statistics:', error);
    throw error;
  }
};

// Force recalculation of statistics
export const recalculateStatistics = async (period = 'season', year = null, month = null) => {
  try {
    const response = await axiosInstance.post(`${API_BASE_URL}/recalculate`, {
      period,
      year,
      month
    });
    return response.data;
  } catch (error) {
    console.error('Error recalculating statistics:', error);
    throw error;
  }
};
// Helper function to format statistics for charts
export const formatStatisticsForCharts = (statistics) => {
    if (!statistics) return null;

    const { matchStats, performanceData, playerStats } = statistics;

    // Format performance data for line charts
    const formattedPerformanceData = performanceData?.map(item => ({
      name: item.period.replace(/^\d{4}-/, '').replace(/^W/, 'Woche '),
      siege: item.matches.won,
      niederlagen: item.matches.lost,
      unentschieden: item.matches.drawn
    })) || [];

    // Format goal data for charts
    const formattedGoalData = performanceData?.map(item => ({
      name: item.period.replace(/^\d{4}-/, '').replace(/^W/, 'Woche '),
      tore: item.goals.scored,
      gegentore: item.goals.conceded
    })) || [];

    // Format position data for pie chart
    const formattedPositionData = playerStats?.positionDistribution ? [
      { name: 'Sturm', value: playerStats.positionDistribution.forward, color: '#3b82f6' },
      { name: 'Mittelfeld', value: playerStats.positionDistribution.midfielder, color: '#10b981' },
      { name: 'Verteidigung', value: playerStats.positionDistribution.defender, color: '#f59e0b' },
      { name: 'Torwart', value: playerStats.positionDistribution.goalkeeper, color: '#ef4444' }
    ].filter(item => item.value > 0) : [];

    // Format team stats for display
    const formattedTeamStats = matchStats ? [
      {
        label: 'Spiele gespielt',
        value: matchStats.played.toString(),
        trend: '+0', // Could be calculated from previous period
        icon: 'FaFutbol',
        color: 'blue'
      },
      {
        label: 'Siege',
        value: matchStats.won.toString(),
        trend: '+0',
        icon: 'FaTrophy',
        color: 'green'
      },
      {
        label: 'Tore geschossen',
        value: matchStats.goalsFor.toString(),
        trend: '+0',
        icon: 'FaBullseye',
        color: 'yellow'
      },
      {
        label: 'Tore kassiert',
        value: matchStats.goalsAgainst.toString(),
        trend: '+0',
        icon: 'FaBullseye',
        color: 'red'
      }
    ] : [];

    // Format top players
    const formattedTopPlayers = playerStats?.topScorers?.map((player, index) => ({
      name: player.name,
      position: 'Spieler', // You might want to get this from player data
      goals: player.goals,
      assists: playerStats.topAssisters?.[index]?.assists || 0,
      rating: (8.0 + Math.random() * 1.5).toFixed(1) // Mock rating
    })) || [];

    return {
      teamStats: formattedTeamStats,
      performanceData: formattedPerformanceData,
      goalData: formattedGoalData,
      positionData: formattedPositionData,
      topPlayers: formattedTopPlayers,
      matchStats,
      trainingStats: statistics.trainingStats,
      playerStats
    };};

// Helper function to calculate win percentage
export const calculateWinPercentage = (matchStats) => {
    if (!matchStats || matchStats.played === 0) return 0;
    return Math.round((matchStats.won / matchStats.played) * 100);};

// Helper function to calculate goals per game
export const calculateGoalsPerGame = (matchStats) => {
    if (!matchStats || matchStats.played === 0) return 0;
    return (matchStats.goalsFor / matchStats.played).toFixed(1);};

// Helper function to calculate clean sheet percentage
export const calculateCleanSheetPercentage = (matchStats) => {
    if (!matchStats || matchStats.played === 0) return 0;
    return Math.round((matchStats.cleanSheets / matchStats.played) * 100);};

// Helper function to get period display name
export const getPeriodDisplayName = (period, year, month) => {
    const currentYear = new Date().getFullYear();
    
    switch (period) {
      case 'month':
        const monthNames = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
                           'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
        return `${monthNames[month - 1]} ${year}`;
      case 'season':
        return `Saison ${year}/${year + 1}`;
      case 'year':
        return `Jahr ${year}`;
      case 'all':
        return 'Alle Zeit';
      default:
        return period;
    }};
