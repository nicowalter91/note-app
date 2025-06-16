import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import ContactCard from '../../components/Cards/ContactCard';
import AddEditContact from '../../components/Cards/AddEditContact';
import SearchBar from '../../components/SearchBar/SearchBar';
import EmptyCard from '../../components/EmptyCard/EmptyCard';
import Toast from '../../components/ToastMessage/Toast';
import { MdAdd, MdFilterList, MdClear } from 'react-icons/md';
import { 
    getAllContacts, 
    addContact, 
    editContact, 
    deleteContact, 
    updateContactPinned,
    updateLastContactDate 
} from '../../utils/contactService';
import axiosInstance from '../../utils/axiosInstance';

const Contacts = () => {
    const [contacts, setContacts] = useState([]);
    const [filteredContacts, setFilteredContacts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Alle');
    const [showAddEditModal, setShowAddEditModal] = useState(false);
    const [contactToEdit, setContactToEdit] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('success');
    
    const navigate = useNavigate();

    const categories = ['Alle', 'Vereine', 'Schiedsrichter', 'Verbände', 'Sponsoren', 'Medien', 'Sonstige'];    useEffect(() => {
        const token = localStorage.getItem('token');
        
        if (!token) {
            navigate('/login');
            return;
        }
        
        fetchContacts();
    }, [navigate]);

    useEffect(() => {
        filterContacts();
    }, [contacts, searchQuery, selectedCategory]);    const fetchContacts = async () => {
        try {
            setIsLoading(true);
            const response = await getAllContacts();
            if (response.error) {
                showToastMessage(response.message, 'error');
            } else {
                setContacts(response.contacts || []);
            }
        } catch (error) {
            console.error('Fehler beim Laden der Kontakte:', error);
            showToastMessage('Fehler beim Laden der Kontakte', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const filterContacts = () => {
        let filtered = contacts;

        // Filter by category
        if (selectedCategory !== 'Alle') {
            filtered = filtered.filter(contact => contact.category === selectedCategory);
        }

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(contact =>
                contact.name.toLowerCase().includes(query) ||
                contact.organization.toLowerCase().includes(query) ||
                contact.position.toLowerCase().includes(query) ||
                contact.email.toLowerCase().includes(query) ||
                contact.tags.some(tag => tag.toLowerCase().includes(query)) ||
                contact.notes.toLowerCase().includes(query)
            );
        }

        setFilteredContacts(filtered);
    };

    const showToastMessage = (message, type = 'success') => {
        setToastMessage(message);
        setToastType(type);
        setShowToast(true);
    };

    const handleAddContact = () => {
        setContactToEdit(null);
        setShowAddEditModal(true);
    };

    const handleEditContact = (contact) => {
        setContactToEdit(contact);
        setShowAddEditModal(true);
    };

    const handleSaveContact = async (contactData) => {
        try {
            let response;
            if (contactToEdit) {
                response = await editContact(contactToEdit._id, contactData);
            } else {
                response = await addContact(contactData);
            }

            if (response.error) {
                showToastMessage(response.message, 'error');
            } else {
                showToastMessage(response.message, 'success');
                setShowAddEditModal(false);
                setContactToEdit(null);
                fetchContacts(); // Refresh the list
            }
        } catch (error) {
            console.error('Fehler beim Speichern des Kontakts:', error);
            showToastMessage('Fehler beim Speichern des Kontakts', 'error');
        }
    };

    const handleDeleteContact = async (contactId) => {
        if (!window.confirm('Sind Sie sicher, dass Sie diesen Kontakt löschen möchten?')) {
            return;
        }

        try {
            const response = await deleteContact(contactId);
            if (response.error) {
                showToastMessage(response.message, 'error');
            } else {
                showToastMessage('Kontakt erfolgreich gelöscht', 'success');
                fetchContacts(); // Refresh the list
            }
        } catch (error) {
            console.error('Fehler beim Löschen des Kontakts:', error);
            showToastMessage('Fehler beim Löschen des Kontakts', 'error');
        }
    };

    const handlePinContact = async (contactId, isPinned) => {
        try {
            const response = await updateContactPinned(contactId, isPinned);
            if (response.error) {
                showToastMessage(response.message, 'error');
            } else {
                showToastMessage(response.message, 'success');
                fetchContacts(); // Refresh the list
            }
        } catch (error) {
            console.error('Fehler beim Aktualisieren des Pin-Status:', error);
            showToastMessage('Fehler beim Aktualisieren des Pin-Status', 'error');
        }
    };

    const handleUpdateLastContact = async (contactId) => {
        try {
            await updateLastContactDate(contactId);
            fetchContacts(); // Refresh the list silently
        } catch (error) {
            console.error('Fehler beim Aktualisieren des Kontaktdatums:', error);
        }
    };

    const handleClearFilters = () => {
        setSearchQuery('');
        setSelectedCategory('Alle');
    };

    const getContactStats = () => {
        const total = contacts.length;
        const pinned = contacts.filter(contact => contact.isPinned).length;
        const byCategory = categories.slice(1).reduce((acc, category) => {
            acc[category] = contacts.filter(contact => contact.category === category).length;
            return acc;
        }, {});

        return { total, pinned, byCategory };
    };

    const stats = getContactStats();    return (
        <Layout>
            <div className="mx-auto max-w-7xl px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Kontakte</h1>
                            <p className="text-gray-600">
                                Verwalten Sie Ihre Kontakte für Testspiele, Verbände und mehr
                            </p>
                        </div>
                        <button
                            onClick={handleAddContact}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        >
                            <MdAdd className="w-5 h-5 mr-2" />
                            Neuer Kontakt
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                            <div className="text-sm text-blue-600 font-medium">Gesamt</div>
                            <div className="text-xl font-bold text-blue-900">{stats.total}</div>
                        </div>
                        <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                            <div className="text-sm text-orange-600 font-medium">Angepinnt</div>
                            <div className="text-xl font-bold text-orange-900">{stats.pinned}</div>
                        </div>
                        {Object.entries(stats.byCategory).map(([category, count]) => (
                            <div key={category} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                <div className="text-sm text-gray-600 font-medium">{category}</div>
                                <div className="text-xl font-bold text-gray-900">{count}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="mb-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search Bar */}
                        <div className="flex-1">
                            <SearchBar 
                                value={searchQuery}
                                onChange={setSearchQuery}
                                onClear={() => setSearchQuery('')}
                                placeholder="Kontakte durchsuchen..."
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <MdFilterList className="w-5 h-5 text-gray-500" />
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {categories.map(category => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {(searchQuery || selectedCategory !== 'Alle') && (
                                <button
                                    onClick={handleClearFilters}
                                    className="inline-flex items-center px-3 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                    <MdClear className="w-4 h-4 mr-1" />
                                    Filter löschen
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Results Info */}
                    <div className="mt-2 text-sm text-gray-600">
                        {filteredContacts.length} von {contacts.length} Kontakten
                        {searchQuery && ` für "${searchQuery}"`}
                        {selectedCategory !== 'Alle' && ` in Kategorie "${selectedCategory}"`}
                    </div>
                </div>

                {/* Content */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                ) : filteredContacts.length === 0 ? (
                    <EmptyCard 
                        imgSrc="/src/assets/img/noData.png"
                        message={
                            searchQuery || selectedCategory !== 'Alle'
                                ? "Keine Kontakte gefunden"
                                : "Noch keine Kontakte vorhanden"
                        }
                        isSearch={!!(searchQuery || selectedCategory !== 'Alle')}
                    />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredContacts.map(contact => (
                            <ContactCard
                                key={contact._id}
                                contact={contact}
                                onEdit={handleEditContact}
                                onDelete={handleDeleteContact}
                                onPin={handlePinContact}
                                onUpdateLastContact={handleUpdateLastContact}
                            />
                        ))}
                    </div>
                )}

                {/* Add/Edit Modal */}
                <AddEditContact
                    isOpen={showAddEditModal}
                    onClose={() => {
                        setShowAddEditModal(false);
                        setContactToEdit(null);
                    }}
                    onSave={handleSaveContact}
                    contact={contactToEdit}
                />                {/* Toast Message */}
                <Toast
                    isShown={showToast}
                    onClose={() => setShowToast(false)}
                    message={toastMessage}
                    type={toastType}                />
            </div>
        </Layout>
    );
};

export default Contacts;
