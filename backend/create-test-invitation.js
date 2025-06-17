const mongoose = require('mongoose');
const TeamMember = require('./models/teamMember.model');
const crypto = require('crypto');

// Verbindung zur MongoDB
mongoose.connect('mongodb://localhost:27017/test', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function createTestInvitation() {
  try {
    const token = crypto.randomBytes(32).toString('hex');
    
    const testInvitation = new TeamMember({
      clubId: new mongoose.Types.ObjectId(), // Dummy club ID
      name: 'Test User',
      email: 'test@example.com',
      role: 'assistant',
      status: 'pending',
      inviteToken: token,
      inviteExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    });
    
    await testInvitation.save();
    
    console.log('Test invitation created!');
    console.log('Token:', token);
    console.log('Test URL: http://localhost:5173/join/' + token);
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating test invitation:', error);
    process.exit(1);
  }
}

createTestInvitation();
