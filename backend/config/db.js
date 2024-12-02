const mongoose = require("mongoose");
const config = require("../config.json");

module.exports = async () => {
  try {
    await mongoose.connect(config.connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
    process.exit(1); // Beende den Prozess, wenn die Verbindung fehlschlägt
  }
};
