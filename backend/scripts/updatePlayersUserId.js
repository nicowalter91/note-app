const mongoose = require('mongoose');
const Player = require('../models/player.model');
const User = require('../models/user.model');

async function updatePlayersWithUserId() {
  try {
    await mongoose.connect('mongodb://testuser:testuser123@127.0.0.1:27017/test?authSource=admin');
    console.log('Connected to database');
    
    // Get test user
    const testUser = await User.findOne({ email: 'test@example.com' });
    if (!testUser) {
      console.log('Test user not found');
      return;
    }
    
    console.log('Test user ID:', testUser._id);
    
    // Update all players to belong to test user
    const result = await Player.updateMany(
      { userId: { $exists: false } },
      { $set: { userId: testUser._id } }
    );
    
    console.log('Updated players:', result.modifiedCount);
    
    // Show all players
    const players = await Player.find({});
    console.log('All players:');
    players.forEach(player => {
      console.log('- Player:', player.name, 'UserID:', player.userId);
    });
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

updatePlayersWithUserId();
