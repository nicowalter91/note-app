const request = require('supertest');
const app = require('../server');
const User = require('../models/user.model');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

describe('User Controller Tests', () => {
  beforeAll(async () => {
    // Verbindung zur Test-Datenbank herstellen
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/note-app-test');
  });

  beforeEach(async () => {
    // Datenbank vor jedem Test leeren
    await User.deleteMany({});
  });

  afterAll(async () => {
    // Verbindung nach allen Tests schließen
    await mongoose.connection.close();
  });

  describe('POST /create-account', () => {
    it('sollte einen neuen Benutzer erstellen', async () => {
      const userData = {
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'test123'
      };

      const response = await request(app)
        .post('/create-account')
        .send(userData);

      // Überprüfen der Antwort
      expect(response.status).toBe(200);
      expect(response.body.error).toBe(false);
      expect(response.body.message).toBe('Registration Successful');
      expect(response.body.accessToken).toBeDefined();
      expect(response.body.user).toBeDefined();
      expect(response.body.user.fullName).toBe(userData.fullName);
      expect(response.body.user.email).toBe(userData.email);

      // Überprüfen, ob der Benutzer in der Datenbank existiert
      const user = await User.findOne({ email: userData.email });
      expect(user).toBeDefined();
      expect(user.fullName).toBe(userData.fullName);
      expect(user.email).toBe(userData.email);

      // Überprüfen, ob das Passwort gehasht wurde
      const isPasswordValid = await bcrypt.compare(userData.password, user.password);
      expect(isPasswordValid).toBe(true);
    });

    it('sollte einen Fehler zurückgeben, wenn der Benutzer bereits existiert', async () => {
      // Erst einen Benutzer erstellen
      const user = new User({
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'test123'
      });
      await user.save();

      // Versuchen, den gleichen Benutzer noch einmal zu erstellen
      const response = await request(app)
        .post('/create-account')
        .send({
          fullName: 'Test User',
          email: 'test@example.com',
          password: 'test123'
        });

      expect(response.status).toBe(200);
      expect(response.body.error).toBe(true);
      expect(response.body.message).toBe('User already exists');
    });

    it('sollte einen Fehler zurückgeben, wenn erforderliche Felder fehlen', async () => {
      const incompleteUserData = {
        // fullName fehlt
        email: 'test@example.com',
        password: 'test123'
      };

      const response = await request(app)
        .post('/create-account')
        .send(incompleteUserData);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe(true);
      expect(response.body.message).toBe('Full Name is required');
    });

    it('sollte einen Fehler zurückgeben, wenn die E-Mail ungültig ist', async () => {
      const invalidEmailData = {
        fullName: 'Test User',
        email: 'invalid-email',
        password: 'test123'
      };

      const response = await request(app)
        .post('/create-account')
        .send(invalidEmailData);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Bitte gib eine gültige E-Mail-Adresse ein');
    });

    it('sollte einen Fehler zurückgeben, wenn das Passwort zu kurz ist', async () => {
      const shortPasswordData = {
        fullName: 'Test User',
        email: 'test@example.com',
        password: '12345' // weniger als 6 Zeichen
      };

      const response = await request(app)
        .post('/create-account')
        .send(shortPasswordData);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Das Passwort muss mindestens 6 Zeichen lang sein');
    });
  });
});
