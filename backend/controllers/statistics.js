const Statistics = require("../models/statistics.model");
const Event = require("../models/event.model");
const Player = require("../models/player.model");

// Get team statistics
const getStatistics = async (req, res) => {
  const { user } = req.user;
  const { period = 'season', year, month } = req.query;

  try {
    // First, try to get cached statistics
    let query = { createdBy: user._id, 'period.type': period };
    
    if (year) query['period.year'] = parseInt(year);
    if (month) query['period.month'] = parseInt(month);

    let statistics = await Statistics.findOne(query);

    // If no cached statistics or data is older than 1 hour, recalculate
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    
    if (!statistics || statistics.lastUpdated < oneHourAgo) {
      statistics = await calculateStatistics(user._id, period, year, month);
    }

    return res.json({
      error: false,
      statistics,
      message: "Statistiken erfolgreich abgerufen"
    });
  } catch (error) {
    console.error("Error getting statistics:", error);
    return res.status(500).json({
      error: true,
      message: "Interner Serverfehler"
    });
  }
};

// Calculate statistics from events and players
const calculateStatistics = async (userId, period = 'season', year, month) => {
  try {
    // Get current date info
    const now = new Date();
    const currentYear = year ? parseInt(year) : now.getFullYear();
    const currentMonth = month ? parseInt(month) : now.getMonth() + 1;

    // Build date query for events
    let dateQuery = { createdBy: userId };
    
    if (period === 'month') {
      const startDate = new Date(currentYear, currentMonth - 1, 1);
      const endDate = new Date(currentYear, currentMonth, 0);
      dateQuery.date = { $gte: startDate, $lte: endDate };
    } else if (period === 'year') {
      const startDate = new Date(currentYear, 0, 1);
      const endDate = new Date(currentYear, 11, 31);
      dateQuery.date = { $gte: startDate, $lte: endDate };
    } else if (period === 'season') {
      // Assume season runs from August to July
      const seasonStartYear = currentMonth >= 8 ? currentYear : currentYear - 1;
      const startDate = new Date(seasonStartYear, 7, 1); // August 1st
      const endDate = new Date(seasonStartYear + 1, 6, 31); // July 31st
      dateQuery.date = { $gte: startDate, $lte: endDate };
    }

    // Get events for the period
    const events = await Event.find(dateQuery);
    const players = await Player.find({ createdBy: userId });

    // Calculate match statistics
    const matchStats = calculateMatchStats(events);
    
    // Calculate training statistics
    const trainingStats = calculateTrainingStats(events);
    
    // Calculate player statistics
    const playerStats = calculatePlayerStats(players, events);
    
    // Calculate performance data (weekly/monthly trends)
    const performanceData = calculatePerformanceData(events, period);

    // Create or update statistics
    const statisticsData = {
      matchStats,
      trainingStats,
      playerStats,
      performanceData,
      period: {
        type: period,
        year: currentYear,
        month: period === 'month' ? currentMonth : undefined,
        season: period === 'season' ? `${currentYear}/${currentYear + 1}` : undefined
      },
      teamId: null, // You might want to implement team concept
      createdBy: userId,
      lastUpdated: new Date(),
      calculatedOn: new Date()
    };

    // Update or create statistics
    const query = { 
      createdBy: userId, 
      'period.type': period,
      'period.year': currentYear
    };
    
    if (period === 'month') {
      query['period.month'] = currentMonth;
    }

    const statistics = await Statistics.findOneAndUpdate(
      query,
      statisticsData,
      { upsert: true, new: true }
    );

    return statistics;
  } catch (error) {
    console.error("Error calculating statistics:", error);
    throw error;
  }
};

// Helper function to calculate match statistics
const calculateMatchStats = (events) => {
  const matches = events.filter(event => event.type === 'game');
  
  let stats = {
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    cleanSheets: 0,
    biggestWin: "",
    biggestLoss: ""
  };

  let biggestWinMargin = -1;
  let biggestLossMargin = -1;

  matches.forEach(match => {
    if (match.gameData?.result && 
        match.gameData.result.homeScore !== undefined && 
        match.gameData.result.awayScore !== undefined) {
      
      stats.played++;
      
      const isHome = match.gameData.isHome;
      const homeScore = match.gameData.result.homeScore;
      const awayScore = match.gameData.result.awayScore;
      
      const ourScore = isHome ? homeScore : awayScore;
      const opponentScore = isHome ? awayScore : homeScore;
      
      stats.goalsFor += ourScore;
      stats.goalsAgainst += opponentScore;
      
      if (opponentScore === 0) {
        stats.cleanSheets++;
      }
      
      if (ourScore > opponentScore) {
        stats.won++;
        const margin = ourScore - opponentScore;
        if (margin > biggestWinMargin) {
          biggestWinMargin = margin;
          stats.biggestWin = `${homeScore}:${awayScore} vs ${match.gameData.opponent}`;
        }
      } else if (ourScore < opponentScore) {
        stats.lost++;
        const margin = opponentScore - ourScore;
        if (margin > biggestLossMargin) {
          biggestLossMargin = margin;
          stats.biggestLoss = `${homeScore}:${awayScore} vs ${match.gameData.opponent}`;
        }
      } else {
        stats.drawn++;
      }
    }
  });

  return stats;
};

