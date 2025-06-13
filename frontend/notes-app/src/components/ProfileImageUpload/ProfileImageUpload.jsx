import React, { useState, useRef } from 'react';
import { FaCamera, FaTrash } from 'react-icons/fa';
import { uploadProfileImage, deleteProfileImage, getProfileImageUrl } from '../../utils/playerService';

const ProfileImageUpload = ({ playerId, currentImage, onImageUpdate }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);
    
    // Bild-URL mit Timestamp für Cache-Vermeidung
    const getImageUrl = () => {
        if (!currentImage) return null;
        return `${getProfileImageUrl(playerId)}?t=${new Date().getTime()}`;
    };

    // Trigger File-Input Dialog
    const handleSelectImage = () => {
        fileInputRef.current.click();
    };

    // Bild-Upload
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Nur Bilder erlauben
        if (!file.type.startsWith('image/')) {
            setError('Bitte wählen Sie eine Bilddatei aus.');
            return;
        }

        // Maximale Dateigröße: 5MB
        if (file.size > 5 * 1024 * 1024) {
            setError('Das Bild darf maximal 5MB groß sein.');
            return;
        }

        try {
            setIsUploading(true);
            setError(null);
            
            const response = await uploadProfileImage(playerId, file);
            
            if (response.success) {
                // Callback zur Information des Elternkomponenten
                if (onImageUpdate) {
                    onImageUpdate(response.profileImage);
                }
            }
        } catch (err) {
            setError('Fehler beim Hochladen des Bildes. Bitte versuchen Sie es später erneut.');
            console.error('Fehler beim Bildupload:', err);
        } finally {
            setIsUploading(false);
            // Zurücksetzen des File-Inputs, um erneutes Hochladen der gleichen Datei zu ermöglichen
            e.target.value = '';
        }
    };

    // Bild löschen
    const handleDeleteImage = async () => {
        if (!currentImage) return;

        if (!window.confirm('Möchten Sie das Profilbild wirklich löschen?')) {
            return;
        }

        try {
            setIsUploading(true);
            setError(null);
            
            const response = await deleteProfileImage(playerId);
            
            if (response.success) {
                // Callback zur Information des Elternkomponenten
                if (onImageUpdate) {
                    onImageUpdate('');
                }
            }
        } catch (err) {
            setError('Fehler beim Löschen des Bildes. Bitte versuchen Sie es später erneut.');
            console.error('Fehler beim Bildlöschen:', err);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="profile-image-upload">
            {/* Verstecktes File-Input-Element */}
            <input 
                type="file" 
                ref={fileInputRef} 
                style={{ display: 'none' }} 
                accept="image/*" 
                onChange={handleImageUpload}
            />            {/* Profilbild oder Platzhalter */}
            <div className="relative w-24 h-24 bg-white rounded-full shadow-lg overflow-hidden">
                {currentImage ? (
                    <img 
                        src={getImageUrl()} 
                        alt="Profilbild" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.onerror = null; 
                            e.target.src = '/default-avatar.png'; // Platzhalter bei Fehlern
                        }}
                    />
                ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 text-3xl font-bold">
                            {playerId && playerId.charAt(0).toUpperCase()}
                        </span>
                    </div>
                )}

                {/* Aktionsbuttons - zentriert */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black bg-opacity-30">
                    <div className="flex gap-2">
                        <button 
                            className="bg-blue-500 text-white p-2 rounded-full shadow-md hover:bg-blue-600 transition-colors"
                            onClick={handleSelectImage}
                            disabled={isUploading}
                            title="Bild hochladen"
                        >
                            <FaCamera size={14} />
                        </button>
                        {currentImage && (
                            <button 
                                className="bg-red-500 text-white p-2 rounded-full shadow-md hover:bg-red-600 transition-colors"
                                onClick={handleDeleteImage}
                                disabled={isUploading}
                                title="Bild löschen"
                            >
                                <FaTrash size={14} />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Ladeindikator */}
            {isUploading && (
                <div className="mt-2 text-sm text-gray-500">
                    Wird hochgeladen...
                </div>
            )}

            {/* Fehleranzeige */}
            {error && (
                <div className="mt-2 text-sm text-red-500">
                    {error}
                </div>
            )}
        </div>
    );
};

export default ProfileImageUpload;
