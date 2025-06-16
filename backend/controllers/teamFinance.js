const TeamFinance = require("../models/teamFinance.model");
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Konfiguration für File Upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = './uploads/receipts/';
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'receipt-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Nur Bilder (JPEG, PNG) und Dokumente (PDF, DOC, DOCX) sind erlaubt'));
        }
    }
});

// Neuen Eintrag hinzufügen
const addFinanceEntry = async (req, res) => {
    const { title, description, amount, type, category, date } = req.body;
    const { user } = req.user;

    if (!title) {
        return res.status(400).json({ error: true, message: "Titel ist erforderlich" });
    }
    if (!amount || amount <= 0) {
        return res.status(400).json({ error: true, message: "Gültiger Betrag ist erforderlich" });
    }
    if (!type || !['income', 'expense'].includes(type)) {
        return res.status(400).json({ error: true, message: "Gültiger Typ (Einnahme/Ausgabe) ist erforderlich" });
    }
    if (!category) {
        return res.status(400).json({ error: true, message: "Kategorie ist erforderlich" });
    }

    try {
        const financeEntry = new TeamFinance({
            title,
            description: description || '',
            amount: parseFloat(amount),
            type,
            category,
            date: date ? new Date(date) : new Date(),
            userId: user._id,
            receipt: req.file ? {
                filename: req.file.filename,
                originalName: req.file.originalname,
                mimetype: req.file.mimetype,
                size: req.file.size,
                uploadDate: new Date()
            } : undefined
        });

        await financeEntry.save();
        return res.json({ 
            error: false, 
            financeEntry, 
            message: "Eintrag erfolgreich hinzugefügt" 
        });
    } catch (error) {
        console.error("Error adding finance entry:", error);
        return res.status(500).json({ 
            error: true, 
            message: "Interner Serverfehler" 
        });
    }
};

// Alle Einträge abrufen
const getAllFinanceEntries = async (req, res) => {
    const { user } = req.user;
    const { type, category, startDate, endDate, page = 1, limit = 20 } = req.query;

    try {
        let filter = { userId: user._id };

        // Filter anwenden
        if (type && ['income', 'expense'].includes(type)) {
            filter.type = type;
        }
        if (category) {
            filter.category = category;
        }
        if (startDate || endDate) {
            filter.date = {};
            if (startDate) filter.date.$gte = new Date(startDate);
            if (endDate) filter.date.$lte = new Date(endDate);
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        const entries = await TeamFinance.find(filter)
            .sort({ date: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await TeamFinance.countDocuments(filter);

        // Berechne Zusammenfassung
        const summary = await TeamFinance.aggregate([
            { $match: { userId: user._id } },
            {
                $group: {
                    _id: '$type',
                    total: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            }
        ]);

        const summaryData = {
            totalIncome: 0,
            totalExpenses: 0,
            balance: 0,
            totalEntries: total
        };

        summary.forEach(item => {
            if (item._id === 'income') {
                summaryData.totalIncome = item.total;
            } else if (item._id === 'expense') {
                summaryData.totalExpenses = item.total;
            }
        });

        summaryData.balance = summaryData.totalIncome - summaryData.totalExpenses;

        return res.json({
            error: false,
            entries,
            summary: summaryData,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / parseInt(limit)),
                totalEntries: total,
                entriesPerPage: parseInt(limit)
            }
        });
    } catch (error) {
        console.error("Error fetching finance entries:", error);
        return res.status(500).json({
            error: true,
            message: "Interner Serverfehler"
        });
    }
};

// Einzelnen Eintrag abrufen
const getFinanceEntry = async (req, res) => {
    const { entryId } = req.params;
    const { user } = req.user;

    try {
        const entry = await TeamFinance.findOne({ _id: entryId, userId: user._id });
        
        if (!entry) {
            return res.status(404).json({ error: true, message: "Eintrag nicht gefunden" });
        }

        return res.json({ error: false, entry });
    } catch (error) {
        console.error("Error fetching finance entry:", error);
        return res.status(500).json({
            error: true,
            message: "Interner Serverfehler"
        });
    }
};

// Eintrag bearbeiten
const editFinanceEntry = async (req, res) => {
    const { entryId } = req.params;
    const { title, description, amount, type, category, date } = req.body;
    const { user } = req.user;

    if (!title && !amount && !type && !category && !date && !description) {
        return res.status(400).json({
            error: true,
            message: "Keine Änderungen bereitgestellt"
        });
    }

    try {
        const entry = await TeamFinance.findOne({ _id: entryId, userId: user._id });
        
        if (!entry) {
            return res.status(404).json({ error: true, message: "Eintrag nicht gefunden" });
        }

        // Aktualisiere Felder
        if (title) entry.title = title;
        if (description !== undefined) entry.description = description;
        if (amount) entry.amount = parseFloat(amount);
        if (type && ['income', 'expense'].includes(type)) entry.type = type;
        if (category) entry.category = category;
        if (date) entry.date = new Date(date);
        
        // Neuen Beleg hinzufügen, falls vorhanden
        if (req.file) {
            // Alten Beleg löschen, falls vorhanden
            if (entry.receipt && entry.receipt.filename) {
                const oldPath = path.join('./uploads/receipts/', entry.receipt.filename);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }
            
            entry.receipt = {
                filename: req.file.filename,
                originalName: req.file.originalname,
                mimetype: req.file.mimetype,
                size: req.file.size,
                uploadDate: new Date()
            };
        }

        entry.updatedOn = new Date();
        await entry.save();

        return res.json({
            error: false,
            entry,
            message: "Eintrag erfolgreich aktualisiert"
        });
    } catch (error) {
        console.error("Error updating finance entry:", error);
        return res.status(500).json({
            error: true,
            message: "Interner Serverfehler"
        });
    }
};

// Eintrag löschen
const deleteFinanceEntry = async (req, res) => {
    const { entryId } = req.params;
    const { user } = req.user;

    try {
        const entry = await TeamFinance.findOne({ _id: entryId, userId: user._id });
        
        if (!entry) {
            return res.status(404).json({ error: true, message: "Eintrag nicht gefunden" });
        }

        // Beleg-Datei löschen, falls vorhanden
        if (entry.receipt && entry.receipt.filename) {
            const filePath = path.join('./uploads/receipts/', entry.receipt.filename);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        await TeamFinance.deleteOne({ _id: entryId, userId: user._id });

        return res.json({
            error: false,
            message: "Eintrag erfolgreich gelöscht"
        });
    } catch (error) {
        console.error("Error deleting finance entry:", error);
        return res.status(500).json({
            error: true,
            message: "Interner Serverfehler"
        });
    }
};

// Beleg herunterladen
const downloadReceipt = async (req, res) => {
    const { entryId } = req.params;
    const { user } = req.user;

    try {
        const entry = await TeamFinance.findOne({ _id: entryId, userId: user._id });
        
        if (!entry || !entry.receipt || !entry.receipt.filename) {
            return res.status(404).json({ error: true, message: "Beleg nicht gefunden" });
        }

        const filePath = path.join('./uploads/receipts/', entry.receipt.filename);
        
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: true, message: "Datei nicht gefunden" });
        }

        res.download(filePath, entry.receipt.originalName);
    } catch (error) {
        console.error("Error downloading receipt:", error);
        return res.status(500).json({
            error: true,
            message: "Interner Serverfehler"
        });
    }
};

module.exports = {
    addFinanceEntry,
    getAllFinanceEntries,
    getFinanceEntry,
    editFinanceEntry,
    deleteFinanceEntry,
    downloadReceipt,
    upload
};
