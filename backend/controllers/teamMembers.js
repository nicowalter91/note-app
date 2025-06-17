const TeamMember = require('../models/teamMember.model');
const User = require('../models/user.model');
const ClubSettings = require('../models/clubSettings.model');
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

// Accept team invitation - Vereinfachter Ansatz mit automatischer User-Erstellung
const acceptInvitation = async (req, res) => {
  try {
    const { token } = req.params;
    console.log('🔍 Accept invitation called with token:', token);
    
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token ist erforderlich'
      });
    }
    
    // Finde die Einladung mit Debug-Logging
    console.log('🔍 Searching for team member with token...');
    const teamMember = await TeamMember.findOne({
      inviteToken: token,
      inviteExpiresAt: { $gt: new Date() },
      status: 'pending'
    });
    
    console.log('🔍 Team member found:', teamMember ? 'Yes' : 'No');
    
    // Wenn nicht gefunden, suche ohne Zeitlimit um zu sehen ob Token existiert
    if (!teamMember) {
      console.log('🔍 Searching for token without time constraint...');
      const anyTeamMember = await TeamMember.findOne({ inviteToken: token });
      console.log('🔍 Token exists in database:', anyTeamMember ? 'Yes' : 'No');
      
      if (anyTeamMember) {
        console.log('🔍 Token details:', {
          status: anyTeamMember.status,
          expiresAt: anyTeamMember.inviteExpiresAt,
          isExpired: anyTeamMember.inviteExpiresAt < new Date()
        });
      }
      
      return res.status(404).json({
        success: false,
        message: 'Einladung nicht gefunden oder abgelaufen'
      });
    }
    
    console.log('🔍 Team member details:', {
      email: teamMember.email,
      name: teamMember.name,
      role: teamMember.role,
      status: teamMember.status
    });
    
    // Prüfe ob bereits ein User mit dieser E-Mail existiert
    let existingUser = await User.findOne({ 
      email: teamMember.email.toLowerCase() 
    });
    
    let user;
    let isNewUser = false;
    let temporaryPassword = null;
    
    if (existingUser) {
      // User existiert bereits - verwende den existierenden User
      user = existingUser;
    } else {
      // Erstelle neuen User mit temporären Credentials
      temporaryPassword = `Temp${Math.random().toString(36).substring(2, 8)}${Date.now().toString().slice(-4)}!`;
      
      user = new User({
        fullName: teamMember.name,
        email: teamMember.email.toLowerCase(),
        password: temporaryPassword,
        userType: 'invited',
        isInvited: true,
        invitedAt: new Date(),
        onboardingCompleted: false,
        tourCompleted: false
      });
      
      await user.save();
      isNewUser = true;
      
      console.log(`Neuer User erstellt: ${user.email} mit temporärem Passwort: ${temporaryPassword}`);
    }
    
    // Update team member
    teamMember.userId = user._id;
    teamMember.status = 'active';
    teamMember.joinedAt = new Date();
    teamMember.inviteToken = undefined;
    teamMember.inviteExpiresAt = undefined;
    
    await teamMember.save();
    
    // Falls es ein existierender User war, aktualisiere seine Invitation-Flags
    if (!isNewUser) {
      await User.findByIdAndUpdate(user._id, {
        isInvited: true,
        userType: 'invited',
        invitedAt: new Date()
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Einladung erfolgreich angenommen',
      isNewUser,
      userEmail: user.email,
      temporaryPassword: isNewUser ? temporaryPassword : null,
      redirectTo: '/login',
      instructions: isNewUser ? 
        'Ein temporärer Account wurde für Sie erstellt. Bitte loggen Sie sich mit den bereitgestellten Credentials ein und ändern Sie Ihr Passwort.' :
        'Bitte loggen Sie sich mit Ihrem bestehenden Account ein.',
      teamMember: {
        name: teamMember.name,
        role: teamMember.role,
        status: teamMember.status
      }
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
    const { deleteUser = false } = req.body; // Option um auch den User zu löschen
    
    // Finde das TeamMember mit User-Population
    const teamMember = await TeamMember.findOne({
      _id: id,
      clubId: user._id
    }).populate('userId');
    
    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Team-Mitglied nicht gefunden'
      });
    }
    
    // Speichere User-Info für optionales Löschen
    const associatedUser = teamMember.userId;
    
    // Entferne TeamMember
    await TeamMember.findByIdAndDelete(id);
    
    // Optional: Lösche auch den User (nur wenn es ein eingeladener User ist)
    if (deleteUser && associatedUser && associatedUser.userType === 'invited') {
      try {
        await User.findByIdAndDelete(associatedUser._id);
        console.log(`✅ Eingeladener Benutzer ${associatedUser.email} wurde gelöscht`);
      } catch (userDeleteError) {
        console.error('Fehler beim Löschen des Benutzers:', userDeleteError);
        // TeamMember wurde bereits entfernt, also nicht komplett fehlschlagen
      }
    }
    
    res.status(200).json({
      success: true,
      message: deleteUser && associatedUser && associatedUser.userType === 'invited' 
        ? 'Team-Mitglied und Benutzerkonto erfolgreich entfernt'
        : 'Team-Mitglied erfolgreich entfernt',
      deletedUser: deleteUser && associatedUser && associatedUser.userType === 'invited'
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

// Generate invitation link
const generateInvitationLink = async (req, res) => {
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
      // Wenn bereits vorhanden, neuen Token generieren und Link zurückgeben
      const newToken = crypto.randomBytes(32).toString('hex');
      const newExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
      
      existingMember.inviteToken = newToken;
      existingMember.inviteExpiresAt = newExpiresAt;
      existingMember.role = role; // Update role if changed
      await existingMember.save();
      
      const inviteLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/join/${newToken}`;
      
      return res.status(200).json({
        success: true,
        message: 'Einladungslink für existierendes Mitglied erneuert',
        inviteLink,
        teamMember: existingMember
      });
    }
    
    // Neues Team-Mitglied erstellen
    const inviteToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    
    const teamMember = new TeamMember({
      clubId: user._id,
      email: email.toLowerCase(),
      role,
      name: name || email.split('@')[0],
      inviteToken,
      inviteExpiresAt: expiresAt,
      status: 'pending'
    });
    
    await teamMember.save();
    
    const inviteLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/join/${inviteToken}`;
    
    res.status(201).json({
      success: true,
      message: 'Einladungslink erfolgreich erstellt',
      inviteLink,
      teamMember
    });
    
  } catch (error) {
    console.error('Fehler beim Erstellen des Einladungslinks:', error);
    res.status(500).json({
      success: false,
      message: 'Fehler beim Erstellen des Einladungslinks',
      error: error.message
    });
  }
};

// Validate invitation token
const validateInvitationToken = async (req, res) => {
  try {
    const { token } = req.params;
    
    const teamMember = await TeamMember.findOne({
      inviteToken: token,
      inviteExpiresAt: { $gt: new Date() },
      status: 'pending'
    }).populate('clubId', 'fullName');
    
    if (!teamMember) {
      return res.status(400).json({
        success: false,
        message: 'Ungültiger oder abgelaufener Einladungslink'
      });
    }
    
    // Lade die ClubSettings für den Vereinsnamen
    const clubSettings = await ClubSettings.findOne({ userId: teamMember.clubId._id });
    
    res.status(200).json({
      success: true,
      invitation: {
        clubName: clubSettings?.name || teamMember.clubId.fullName,
        inviterName: teamMember.clubId.fullName,
        role: teamMember.role,
        email: teamMember.email,
        expiresAt: teamMember.inviteExpiresAt
      }
    });
    
  } catch (error) {
    console.error('Fehler beim Validieren des Einladungslinks:', error);
    res.status(500).json({
      success: false,
      message: 'Fehler beim Validieren des Einladungslinks',
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

// Debug endpoint - ONLY FOR DEVELOPMENT
const debugTeamMembers = async (req, res) => {
  try {
    const allTeamMembers = await TeamMember.find({}).select('inviteToken email name status inviteExpiresAt');
    
    console.log('All team members in database:', allTeamMembers);
    
    res.status(200).json({
      success: true,
      count: allTeamMembers.length,
      teamMembers: allTeamMembers
    });
  } catch (error) {
    console.error('Error fetching team members:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  getTeamMembers,
  inviteTeamMember,
  generateInvitationLink,
  validateInvitationToken,
  acceptInvitation,
  updateTeamMember,
  removeTeamMember,
  debugTeamMembers
};
