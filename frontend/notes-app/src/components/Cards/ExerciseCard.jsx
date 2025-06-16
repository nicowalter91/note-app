import React, { useState } from 'react';
import moment from 'moment';
import { MdOutlinePushPin } from 'react-icons/md';
import Modal from 'react-modal'; 
import { FaPen, FaTrashAlt, FaTimes } from 'react-icons/fa';

// ExerciseCard-Komponente: Eine Komponente zur Darstellung einer Übungskarte
const ExerciseCard = ({ exerciseData, onEdit, onDelete, onPinExercise }) => {
    // Zustand für das Modal
    const [isModalOpen, setIsModalOpen] = useState(false);    // Extrahiere Exercise-Daten
    const { title, organisation, durchfuehrung, coaching, variante, tags, category, image, date, isPinned } = exerciseData || {};

    // Kategorie-Farben für bessere visuelle Unterscheidung
    const getCategoryColor = (category) => {
        const colors = {
            'Technik': 'bg-blue-100 text-blue-800',
            'Taktik': 'bg-green-100 text-green-800',
            'Kondition': 'bg-red-100 text-red-800',
            'Koordination': 'bg-purple-100 text-purple-800',
            'Torwart': 'bg-yellow-100 text-yellow-800',
            'Aufwärmen': 'bg-orange-100 text-orange-800',
            'Abschluss': 'bg-pink-100 text-pink-800',
            'Passspiel': 'bg-cyan-100 text-cyan-800',
            'Verteidigung': 'bg-gray-100 text-gray-800',
            'Angriff': 'bg-emerald-100 text-emerald-800',
            'Standards': 'bg-indigo-100 text-indigo-800',
            'Spielformen': 'bg-teal-100 text-teal-800',
            'Allgemein': 'bg-slate-100 text-slate-800'
        };
        return colors[category] || 'bg-gray-100 text-gray-800';
    };// Öffnet das Modal mit dem gesamten Inhalt der Karte
    const openModal = () => {
        console.log('Opening modal for exercise:', exerciseData);
        setIsModalOpen(true);
    };

    // Schließt das Modal
    const closeModal = () => {
        setIsModalOpen(false);
    };

    // Prevent event propagation when clicking on action buttons
    const handleActionClick = (e, action) => {
        e.stopPropagation();
        action();
    };    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden w-full">
            <div className="cursor-pointer" onClick={openModal}>
                {/* Horizontal Layout: Image Left, Content Right */}
                <div className="flex flex-col sm:flex-row min-h-[200px]">
                    {/* Image Section - Left Side */}
                    <div className="flex-shrink-0 w-full sm:w-64 md:w-72 lg:w-80 h-48 sm:h-auto bg-gray-100 overflow-hidden">
                        {image ? (
                            <img 
                                src={`http://localhost:8000/uploads/exercises/${image}`} 
                                alt={title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                                <span className="text-blue-500 text-4xl sm:text-5xl md:text-6xl font-bold">
                                    {title ? title.charAt(0).toUpperCase() : 'Ü'}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Content Section - Right Side */}
                    <div className="flex-1 p-4 sm:p-6 flex flex-col justify-between min-h-[200px]">
                        <div>
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1 pr-2">
                                    <h3 className="text-xl font-semibold text-gray-800 line-clamp-2 mb-2">
                                        {title || 'Unbenannte Übung'}
                                    </h3>
                                    
                                    {/* Category Badge */}
                                    <div className="mb-3">
                                        <span className={`text-sm px-3 py-1 rounded-full font-medium ${getCategoryColor(category)}`}>
                                            {category || 'Allgemein'}
                                        </span>
                                    </div>
                                </div>
                                
                                <button
                                    onClick={(e) => handleActionClick(e, onPinExercise)}
                                    className={`ml-2 p-2 rounded-full transition-colors ${
                                        isPinned 
                                            ? 'text-yellow-500 hover:text-yellow-600 bg-yellow-50' 
                                            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    <MdOutlinePushPin className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-3">
                                <p className="text-sm text-gray-600 line-clamp-2">
                                    <span className="font-medium">Organisation:</span> {organisation || 'Keine Organisation angegeben'}
                                </p>
                                
                                {durchfuehrung && (
                                    <p className="text-sm text-gray-600 line-clamp-3">
                                        <span className="font-medium">Durchführung:</span> {durchfuehrung}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="mt-4">
                            {/* Tags */}
                            {tags && tags.length > 0 && (
                                <div className="mb-3 flex flex-wrap gap-1">
                                    {tags.slice(0, 4).map((tag, index) => (
                                        <span
                                            key={index}
                                            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                    {tags.length > 4 && (
                                        <span className="text-xs text-gray-500 px-2 py-1">
                                            +{tags.length - 4} mehr
                                        </span>
                                    )}
                                </div>
                            )}

                            {/* Date and Action Buttons */}
                            <div className="flex items-center justify-between">
                                <p className="text-xs text-gray-500">
                                    {moment(date).format('DD.MM.YYYY')}
                                </p>
                                
                                <div className="flex gap-2">
                                    <button
                                        onClick={(e) => handleActionClick(e, onEdit)}
                                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                        title="Bearbeiten"
                                    >
                                        <FaPen className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={(e) => handleActionClick(e, onDelete)}
                                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                        title="Löschen"
                                    >
                                        <FaTrashAlt className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>{/* Modal für Exercise Details */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                shouldCloseOnOverlayClick={true}
                shouldCloseOnEsc={true}
                style={{
                    content: {
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        maxWidth: '90vw',
                        width: '800px',
                        maxHeight: '90vh',
                        overflow: 'auto',
                        borderRadius: '16px',
                        border: 'none',
                        padding: '0',
                        backgroundColor: 'white',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                        zIndex: 1000
                    },
                    overlay: {
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.75)',
                        zIndex: 1000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }
                }}
            >
                {/* Modal Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {title || 'Übung Details'}
                    </h2>
                    <button
                        onClick={closeModal}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <FaTimes className="w-5 h-5 text-gray-500" />
                    </button>
                </div>                {/* Modal Content */}
                <div className="p-4 sm:p-6">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
                        {/* Left Column - Image */}
                        <div className="space-y-4 order-2 xl:order-1">
                            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                                {image ? (
                                    <img 
                                        src={`http://localhost:8000/uploads/exercises/${image}`} 
                                        alt={title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                                        <span className="text-blue-500 text-6xl sm:text-8xl font-bold">
                                            {title ? title.charAt(0).toUpperCase() : 'Ü'}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Tags Section */}
                            {tags && tags.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">🏷️ Tags:</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>                        {/* Right Column - Exercise Details */}
                        <div className="space-y-4 order-1 xl:order-2">                            <div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                    {title || 'Unbenannte Übung'}
                                </h3>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className={`text-sm px-3 py-1 rounded-full font-medium ${getCategoryColor(category)}`}>
                                        {category || 'Allgemein'}
                                    </span>
                                    <p className="text-sm text-gray-500">
                                        Erstellt am {moment(date).format('DD.MM.YYYY')}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                        📋 Organisation
                                    </h4>
                                    <p className="text-gray-700 leading-relaxed">
                                        {organisation || 'Nicht angegeben'}
                                    </p>
                                </div>

                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                        ⚽ Durchführung
                                    </h4>
                                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                                        {durchfuehrung || 'Nicht angegeben'}
                                    </p>
                                </div>

                                <div className="bg-green-50 p-4 rounded-lg">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                        🎯 Coaching
                                    </h4>
                                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                                        {coaching || 'Nicht angegeben'}
                                    </p>
                                </div>

                                <div className="bg-yellow-50 p-4 rounded-lg">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                                        🔄 Variante
                                    </h4>
                                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                                        {variante || 'Nicht angegeben'}
                                    </p>
                                </div>
                            </div>

                            {/* Action Buttons in Modal */}
                            <div className="flex gap-3 pt-4 border-t border-gray-200">
                                <button
                                    onClick={() => {
                                        closeModal();
                                        onEdit();
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <FaPen className="w-4 h-4" />
                                    Bearbeiten
                                </button>
                                <button
                                    onClick={() => {
                                        closeModal();
                                        onDelete();
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    <FaTrashAlt className="w-4 h-4" />
                                    Löschen
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ExerciseCard;
