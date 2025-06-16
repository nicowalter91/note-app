const Contact = require("../models/contact.model");

// Neuen Kontakt hinzufügen
const addContact = async (req, res) => {
    try {
        console.log("addContact called with body:", req.body);
        console.log("User ID:", req.user?._id);
          if (!req.user || !req.user.user || !req.user.user._id) {
            console.log("ERROR: User not authenticated, req.user:", req.user);
            return res.status(401).json({ 
                error: true, 
                message: "Benutzer nicht authentifiziert." 
            });
        }
        
        const { name, organization, position, email, phone, mobile, address, category, notes, tags } = req.body;
        const userId = req.user.user._id;

        if (!name || name.trim() === "") {
            return res.status(400).json({ 
                error: true, 
                message: "Name ist erforderlich." 
            });
        }

        const contact = new Contact({
            userId,
            name: name.trim(),
            organization: organization?.trim() || "",
            position: position?.trim() || "",
            email: email?.trim() || "",
            phone: phone?.trim() || "",
            mobile: mobile?.trim() || "",
            address: address || {},
            category: category || "Sonstige",
            notes: notes?.trim() || "",
            tags: tags || []
        });

        console.log("About to save contact:", contact);
        await contact.save();
        console.log("Contact saved successfully:", contact);

        return res.json({
            error: false,
            contact,
            message: "Kontakt erfolgreich hinzugefügt."
        });
    } catch (error) {
        console.error("Fehler beim Hinzufügen des Kontakts:", error);
        return res.status(500).json({
            error: true,
            message: "Interner Serverfehler"
        });
    }
};

// Kontakt bearbeiten
const editContact = async (req, res) => {
    try {        const contactId = req.params.contactId;
        const { name, organization, position, email, phone, mobile, address, category, notes, tags } = req.body;
        const userId = req.user.user._id;

        if (!name || name.trim() === "") {
            return res.status(400).json({ 
                error: true, 
                message: "Name ist erforderlich." 
            });
        }

        const contact = await Contact.findOne({ _id: contactId, userId });

        if (!contact) {
            return res.status(404).json({
                error: true,
                message: "Kontakt nicht gefunden."
            });
        }

        contact.name = name.trim();
        contact.organization = organization?.trim() || "";
        contact.position = position?.trim() || "";
        contact.email = email?.trim() || "";
        contact.phone = phone?.trim() || "";
        contact.mobile = mobile?.trim() || "";
        contact.address = address || {};
        contact.category = category || "Sonstige";
        contact.notes = notes?.trim() || "";
        contact.tags = tags || [];

        await contact.save();

        return res.json({
            error: false,
            contact,
            message: "Kontakt erfolgreich aktualisiert."
        });
    } catch (error) {
        console.error("Fehler beim Bearbeiten des Kontakts:", error);
        return res.status(500).json({
            error: true,
            message: "Interner Serverfehler"
        });
    }
};

// Alle Kontakte abrufen
const getAllContacts = async (req, res) => {
    try {        console.log("getAllContacts called, user:", req.user);
        const userId = req.user.user._id;
        const { category, search } = req.query;

        let query = { userId };

        // Filter nach Kategorie
        if (category && category !== "Alle") {
            query.category = category;
        }

        let contacts = await Contact.find(query).sort({ isPinned: -1, updatedAt: -1 });

        // Suchfunktion
        if (search && search.trim() !== "") {
            const searchTerm = search.trim().toLowerCase();
            contacts = contacts.filter(contact => 
                contact.name.toLowerCase().includes(searchTerm) ||
                contact.organization.toLowerCase().includes(searchTerm) ||
                contact.position.toLowerCase().includes(searchTerm) ||
                contact.email.toLowerCase().includes(searchTerm) ||
                contact.tags.some(tag => tag.toLowerCase().includes(searchTerm))
            );
        }

        return res.json({
            error: false,
            contacts,
            message: "Kontakte erfolgreich abgerufen."
        });
    } catch (error) {
        console.error("Fehler beim Abrufen der Kontakte:", error);
        return res.status(500).json({
            error: true,
            message: "Interner Serverfehler"
        });
    }
};

// Einzelnen Kontakt abrufen
const getContact = async (req, res) => {
    try {
        const contactId = req.params.contactId;
        const userId = req.user.user._id;

        const contact = await Contact.findOne({ _id: contactId, userId });

        if (!contact) {
            return res.status(404).json({
                error: true,
                message: "Kontakt nicht gefunden."
            });
        }

        return res.json({
            error: false,
            contact,
            message: "Kontakt erfolgreich abgerufen."
        });
    } catch (error) {
        console.error("Fehler beim Abrufen des Kontakts:", error);
        return res.status(500).json({
            error: true,
            message: "Interner Serverfehler"
        });
    }
};

// Kontakt löschen
const deleteContact = async (req, res) => {
    try {
        const contactId = req.params.contactId;
        const userId = req.user.user._id;

        const contact = await Contact.findOne({ _id: contactId, userId });

        if (!contact) {
            return res.status(404).json({
                error: true,
                message: "Kontakt nicht gefunden."
            });
        }

        await Contact.deleteOne({ _id: contactId, userId });

        return res.json({
            error: false,
            message: "Kontakt erfolgreich gelöscht."
        });
    } catch (error) {
        console.error("Fehler beim Löschen des Kontakts:", error);
        return res.status(500).json({
            error: true,
            message: "Interner Serverfehler"
        });
    }
};

// Kontakt Pin-Status ändern
const updateContactPinned = async (req, res) => {
    try {
        const contactId = req.params.contactId;
        const { isPinned } = req.body;
        const userId = req.user.user._id;

        const contact = await Contact.findOne({ _id: contactId, userId });

        if (!contact) {
            return res.status(404).json({
                error: true,
                message: "Kontakt nicht gefunden."
            });
        }

        contact.isPinned = isPinned;
        await contact.save();

        return res.json({
            error: false,
            contact,
            message: `Kontakt erfolgreich ${isPinned ? 'angepinnt' : 'gelöst'}.`
        });
    } catch (error) {
        console.error("Fehler beim Aktualisieren des Pin-Status:", error);
        return res.status(500).json({
            error: true,
            message: "Interner Serverfehler"
        });
    }
};

// Letztes Kontaktdatum aktualisieren
const updateLastContactDate = async (req, res) => {
    try {
        const contactId = req.params.contactId;
        const userId = req.user.user._id;

        const contact = await Contact.findOne({ _id: contactId, userId });

        if (!contact) {
            return res.status(404).json({
                error: true,
                message: "Kontakt nicht gefunden."
            });
        }

        contact.lastContactDate = new Date();
        await contact.save();

        return res.json({
            error: false,
            contact,
            message: "Letztes Kontaktdatum aktualisiert."
        });
    } catch (error) {
        console.error("Fehler beim Aktualisieren des Kontaktdatums:", error);
        return res.status(500).json({
            error: true,
            message: "Interner Serverfehler"
        });
    }
};

module.exports = {
    addContact,
    editContact,
    getAllContacts,
    getContact,
    deleteContact,
    updateContactPinned,
    updateLastContactDate
};
