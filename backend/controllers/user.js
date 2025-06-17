// *** Controller for User ***
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const getUser = async (req, res) => {
  const { user } = req.user;
  const isUser = await User.findOne({ _id: user._id });

  if (!isUser) return res.sendStatus(401);
  return res.json({
    user: {
      fullName: isUser.fullName,
      email: isUser.email,
      _id: isUser._id,
      createdOn: isUser.createdOn,
    },
    message: "",
  });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });
  if (!password)
    return res.status(400).json({ message: "Password is required" });

  try {
    const userInfo = await User.findOne({ email });
    if (!userInfo) return res.status(400).json({ message: "User not found" });

    const isPasswordValid = await bcrypt.compare(password, userInfo.password);
    if (!isPasswordValid)
      return res
        .status(400)
        .json({ error: true, message: "Invalid Credentials" });

    const user = { user: userInfo };
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "36000m",
    });

    return res.json({
      error: false,
      message: "Login Successful",
      email,
      accessToken,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: true, message: "Internal Server Error" });
  }
};

const createUser = async (req, res) => {
  const { fullName, email, password } = req.body;

  // Validierung der Eingabedaten
  if (!fullName)
    return res
      .status(400)
      .json({ error: true, message: "Full Name is required" });
  if (!email)
    return res.status(400).json({ error: true, message: "Email is required" });
  if (!password)
    return res
      .status(400)
      .json({ error: true, message: "Password is required" });

  // Überprüfen, ob der Benutzer existiert
  const isUser = await User.findOne({ email });
  if (isUser) return res.json({ error: true, message: "User already exists" });

  // Benutzer erstellen und speichern
  const user = new User({ fullName, email, password });
  await user.save();
  // JWT-Token generieren
  const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "36000m",
  });
  return res.json({
    error: false,
    user,
    accessToken,
    message: "Registration Successful",
  });
};

// Change password
const changePassword = async (req, res) => {
  try {
    const { user } = req.user;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Aktuelles und neues Passwort sind erforderlich"
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Das neue Passwort muss mindestens 6 Zeichen lang sein"
      });
    }

    // User aus Datenbank laden
    const userData = await User.findById(user._id);
    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "Benutzer nicht gefunden"
      });
    }

    // Aktuelles Passwort überprüfen
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, userData.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Das aktuelle Passwort ist falsch"
      });
    }

    // Neues Passwort hashen
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Passwort in Datenbank aktualisieren
    await User.findByIdAndUpdate(user._id, {
      password: hashedNewPassword,
      updatedAt: new Date()
    });

    res.status(200).json({
      success: true,
      message: "Passwort erfolgreich geändert"
    });

  } catch (error) {
    console.error('Fehler beim Ändern des Passworts:', error);
    res.status(500).json({
      success: false,
      message: "Interner Serverfehler beim Ändern des Passworts"
    });  }
};

// Change email
const changeEmail = async (req, res) => {
  try {
    const { user } = req.user;
    const { newEmail, currentPassword } = req.body;

    if (!newEmail || !currentPassword) {
      return res.status(400).json({
        success: false,
        message: "Neue E-Mail-Adresse und aktuelles Passwort sind erforderlich"
      });
    }

    // Email-Validierung
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      return res.status(400).json({
        success: false,
        message: "Bitte geben Sie eine gültige E-Mail-Adresse ein"
      });
    }

    // User aus Datenbank laden
    const userData = await User.findById(user._id);
    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "Benutzer nicht gefunden"
      });
    }

    // Aktuelles Passwort überprüfen
    const isPasswordValid = await bcrypt.compare(currentPassword, userData.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Das eingegebene Passwort ist falsch"
      });
    }

    // Prüfen ob die neue E-Mail bereits verwendet wird
    const existingUser = await User.findOne({ 
      email: newEmail.toLowerCase(), 
      _id: { $ne: user._id } 
    });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Diese E-Mail-Adresse wird bereits von einem anderen Benutzer verwendet"
      });
    }

    // E-Mail-Adresse in Datenbank aktualisieren
    await User.findByIdAndUpdate(user._id, {
      email: newEmail.toLowerCase(),
      updatedAt: new Date()
    });

    res.status(200).json({
      success: true,
      message: "E-Mail-Adresse erfolgreich geändert"
    });

  } catch (error) {
    console.error('Fehler beim Ändern der E-Mail:', error);
    res.status(500).json({
      success: false,
      message: "Interner Serverfehler beim Ändern der E-Mail-Adresse"
    });
  }
};

module.exports = { getUser, loginUser, createUser, changePassword, changeEmail };
