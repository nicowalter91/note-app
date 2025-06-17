const TeamMember = require('../models/teamMember.model');
const User = require('../models/user.model');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Get all team members for a club
const getTeamMembers = async (req, res) => {
  try {
    const { user } = req.user;
    
    const teamMembers = await TeamMember.find({ clubId: user._id })
      .populate('userId', 'fullName email')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      teamMembers
    });
  } catch (error) {
    console.error('Fehler beim Abrufen der Team-Mitglieder:', error);
    res.status(500).json({
      success: false,
      message: 'Fehler beim Abrufen der Team-Mitglieder',
      error: error.message
    });
  }
};

// Invite a new team member
const inviteTeamMember = async (req, res) => {
  try {
    const { user } = req.user;
    const { email, role, name } = req.body;
    
    if (!email || !role) {
      return res.status(400).json({
        success: false,
        message: 'E-Mail und Rolle sind erforderlich'
      });
    }
    
    // Prüfen ob bereits ein Team-Mitglied mit dieser E-Mail existiert
    const existingMember = await TeamMember.findOne({ 
      clubId: user._id, 
      email: email.toLowerCase() 
    });
    
    if (existingMember) {
      return res.status(400).json({
        success: false,
        message: 'Diese E-Mail-Adresse wurde bereits eingeladen'
      });
    }
    
    // Prüfen ob der User bereits registriert ist
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    
    // Generate invite token
    const inviteToken = crypto.randomBytes(32).toString('hex');
    
    // Create team member invitation
    const teamMember = new TeamMember({
      clubId: user._id,
      userId: existingUser ? existingUser._id : null,
      name: name || email.split('@')[0],
      email: email.toLowerCase(),
      role,
      status: 'pending',
      inviteToken,
      inviteExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    });
    
    await teamMember.save();
      // Send invitation email
    await sendInvitationEmail(email, inviteToken, user.fullName, role);
    
    await teamMember.populate('userId', 'fullName email');
    
    res.status(201).json({
      success: true,
      message: 'Einladung erfolgreich versendet',
      teamMember
    });
  } catch (error) {
    console.error('Fehler beim Einladen des Team-Mitglieds:', error);
    res.status(500).json({
      success: false,
      message: 'Fehler beim Einladen des Team-Mitglieds',
      error: error.message
    });
  }
};

// Accept team invitation
const acceptInvitation = async (req, res) => {
  try {
    const { token } = req.params;
    const { user } = req.user;
    
    const teamMember = await TeamMember.findOne({
      inviteToken: token,
      inviteExpiresAt: { $gt: new Date() }
    });
    
    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Einladung nicht gefunden oder abgelaufen'
      });
    }
    
    // Update team member
    teamMember.userId = user._id;
    teamMember.status = 'active';
    teamMember.joinedAt = new Date();
    teamMember.inviteToken = undefined;
    teamMember.inviteExpiresAt = undefined;
    
    await teamMember.save();
    
    res.status(200).json({
      success: true,
      message: 'Einladung erfolgreich angenommen',
      teamMember
    });
  } catch (error) {
    console.error('Fehler beim Annehmen der Einladung:', error);
    res.status(500).json({
      success: false,
      message: 'Fehler beim Annehmen der Einladung',
      error: error.message
    });
  }
};

// Update team member
const updateTeamMember = async (req, res) => {
  try {
    const { user } = req.user;
    const { id } = req.params;
    const updateData = req.body;
    
    const teamMember = await TeamMember.findOneAndUpdate(
      { _id: id, clubId: user._id },
      updateData,
      { new: true, runValidators: true }
    ).populate('userId', 'fullName email');
    
    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Team-Mitglied nicht gefunden'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Team-Mitglied erfolgreich aktualisiert',
      teamMember
    });
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Team-Mitglieds:', error);
    res.status(500).json({
      success: false,
      message: 'Fehler beim Aktualisieren des Team-Mitglieds',
      error: error.message
    });
  }
};

// Remove team member
const removeTeamMember = async (req, res) => {
  try {
    const { user } = req.user;
    const { id } = req.params;
    
    const teamMember = await TeamMember.findOneAndDelete({
      _id: id,
      clubId: user._id
    });
    
    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Team-Mitglied nicht gefunden'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Team-Mitglied erfolgreich entfernt'
    });
  } catch (error) {
    console.error('Fehler beim Entfernen des Team-Mitglieds:', error);
    res.status(500).json({
      success: false,
      message: 'Fehler beim Entfernen des Team-Mitglieds',
      error: error.message
    });
  }
};

// Helper function to send invitation email
const sendInvitationEmail = async (email, inviteToken, inviterName, role) => {
  try {
    // Für Development: Console-Log
    console.log(`📧 Einladungs-E-Mail für ${email}:`);
    console.log(`   Token: ${inviteToken}`);
    console.log(`   Eingeladen von: ${inviterName}`);
    console.log(`   Rolle: ${role}`);
    console.log(`   Link: ${process.env.FRONTEND_URL || 'http://localhost:5173'}/invite/${inviteToken}`);
    
    // TODO: In Production mit echtem E-Mail-Service ersetzen
    // Beispiel-Konfiguration für echte E-Mails:
    /*
    const transporter = nodemailer.createTransporter({
      service: 'gmail', // oder anderen E-Mail-Provider
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@footballtrainer.app',
      to: email,
      subject: `Einladung zum Team von ${inviterName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6;">Sie wurden zum Team eingeladen! ⚽</h2>
          <p><strong>${inviterName}</strong> hat Sie als <strong>${role}</strong> zu seinem Fußballteam eingeladen.</p>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Ihre Rolle: ${role}</h3>
            <p>Als ${role} haben Sie Zugriff auf verschiedene Funktionen der Football Trainer App.</p>
          </div>
          
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/invite/${inviteToken}" 
             style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0;">
            Einladung annehmen
          </a>
          
          <p style="color: #6b7280; font-size: 14px;">
            Diese Einladung läuft in 7 Tagen ab. Falls Sie Probleme haben, wenden Sie sich an ${inviterName}.
          </p>
        </div>
      `
    };
    
    const result = await transporter.sendMail(mailOptions);
    console.log('✅ E-Mail erfolgreich versendet:', result.messageId);
    */
    
  } catch (error) {
    console.error('❌ Fehler beim Versenden der Einladungs-E-Mail:', error);
    // Fehler nicht weiterwerfen, damit die Einladung trotzdem erstellt wird
  }
};

module.exports = {
  getTeamMembers,
  inviteTeamMember,
  acceptInvitation,
  updateTeamMember,
  removeTeamMember
};
