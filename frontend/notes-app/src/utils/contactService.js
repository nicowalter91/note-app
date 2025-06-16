import axiosInstance from "./axiosInstance";

// Alle Kontakte abrufen
export const getAllContacts = async (category = "", search = "") => {
    try {
        const params = new URLSearchParams();
        if (category && category !== "Alle") params.append("category", category);
        if (search) params.append("search", search);
        
        const response = await axiosInstance.get(`/contacts?${params.toString()}`);
        return response.data;
    } catch (error) {
        console.error("Fehler beim Abrufen der Kontakte:", error);
        throw error;
    }
};

// Einzelnen Kontakt abrufen
export const getContact = async (contactId) => {
    try {
        const response = await axiosInstance.get(`/contacts/${contactId}`);
        return response.data;
    } catch (error) {
        console.error("Fehler beim Abrufen des Kontakts:", error);
        throw error;
    }
};

// Neuen Kontakt hinzufügen
export const addContact = async (contactData) => {
    try {
        const response = await axiosInstance.post("/add-contact", contactData);
        return response.data;
    } catch (error) {
        console.error("Fehler beim Hinzufügen des Kontakts:", error);
        throw error;
    }
};

// Kontakt bearbeiten
export const editContact = async (contactId, contactData) => {
    try {
        const response = await axiosInstance.put(`/edit-contact/${contactId}`, contactData);
        return response.data;
    } catch (error) {
        console.error("Fehler beim Bearbeiten des Kontakts:", error);
        throw error;
    }
};

// Kontakt löschen
export const deleteContact = async (contactId) => {
    try {
        const response = await axiosInstance.delete(`/delete-contact/${contactId}`);
        return response.data;
    } catch (error) {
        console.error("Fehler beim Löschen des Kontakts:", error);
        throw error;
    }
};

// Pin-Status eines Kontakts ändern
export const updateContactPinned = async (contactId, isPinned) => {
    try {
        const response = await axiosInstance.put(`/update-contact-pinned/${contactId}`, { isPinned });
        return response.data;
    } catch (error) {
        console.error("Fehler beim Aktualisieren des Pin-Status:", error);
        throw error;
    }
};

// Letztes Kontaktdatum aktualisieren
export const updateLastContactDate = async (contactId) => {
    try {
        const response = await axiosInstance.put(`/update-last-contact/${contactId}`);
        return response.data;
    } catch (error) {
        console.error("Fehler beim Aktualisieren des Kontaktdatums:", error);
        throw error;
    }
};
