import React, { useState } from 'react';
import moment from 'moment';
import { MdOutlinePushPin } from 'react-icons/md';
import Modal from 'react-modal'; 
import { FaPen, FaTrashAlt, FaTimes, FaStar, FaPlus } from 'react-icons/fa';

// ExerciseCard-Komponente: Eine Komponente zur Darstellung einer Übungskarte
const ExerciseCard = ({ 
  exerciseData, 
  onEdit, 
  onDelete, 
  onPinExercise, 
  viewMode = 'grid',
  isSelected = false,
  onToggleSelect = () => {},
  isFavorite = false,
  onToggleFavorite = () => {}
}) => {
    // Zustand für das Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Extrahiere Exercise-Daten
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
    };

    // Öffnet das Modal mit dem gesamten Inhalt der Karte
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
    };

    // Kategorie-Emoji-Mapping
    const getCategoryEmoji = (category) => {
        const emojis = {
            'Allgemein': '📋', 'Technik': '⚽', 'Taktik': '🧠', 'Kondition': '💪', 'Koordination': '🤸',
            'Torwart': '🥅', 'Aufwärmen': '🏃', 'Abschluss': '🎯', 'Passspiel': '👥', 'Verteidigung': '🛡️',
            'Angriff': '⚡', 'Standards': '📐', 'Spielformen': '🎮'
        };
        return emojis[category] || '📋';
    };

    // Rückgabe der Kartenansicht basierend auf dem viewMode
    if (viewMode === 'list') {
        // Listenansicht
        return (
            <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden w-full">
                <div className="cursor-pointer p-4" onClick={openModal}>
                    <div className="flex items-center gap-3">
                        {/* Image Thumbnail */}
                        <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden">
                            {image ? (
                                <img 
                                    src={`http://localhost:8000/uploads/exercises/${image}`} 
                                    alt={title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                                    <span className="text-blue-500 text-xl font-bold">
                                        {title ? title.charAt(0).toUpperCase() : 'Ü'}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-base font-semibold text-gray-800 line-clamp-1">
                                        {title || 'Unbenannte Übung'}
                                    </h3>
                                    <div className="flex items-center mt-1 space-x-2">
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${getCategoryColor(category)}`}>
                                            {getCategoryEmoji(category)} {category || 'Allgemein'}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {moment(date).format('DD.MM.YYYY')}
                                        </span>
                                    </div>
                                </div>                                <div className="flex items-center gap-2">
                                    {isPinned && (
                                        <MdOutlinePushPin className="text-yellow-500 w-4 h-4" />
                                    )}
                                </div>
                                <div className="flex">
                                    <button
                                        onClick={(e) => handleActionClick(e, onEdit)}
                                        className="p-1.5 text-gray-500 hover:text-blue-600 rounded-full transition-colors"
                                        title="Bearbeiten"
                                    >
                                        <FaPen className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        onClick={(e) => handleActionClick(e, onDelete)}
                                        className="p-1.5 text-gray-500 hover:text-red-600 rounded-full transition-colors"
                                        title="Löschen"
                                    >
                                        <FaTrashAlt className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        onClick={(e) => handleActionClick(e, onToggleFavorite)}
                                        className={`p-1.5 transition-colors ${
                                            isFavorite                                                    ? 'text-amber-500 hover:text-amber-600' 
                                                : 'text-gray-400 hover:text-amber-500'
                                        } rounded-full`}
                                        title={isFavorite ? "Aus Favoriten entfernen" : "Zu Favoriten hinzufügen"}
                                    >
                                        <FaStar className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        onClick={(e) => handleActionClick(e, onToggleSelect)}
                                        className={`p-1.5 transition-colors ${
                                            isSelected                                                    ? 'text-blue-500 hover:text-blue-600' 
                                                : 'text-gray-400 hover:text-blue-500'
                                        } rounded-full`}
                                        title={isSelected ? "Aus Auswahl entfernen" : "Zur Auswahl hinzufügen"}
                                    >
                                        <FaPlus className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        onClick={(e) => handleActionClick(e, onPinExercise)}
                                        className={`p-1.5 rounded-full transition-colors ${
                                            isPinned                                                    ? 'text-yellow-500 hover:text-yellow-600' 
                                                : 'text-gray-400 hover:text-gray-600'
                                        }`}
                                        title={isPinned ? "Loslösen" : "Anpinnen"}
                                    >
                                        <MdOutlinePushPin className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                            
                            {/* Organisation */}
                            <p className="text-xs text-gray-600 line-clamp-1 mt-1">
                                {organisation || 'Keine Organisation angegeben'}
                            </p>
                            
                            {/* Tags */}
                            {tags && tags.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-1">
                                    {tags.slice(0, 3).map((tag, index) => (
                                        <span
                                            key={index}
                                            className="bg-blue-50 text-blue-700 text-xs px-1.5 py-0.5 rounded-full"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                    {tags.length > 3 && (
                                        <span className="text-xs text-gray-500 px-1 py-0.5">
                                            +{tags.length - 3}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>                {/* Modal für Exercise Details - gleich wie in der Gridansicht */}
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
                            borderRadius: '12px',
                            border: 'none',
                            padding: '0',
                            backgroundColor: 'white',
                            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
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
                >                    {/* Modal Content - gleich wie in der Gridansicht */}
                    <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-white">
                        <h2 className="text-xl font-bold text-gray-800">
                            {title || 'Übung Details'}
                        </h2>
                        <button
                            onClick={closeModal}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <FaTimes className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>                    <div className="p-4 sm:p-6">
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
                            {/* Left Column - Image */}
                            <div className="space-y-4 order-2 xl:order-1">
                                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden shadow-sm">
                                    {image ? (
                                        <img 
                                            src={`http://localhost:8000/uploads/exercises/${image}`} 
                                            alt={title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                            <span className="text-gray-500 text-6xl sm:text-8xl font-bold">
                                                {title ? title.charAt(0).toUpperCase() : 'Ü'}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Tags Section */}
                                {tags && tags.length > 0 && (
                                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                        <h4 className="text-sm font-medium text-gray-700 mb-2">Tags</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {tags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            {/* Right Column - Exercise Details */}
                            <div className="space-y-4 order-1 xl:order-2">
                                <div>
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

                                <div className="space-y-4">
                                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                        <h4 className="text-sm font-semibold text-gray-700 mb-2">
                                            Organisation
                                        </h4>
                                        <p className="text-gray-700 leading-relaxed text-sm">
                                            {organisation || 'Nicht angegeben'}
                                        </p>
                                    </div>

                                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                        <h4 className="text-sm font-semibold text-gray-700 mb-2">
                                            Durchführung
                                        </h4>
                                        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm">
                                            {durchfuehrung || 'Nicht angegeben'}
                                        </p>
                                    </div>

                                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                        <h4 className="text-sm font-semibold text-gray-700 mb-2">
                                            Coaching
                                        </h4>
                                        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm">
                                            {coaching || 'Nicht angegeben'}
                                        </p>
                                    </div>

                                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                        <h4 className="text-sm font-semibold text-gray-700 mb-2">
                                            Variante
                                        </h4>
                                        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm">
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
                                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                    >
                                        <FaPen className="w-4 h-4" />
                                        Bearbeiten
                                    </button>
                                    <button
                                        onClick={() => {
                                            closeModal();
                                            onDelete();
                                        }}
                                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-red-600 rounded-lg transition-colors"
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
    }    // Standard-Gridansicht (default)
    return (
        <div className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden w-full h-[400px] flex flex-col ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
            <div className="cursor-pointer flex-1 flex flex-col" onClick={openModal}>
                {/* Card Layout */}
                <div className="flex flex-col h-full">                    {/* Image Section - Top */}
                    <div className="h-40 bg-gray-100 overflow-hidden relative">
                        {image ? (
                            <img 
                                src={`http://localhost:8000/uploads/exercises/${image}`} 
                                alt={title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                                <span className="text-blue-500 text-4xl font-bold">
                                    {title ? title.charAt(0).toUpperCase() : 'Ü'}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 p-3 flex flex-col">                        <div>
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex-1 pr-2">
                                    <h3 className="text-base font-semibold text-gray-800 mb-1.5 line-clamp-2 leading-tight min-h-[40px]">
                                        {title || 'Unbenannte Übung'}
                                    </h3>
                                    
                                    {/* Category Badge */}
                                    <div className="mb-2">
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getCategoryColor(category)}`}>
                                            {getCategoryEmoji(category)} {category || 'Allgemein'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="text-xs text-gray-600">
                                    <p className="font-medium mb-0.5">Organisation:</p>
                                    <p className="leading-normal line-clamp-2 text-[11px]">{organisation || 'Keine Organisation angegeben'}</p>
                                </div>
                                
                                {durchfuehrung && (
                                    <div className="text-xs text-gray-600">
                                        <p className="font-medium mb-0.5">Durchführung:</p>
                                        <p className="leading-normal line-clamp-2 text-[11px]">{durchfuehrung}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        <div className="mt-auto">
                            {/* Tags */}
                            {tags && tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-2 min-h-[22px]">
                                    {tags.slice(0, 3).map((tag, index) => (
                                        <span
                                            key={index}
                                            className="bg-blue-50 text-blue-700 text-[10px] px-1.5 py-0.5 rounded-full"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                    {tags.length > 3 && (
                                        <span className="text-[10px] text-gray-500 px-1 py-0.5">
                                            +{tags.length - 3}
                                        </span>
                                    )}
                                </div>
                            )}

                            {/* Date and Action Buttons */}                            <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                                <p className="text-[10px] text-gray-500 font-medium">
                                    {moment(date).format('DD.MM.YYYY')}
                                </p>
                                
                                <div className="flex gap-1">
                                    <button
                                        onClick={(e) => handleActionClick(e, onEdit)}
                                        className="p-1 text-gray-500 hover:text-blue-600 rounded-full transition-colors"
                                        title="Bearbeiten"
                                    >
                                        <FaPen className="w-3 h-3" />
                                    </button>
                                    <button
                                        onClick={(e) => handleActionClick(e, onDelete)}
                                        className="p-1 text-gray-500 hover:text-red-600 rounded-full transition-colors"
                                        title="Löschen"
                                    >
                                        <FaTrashAlt className="w-3 h-3" />
                                    </button>
                                    <button
                                        onClick={(e) => handleActionClick(e, onToggleFavorite)}
                                        className={`p-1 transition-colors ${
                                            isFavorite 
                                                ? 'text-amber-500 hover:text-amber-600' 
                                                : 'text-gray-500 hover:text-amber-500'
                                        } rounded-full`}
                                        title={isFavorite ? "Aus Favoriten entfernen" : "Zu Favoriten hinzufügen"}
                                    >
                                        <FaStar className="w-3 h-3" />
                                    </button>
                                    <button
                                        onClick={(e) => handleActionClick(e, onToggleSelect)}
                                        className={`p-1 transition-colors ${
                                            isSelected 
                                                ? 'text-blue-500 hover:text-blue-600' 
                                                : 'text-gray-500 hover:text-blue-500'
                                        } rounded-full`}
                                        title={isSelected ? "Aus Auswahl entfernen" : "Zur Auswahl hinzufügen"}
                                    >
                                        <FaPlus className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>            {/* Modal für Exercise Details */}
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
                        borderRadius: '12px',
                        border: 'none',
                        padding: '0',
                        backgroundColor: 'white',
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
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
            >                {/* Modal Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-white">
                    <h2 className="text-xl font-bold text-gray-800">
                        {title || 'Übung Details'}
                    </h2>
                    <div className="flex items-center gap-3">                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onToggleFavorite();
                                    }}
                                    className={`p-1.5 transition-colors ${
                                        isFavorite 
                                            ? 'text-amber-500 hover:text-amber-600' 
                                            : 'text-gray-400 hover:text-amber-500'
                                    }`}
                                    title={isFavorite ? "Aus Favoriten entfernen" : "Zu Favoriten hinzufügen"}
                                >
                                    <FaStar className="w-3.5 h-3.5" />
                                </button>                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onToggleSelect();
                                    }}
                                    className={`p-1.5 transition-colors ${
                                        isSelected 
                                            ? 'text-blue-500 hover:text-blue-600' 
                                            : 'text-gray-400 hover:text-blue-500'
                                    }`}
                                    title={isSelected ? "Aus Auswahl entfernen" : "Zur Auswahl hinzufügen"}
                                >
                                    <FaPlus className="w-3.5 h-3.5" />
                                </button>
                        <button
                            onClick={closeModal}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <FaTimes className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>
                </div>
                
                {/* Modal Content */}                <div className="p-4 sm:p-6">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
                        {/* Left Column - Image */}
                        <div className="space-y-4 order-2 xl:order-1">
                            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden shadow-sm">
                                {image ? (
                                    <img 
                                        src={`http://localhost:8000/uploads/exercises/${image}`} 
                                        alt={title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                        <span className="text-gray-500 text-6xl sm:text-8xl font-bold">
                                            {title ? title.charAt(0).toUpperCase() : 'Ü'}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Tags Section */}
                            {tags && tags.length > 0 && (
                                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Tags</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full"
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

                            <div className="space-y-4">
                                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-2">
                                        Organisation
                                    </h4>
                                    <p className="text-gray-700 leading-relaxed text-sm">
                                        {organisation || 'Nicht angegeben'}
                                    </p>
                                </div>

                                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-2">
                                        Durchführung
                                    </h4>
                                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm">
                                        {durchfuehrung || 'Nicht angegeben'}
                                    </p>
                                </div>

                                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-2">
                                        Coaching
                                    </h4>
                                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm">
                                        {coaching || 'Nicht angegeben'}
                                    </p>
                                </div>

                                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-2">
                                        Variante
                                    </h4>
                                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm">
                                        {variante || 'Nicht angegeben'}
                                    </p>
                                </div>
                            </div>                            {/* Action Buttons in Modal */}
                            <div className="flex gap-3 pt-4 border-t border-gray-200">
                                <button
                                    onClick={() => {
                                        closeModal();
                                        onEdit();
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    <FaPen className="w-4 h-4" />
                                    Bearbeiten
                                </button>
                                <button
                                    onClick={() => {
                                        closeModal();
                                        onDelete();
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-red-600 rounded-lg transition-colors"
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
