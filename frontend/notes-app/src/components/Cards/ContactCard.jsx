import React, { useState } from 'react';
import moment from 'moment';
import 'moment/locale/de';
import { MdOutlinePushPin, MdPushPin, MdCreate, MdDelete, MdEmail, MdPhone, MdLocationOn, MdBusiness, MdDateRange } from 'react-icons/md';

moment.locale('de');

const ContactCard = ({ contact, onEdit, onDelete, onPin, onUpdateLastContact }) => {
    const [showFullNotes, setShowFullNotes] = useState(false);

    const handleEmailClick = () => {
        if (contact.email) {
            window.open(`mailto:${contact.email}`, '_blank');
            onUpdateLastContact(contact._id);
        }
    };

    const handlePhoneClick = (phoneNumber) => {
        if (phoneNumber) {
            window.open(`tel:${phoneNumber}`, '_blank');
            onUpdateLastContact(contact._id);
        }
    };

    const getCategoryColor = (category) => {
        const colors = {
            'Vereine': 'bg-blue-100 text-blue-800',
            'Schiedsrichter': 'bg-yellow-100 text-yellow-800',
            'Verbände': 'bg-green-100 text-green-800',
            'Sponsoren': 'bg-purple-100 text-purple-800',
            'Medien': 'bg-red-100 text-red-800',
            'Sonstige': 'bg-gray-100 text-gray-800'
        };
        return colors[category] || colors['Sonstige'];
    };

    const getFullAddress = () => {
        const { street, city, postalCode, country } = contact.address || {};
        const parts = [street, `${postalCode} ${city}`, country].filter(Boolean);
        return parts.join(', ');
    };

    const truncateNotes = (notes, maxLength = 100) => {
        if (!notes || notes.length <= maxLength) return notes;
        return notes.substring(0, maxLength) + '...';
    };

    return (
        <div className={`p-4 border rounded-lg hover:shadow-md transition-all duration-200 ${
            contact.isPinned ? 'border-orange-300 bg-orange-50' : 'border-gray-200 bg-white'
        }`}>
            {/* Header mit Name und Pin-Button */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {contact.name}
                    </h3>
                    {contact.organization && (
                        <div className="flex items-center mt-1 text-sm text-gray-600">
                            <MdBusiness className="w-4 h-4 mr-1 flex-shrink-0" />
                            <span className="truncate">{contact.organization}</span>
                        </div>
                    )}
                    {contact.position && (
                        <p className="text-sm text-gray-500 truncate">{contact.position}</p>
                    )}
                </div>
                
                <button
                    onClick={() => onPin(contact._id, !contact.isPinned)}
                    className={`ml-2 p-1 rounded hover:bg-gray-100 transition-colors ${
                        contact.isPinned ? 'text-orange-500' : 'text-gray-400'
                    }`}
                    title={contact.isPinned ? 'Nicht mehr anpinnen' : 'Anpinnen'}
                >
                    {contact.isPinned ? <MdPushPin className="w-5 h-5" /> : <MdOutlinePushPin className="w-5 h-5" />}
                </button>
            </div>

            {/* Kategorie Badge */}
            <div className="mb-3">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(contact.category)}`}>
                    {contact.category}
                </span>
            </div>

            {/* Kontaktinformationen */}
            <div className="space-y-2 mb-3">
                {contact.email && (
                    <div className="flex items-center">
                        <MdEmail className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                        <button
                            onClick={handleEmailClick}
                            className="text-sm text-blue-600 hover:text-blue-800 truncate"
                        >
                            {contact.email}
                        </button>
                    </div>
                )}
                
                {contact.phone && (
                    <div className="flex items-center">
                        <MdPhone className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                        <button
                            onClick={() => handlePhoneClick(contact.phone)}
                            className="text-sm text-blue-600 hover:text-blue-800"
                        >
                            {contact.phone}
                        </button>
                    </div>
                )}
                
                {contact.mobile && (
                    <div className="flex items-center">
                        <MdPhone className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                        <button
                            onClick={() => handlePhoneClick(contact.mobile)}
                            className="text-sm text-blue-600 hover:text-blue-800"
                        >
                            {contact.mobile} (Mobil)
                        </button>
                    </div>
                )}

                {getFullAddress() && (
                    <div className="flex items-start">
                        <MdLocationOn className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-600 leading-5">{getFullAddress()}</span>
                    </div>
                )}
            </div>

            {/* Tags */}
            {contact.tags && contact.tags.length > 0 && (
                <div className="mb-3">
                    <div className="flex flex-wrap gap-1">
                        {contact.tags.map((tag, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Notizen */}
            {contact.notes && (
                <div className="mb-3">
                    <div className="text-sm text-gray-600 leading-5">
                        {showFullNotes ? contact.notes : truncateNotes(contact.notes)}
                        {contact.notes.length > 100 && (
                            <button
                                onClick={() => setShowFullNotes(!showFullNotes)}
                                className="ml-1 text-blue-600 hover:text-blue-800 font-medium"
                            >
                                {showFullNotes ? 'weniger' : 'mehr'}
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Letzter Kontakt */}
            {contact.lastContactDate && (
                <div className="flex items-center mb-3 text-xs text-gray-500">
                    <MdDateRange className="w-4 h-4 mr-1" />
                    <span>Letzter Kontakt: {moment(contact.lastContactDate).format('DD.MM.YYYY')}</span>
                </div>
            )}

            {/* Aktionen */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="text-xs text-gray-500">
                    {moment(contact.updatedAt).format('DD.MM.YYYY, HH:mm')}
                </div>
                
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => onEdit(contact)}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Bearbeiten"
                    >
                        <MdCreate className="w-4 h-4" />
                    </button>
                    
                    <button
                        onClick={() => onDelete(contact._id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        title="Löschen"
                    >
                        <MdDelete className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ContactCard;
