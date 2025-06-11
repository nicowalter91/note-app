const Transaction = require('../models/transaction.model');
const path = require('path');
const fs = require('fs');

// Alle Transaktionen abrufen
const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .sort({ date: -1 })
      .populate('createdBy', 'fullName');
    
    res.status(200).json({ transactions });
  } catch (error) {
    console.error('Error in getAllTransactions:', error);
    res.status(500).json({ message: 'Fehler beim Abrufen der Transaktionen', error: error.message });
  }
};

// Neue Transaktion erstellen
const createTransaction = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Request user:', req.user);
    console.log('Request file:', req.file);

    const { type, amount, description, date } = req.body;
    
    // Validiere Pflichtfelder
    if (!type || !amount || !description || !date) {
      return res.status(400).json({ 
        message: 'Fehlende Pflichtfelder', 
        required: ['type', 'amount', 'description', 'date'],
        received: req.body 
      });
    }

    // Validiere User
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Nicht authentifiziert' });
    }

    let receipt = null;
    if (req.file) {
      receipt = `/uploads/${req.file.filename}`;
    }

    const transaction = new Transaction({
      type,
      amount: parseFloat(amount),
      description,
      date: new Date(date),
      receipt,
      createdBy: req.user._id
    });

    await transaction.save();
    res.status(201).json({ message: 'Transaktion erfolgreich erstellt', transaction });
  } catch (error) {
    console.error('Error in createTransaction:', error);
    res.status(500).json({ message: 'Fehler beim Erstellen der Transaktion', error: error.message });
  }
};

// Transaktion löschen
const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.transactionId);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaktion nicht gefunden' });
    }

    // Optional: Beleg-Datei löschen, wenn vorhanden
    if (transaction.receipt) {
      const filePath = path.join(__dirname, '..', transaction.receipt);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Transaction.deleteOne({ _id: transaction._id });
    res.status(200).json({ message: 'Transaktion erfolgreich gelöscht' });
  } catch (error) {
    console.error('Error in deleteTransaction:', error);
    res.status(500).json({ message: 'Fehler beim Löschen der Transaktion', error: error.message });
  }
};

module.exports = {
  getAllTransactions,
  createTransaction,
  deleteTransaction
};
