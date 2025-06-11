// *** Controller for User ***
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { logInfo, logError, logDebug } = require('../utils/logger');

const getUser = async (req, res) => {
  const user  = req.user;
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
  try {
    const userInfo = await User.findOne({ email });
    if (!userInfo) {
      logDebug('Anmeldeversuch mit nicht existierender E-Mail', { email });
      return res.status(400).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, userInfo.password);
    if (!isPasswordValid) {
      logDebug('Fehlgeschlagener Anmeldeversuch: Ungültiges Passwort', { email });
      return res.status(400).json({ error: true, message: "Invalid Credentials" });
    }
    
    logInfo('Benutzer erfolgreich angemeldet', { userId: userInfo._id, email });

    const payload = { 
      _id: userInfo._id, 
      email: userInfo.email, 
      fullName: userInfo.fullName 
    };

    // Generiere Access Token (15 Minuten)
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "15m",
    });

    // Generiere Refresh Token (7 Tage)
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "7d",
    });

    // Speichere Refresh Token in der Datenbank
    userInfo.refreshTokens.push({ token: refreshToken });
    await userInfo.save();

    // Setze Refresh Token als HttpOnly Cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 Tage
    });

    return res.json({
      error: false,
      message: "Login Successful",
      email,
      accessToken,
    });
  } catch (error) {
    return res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};

const createUser = async (req, res) => {
  const { fullName, email, password } = req.body;

  // Überprüfen, ob der Benutzer existiert
  const isUser = await User.findOne({ email });
  if (isUser) return res.json({ error: true, message: "User already exists" });

  // Benutzer erstellen und speichern
  const user = new User({ fullName, email, password });
  
  try {
    await user.save();

    const payload = {
      _id: user._id,
      email: user.email,
      fullName: user.fullName
    };

    // Generiere Access Token (15 Minuten)
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "15m",
    });

    // Generiere Refresh Token (7 Tage)
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "7d",
    });

    // Speichere Refresh Token in der Datenbank
    user.refreshTokens = [{ token: refreshToken }];
    await user.save();

    // Setze Refresh Token als HttpOnly Cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 Tage
    });

    return res.json({
      error: false,
      user: {
        _id: user._id,
        email: user.email,
        fullName: user.fullName
      },
      accessToken,
      message: "Registration Successful",
    });
  } catch (error) {
    return res.status(500).json({ 
      error: true, 
      message: "Fehler beim Speichern des Benutzers",
      details: error.message 
    });
  }
};

module.exports = { getUser, loginUser, createUser };
