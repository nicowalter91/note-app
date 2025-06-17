import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import ContactCard from '../../components/Cards/ContactCard';
import AddEditContact from '../../components/Cards/AddEditContact';
import SearchBar from '../../components/SearchBar/SearchBar';
import EmptyCard from '../../components/EmptyCard/EmptyCard';
import Toast from '../../components/ToastMessage/Toast';
import { MdAdd, MdFilterList, MdClear, MdContacts } from 'react-icons/md';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { 
    getAllContacts, 
    addContact, 
    editContact, 
    deleteContact, 
    updateContactPinned,
    updateLastContactDate 
} from '../../utils/contactService';
import axiosInstance from '../../utils/axiosInstance';

// Import Design System Components
import {
  PageHeader,
  Card,
  Button,
  Badge,
  LoadingSpinner,
  EmptyState,
  StatsGrid
} from '../../components/UI/DesignSystem';

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
            <div className="min-h-screen bg-gray-50 p-6">
                {/* Page Header */}
                <PageHeader
                    title="Kontakte"
                    subtitle="Verwalten Sie Ihre Kontakte für Testspiele, Verbände und mehr"
                    icon={MdContacts}
                    action={
                        <Button
                            onClick={handleAddContact}
                            variant="primary"
                            icon={MdAdd}
                        >
                            Neuer Kontakt
                        </Button>
                    }
                />

                {/* Loading State */}
                {isLoading && <LoadingSpinner text="Lade Kontakte..." />}

                {/* Statistics Grid */}
                {!isLoading && contacts.length > 0 && (
                    <div className="mb-6">
                        <StatsGrid
                            stats={[
                                {
                                    icon: MdContacts,
                                    value: stats.total,
                                    label: 'Gesamt Kontakte'
                                },
                                {
                                    icon: MdFilterList,
                                    value: stats.pinned,
                                    label: 'Angepinnt'
                                },
                                {
                                    icon: MdContacts,
                                    value: stats.byCategory['Vereine'] || 0,
                                    label: 'Vereine'
                                },
                                {
                                    icon: MdContacts,
                                    value: stats.byCategory['Schiedsrichter'] || 0,
                                    label: 'Schiedsrichter'
                                }
                            ]}
                        />
                    </div>
                )}

                {/* Search and Filters */}
                <Card className="mb-6">
                    <div className="space-y-4">
                        {/* Search Bar */}
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Kontakte durchsuchen..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <FaTimes />
                                </button>
                            )}
                        </div>

                        {/* Category Filters */}
                        <div className="flex flex-wrap gap-2 items-center">
                            <span className="text-sm text-gray-500 mr-2">Kategorien:</span>
                            
                            {categories.map(category => (
                                <Badge
                                    key={category}
                                    variant={selectedCategory === category ? 'primary' : 'secondary'}
                                    onClick={() => setSelectedCategory(category)}
                                    className="cursor-pointer"
                                >
                                    {category}
                                    {category !== 'Alle' && (
                                        <span className="ml-1">
                                            ({stats.byCategory[category] || 0})
                                        </span>
                                    )}
                                    {category === 'Alle' && (
                                        <span className="ml-1">({stats.total})</span>
                                    )}
                                </Badge>
                            ))}

                            {(searchQuery || selectedCategory !== 'Alle') && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleClearFilters}
                                    icon={MdClear}
                                >
                                    Filter löschen
                                </Button>
                            )}
                        </div>

                        {/* Results Info */}
                        <div className="text-sm text-gray-600">
                            {filteredContacts.length} von {contacts.length} Kontakten
                            {searchQuery && ` für "${searchQuery}"`}
                            {selectedCategory !== 'Alle' && ` in Kategorie "${selectedCategory}"`}
                        </div>
                    </div>
                </Card>

                {/* Content */}
                {!isLoading && filteredContacts.length === 0 ? (
                    <EmptyState
                        icon={FaSearch}
                        title={
                            searchQuery || selectedCategory !== 'Alle'
                                ? "Keine Kontakte gefunden"
                                : "Noch keine Kontakte vorhanden"
                        }
                        description={
                            searchQuery || selectedCategory !== 'Alle'
                                ? "Versuchen Sie Ihre Suche anzupassen oder Filter zu ändern."
                                : "Erstellen Sie Ihren ersten Kontakt, um zu beginnen."
                        }
                        action={
                            <Button
                                variant="primary"
                                icon={MdAdd}
                                onClick={handleAddContact}
                            >
                                Ersten Kontakt erstellen
                            </Button>
                        }
                    />
                ) : !isLoading && (
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
                />

                {/* Toast Message */}
                <Toast
                    isShown={showToast}
                    onClose={() => setShowToast(false)}
                    message={toastMessage}
                    type={toastType}
                />
            </div>
        </Layout>
    );
};

export default Contacts;
