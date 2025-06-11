// MongoDB Script zum Erstellen eines Test-Benutzers
const bcrypt = require('bcrypt');

// Test-Benutzer Daten
const testUser = {
  fullName: "Test User",
  email: "test@example.com",
  password: bcrypt.hashSync("test123", 10),
  refreshTokens: [],
  createdOn: new Date()
};

// Füge Test-Benutzer hinzu
db.users.insertOne(testUser);

console.log("Test-Benutzer erstellt:");
console.log("Email: test@example.com");
console.log("Password: test123");

// Zeige alle Benutzer
db.users.find({}, {fullName: 1, email: 1, createdOn: 1}).forEach(printjson);
