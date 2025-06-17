const TrainerMood = require('../models/trainerMood.model');

// Get today's mood entry
const getTodaysMood = async (req, res) => {
  try {
    const { user } = req.user;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    let moodEntry = await TrainerMood.findOne({
      trainerId: user._id,
      date: {
        $gte: today,
        $lt: tomorrow
      }
    });
    
    // Create today's entry if it doesn't exist
    if (!moodEntry) {
      moodEntry = new TrainerMood({
        trainerId: user._id,
        date: today
      });
      await moodEntry.save();
    }
    
    res.status(200).json({
      success: true,
      moodEntry
    });
  } catch (error) {
    console.error('Fehler beim Abrufen der heutigen Stimmung:', error);
    res.status(500).json({
      success: false,
      message: 'Fehler beim Abrufen der heutigen Stimmung',
      error: error.message
    });
  }
};

// Update mood entry
const updateMoodEntry = async (req, res) => {
  try {
    const { user } = req.user;
    const { id } = req.params;
    const updateData = req.body;
    
    const moodEntry = await TrainerMood.findOneAndUpdate(
      { _id: id, trainerId: user._id },
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!moodEntry) {
      return res.status(404).json({
        success: false,
        message: 'Stimmungs-Eintrag nicht gefunden'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Stimmung erfolgreich aktualisiert',
      moodEntry
    });
  } catch (error) {
    console.error('Fehler beim Aktualisieren der Stimmung:', error);
    res.status(500).json({
      success: false,
      message: 'Fehler beim Aktualisieren der Stimmung',
      error: error.message
    });
  }
};

// Delete mood entry
const deleteMoodEntry = async (req, res) => {
  try {
    const { user } = req.user;
    const { id } = req.params;
    
    const moodEntry = await TrainerMood.findOneAndDelete({
      _id: id,
      trainerId: user._id
    });
    
    if (!moodEntry) {
      return res.status(404).json({
        success: false,
        message: 'Stimmungs-Eintrag nicht gefunden'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Stimmungs-Eintrag erfolgreich gelöscht'
    });
  } catch (error) {
    console.error('Fehler beim Löschen der Stimmung:', error);
    res.status(500).json({
      success: false,
      message: 'Fehler beim Löschen der Stimmung',
      error: error.message
    });
  }
};

// Get mood analytics
const getMoodAnalytics = async (req, res) => {
  try {
    const { user } = req.user;
    const { days = 30 } = req.query;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    
    const moodEntries = await TrainerMood.find({
      trainerId: user._id,
      date: { $gte: startDate }
    }).sort({ date: 1 });
    
    // Calculate analytics
    const analytics = {
      totalEntries: moodEntries.length,
      averageMood: 0,
      averageEnergy: 0,
      averageStress: 0,
      averageSatisfaction: 0,
      moodTrend: [],
      topTags: {},
      bestDays: [],
      challengingDays: []
    };
    
    if (moodEntries.length > 0) {
      let moodSum = 0, energySum = 0, stressSum = 0, satisfactionSum = 0;
      let moodCount = 0, energyCount = 0, stressCount = 0, satisfactionCount = 0;
      
      moodEntries.forEach(entry => {
        // Calculate averages
        if (entry.preTraining.mood) {
          moodSum += entry.preTraining.mood;
          moodCount++;
        }
        if (entry.postTraining.mood) {
          moodSum += entry.postTraining.mood;
          moodCount++;
        }
        if (entry.preTraining.energy) {
          energySum += entry.preTraining.energy;
          energyCount++;
        }
        if (entry.postTraining.energy) {
          energySum += entry.postTraining.energy;
          energyCount++;
        }
        if (entry.preTraining.stress) {
          stressSum += entry.preTraining.stress;
          stressCount++;
        }
        if (entry.postTraining.satisfaction) {
          satisfactionSum += entry.postTraining.satisfaction;
          satisfactionCount++;
        }
        
        // Count tags
        entry.tags.forEach(tag => {
          analytics.topTags[tag] = (analytics.topTags[tag] || 0) + 1;
        });
          // Mood trend
        const moodValues = [];
        if (entry.preTraining.mood) moodValues.push(entry.preTraining.mood);
        if (entry.postTraining.mood) moodValues.push(entry.postTraining.mood);
        const dailyMood = moodValues.length > 0 ? moodValues.reduce((a, b) => a + b) / moodValues.length : null;
        
        if (dailyMood) {
          analytics.moodTrend.push({
            date: entry.date,
            mood: dailyMood,
            energy: entry.preTraining.energy || entry.postTraining.energy,
            satisfaction: entry.postTraining.satisfaction
          });
        }
        
        // Best and challenging days
        if (dailyMood >= 8) {
          analytics.bestDays.push({
            date: entry.date,
            mood: dailyMood,
            wins: entry.wins
          });
        }
        if (dailyMood <= 4) {
          analytics.challengingDays.push({
            date: entry.date,
            mood: dailyMood,
            challenges: entry.challengesToday
          });
        }
      });
      
      analytics.averageMood = moodCount > 0 ? (moodSum / moodCount).toFixed(1) : 0;
      analytics.averageEnergy = energyCount > 0 ? (energySum / energyCount).toFixed(1) : 0;
      analytics.averageStress = stressCount > 0 ? (stressSum / stressCount).toFixed(1) : 0;
      analytics.averageSatisfaction = satisfactionCount > 0 ? (satisfactionSum / satisfactionCount).toFixed(1) : 0;
    }
    
    res.status(200).json({
      success: true,
      analytics
    });
  } catch (error) {
    console.error('Fehler beim Abrufen der Stimmungs-Analytik:', error);
    res.status(500).json({
      success: false,
      message: 'Fehler beim Abrufen der Stimmungs-Analytik',
      error: error.message
    });
  }
};

// Get recent mood entries
const getRecentMoodEntries = async (req, res) => {
  try {
    const { user } = req.user;
    const { limit = 10 } = req.query;
    
    const moodEntries = await TrainerMood.find({
      trainerId: user._id
    })
    .sort({ date: -1 })
    .limit(parseInt(limit));
    
    res.status(200).json({
      success: true,
      moodEntries
    });
  } catch (error) {
    console.error('Fehler beim Abrufen der letzten Stimmungs-Einträge:', error);
    res.status(500).json({
      success: false,
      message: 'Fehler beim Abrufen der letzten Stimmungs-Einträge',
      error: error.message
    });
  }
};

// Get specific mood entry by ID
const getMoodEntry = async (req, res) => {
  try {
    const { user } = req.user;
    const { id } = req.params;
    
    const moodEntry = await TrainerMood.findOne({
      _id: id,
      trainerId: user._id
    });
    
    if (!moodEntry) {
      return res.status(404).json({
        success: false,
        message: 'Stimmungs-Eintrag nicht gefunden'
      });
    }
    
    res.status(200).json({
      success: true,
      moodEntry
    });
  } catch (error) {
    console.error('Fehler beim Abrufen der Stimmung:', error);
    res.status(500).json({
      success: false,
      message: 'Fehler beim Abrufen der Stimmung',
      error: error.message
    });
  }
};

module.exports = {
  getTodaysMood,
  updateMoodEntry,
  deleteMoodEntry,
  getMoodAnalytics,
  getRecentMoodEntries,
  getMoodEntry
};