// Helper function to calculate training statistics
const calculateTrainingStats = (events) => {
  const trainings = events.filter(event => event.type === 'training');
  
  let stats = {
    sessionsPlanned: trainings.length,
    sessionsCompleted: trainings.filter(t => new Date(t.date) < new Date()).length,
    totalDuration: 0,
    averageAttendance: 0,
    focusAreasCount: {
      technique: 0,
      tactics: 0,
      fitness: 0,
      mentality: 0
    }
  };

  let totalAttendance = 0;
  let sessionsWithAttendance = 0;

  trainings.forEach(training => {
    stats.totalDuration += training.duration || 90;
    
    if (training.playerAttendance && training.playerAttendance.length > 0) {
      const presentPlayers = training.playerAttendance.filter(p => p.status === 'present').length;
      totalAttendance += presentPlayers;
      sessionsWithAttendance++;
    }
    
    if (training.trainingData?.focusAreas) {
      training.trainingData.focusAreas.forEach(area => {
        if (stats.focusAreasCount[area.toLowerCase()]) {
          stats.focusAreasCount[area.toLowerCase()]++;
        }
      });
    }
  });

  if (sessionsWithAttendance > 0) {
    stats.averageAttendance = Math.round(totalAttendance / sessionsWithAttendance);
  }

  return stats;
};

// Helper function to calculate player statistics
const calculatePlayerStats = (players, events) => {
  let stats = {
    totalPlayers: players.length,
    averageAge: 0,
    positionDistribution: {
      goalkeeper: 0,
      defender: 0,
      midfielder: 0,
      forward: 0
    },
    topScorers: [],
    topAssisters: [],
    mostAppearances: []
  };

  // Calculate average age and position distribution
  let totalAge = 0;
  players.forEach(player => {
    if (player.dateOfBirth) {
      const age = new Date().getFullYear() - new Date(player.dateOfBirth).getFullYear();
      totalAge += age;
    }
    
    const position = player.position?.toLowerCase() || 'midfielder';
    if (position.includes('goalkeeper') || position.includes('gk')) {
      stats.positionDistribution.goalkeeper++;
    } else if (position.includes('defender') || position.includes('defence') || position.includes('cb') || position.includes('lb') || position.includes('rb')) {
      stats.positionDistribution.defender++;
    } else if (position.includes('midfielder') || position.includes('midfield') || position.includes('cm') || position.includes('dm') || position.includes('am')) {
      stats.positionDistribution.midfielder++;
    } else {
      stats.positionDistribution.forward++;
    }
  });

  if (players.length > 0) {
    stats.averageAge = Math.round(totalAge / players.length);
  }

  // For top scorers, assisters, and appearances, you would need more detailed match data
  // This is a simplified version
  stats.topScorers = players.slice(0, 5).map(player => ({
    playerId: player._id,
    name: player.name,
    goals: Math.floor(Math.random() * 10) // Mock data - replace with real data
  }));

  return stats;
};

// Helper function to calculate performance data trends
const calculatePerformanceData = (events, period) => {
  const matches = events.filter(event => event.type === 'game' && event.gameData?.result);
  const performanceMap = new Map();

  matches.forEach(match => {
    const date = new Date(match.date);
    let periodKey;
    
    if (period === 'season' || period === 'year') {
      // Group by month
      periodKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    } else {
      // Group by week
      const week = Math.ceil(date.getDate() / 7);
      periodKey = `${date.getFullYear()}-W${week}`;
    }

    if (!performanceMap.has(periodKey)) {
      performanceMap.set(periodKey, {
        period: periodKey,
        matches: { won: 0, drawn: 0, lost: 0 },
        goals: { scored: 0, conceded: 0 }
      });
    }

    const data = performanceMap.get(periodKey);
    const isHome = match.gameData.isHome;
    const homeScore = match.gameData.result.homeScore;
    const awayScore = match.gameData.result.awayScore;
    const ourScore = isHome ? homeScore : awayScore;
    const opponentScore = isHome ? awayScore : homeScore;

    data.goals.scored += ourScore;
    data.goals.conceded += opponentScore;

    if (ourScore > opponentScore) {
      data.matches.won++;
    } else if (ourScore < opponentScore) {
      data.matches.lost++;
    } else {
      data.matches.drawn++;
    }
  });

  return Array.from(performanceMap.values()).sort((a, b) => a.period.localeCompare(b.period));
};

// Force recalculation of statistics
const recalculateStatistics = async (req, res) => {
  const { user } = req.user;
  const { period = 'season', year, month } = req.body;

  try {
    const statistics = await calculateStatistics(user._id, period, year, month);
    
    return res.json({
      error: false,
      statistics,
      message: "Statistiken erfolgreich neu berechnet"
    });
  } catch (error) {
    console.error("Error recalculating statistics:", error);
    return res.status(500).json({
      error: true,
      message: "Interner Serverfehler"
    });
  }
};

module.exports = {
  getStatistics,
  recalculateStatistics
};
