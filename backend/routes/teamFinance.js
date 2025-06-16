const express = require("express");
const authenticateUser = require("../middleware/authenticateUser");
const { 
    addFinanceEntry, 
    getAllFinanceEntries, 
    getFinanceEntry,
    editFinanceEntry,
    deleteFinanceEntry,
    downloadReceipt,
    upload 
} = require("../controllers/teamFinance");

const router = express.Router();

// Alle Finanz-Einträge abrufen
router.get("/", authenticateUser, getAllFinanceEntries);

// Einzelnen Eintrag abrufen
router.get("/:entryId", authenticateUser, getFinanceEntry);

// Neuen Eintrag hinzufügen (mit optionalem Beleg-Upload)
router.post("/", authenticateUser, upload.single('receipt'), addFinanceEntry);

// Eintrag bearbeiten (mit optionalem Beleg-Upload)
router.put("/:entryId", authenticateUser, upload.single('receipt'), editFinanceEntry);

// Eintrag löschen
router.delete("/:entryId", authenticateUser, deleteFinanceEntry);

// Beleg herunterladen
router.get("/:entryId/receipt", authenticateUser, downloadReceipt);

module.exports = router;
