import React, { useState } from 'react';
import Modal from 'react-modal';
import { FaTimes } from 'react-icons/fa';
import DrawingCanvas from './DrawingCanvas';

const DrawingModal = ({ isOpen, onClose, onSave }) => {
  const handleSaveDrawing = async (dataUrl) => {
    try {
      // Konvertiere Base64-String in Blob
      const fetchResponse = await fetch(dataUrl);
      const blob = await fetchResponse.blob();
      
      // Erstelle FormData für Upload
      const formData = new FormData();
      formData.append('drawing', blob, 'drawing.png');
      
      // Sende zum Server
      const response = await fetch('http://localhost:8000/api/exercises/upload-drawing', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Fehler beim Upload der Zeichnung');
      }
      
      const data = await response.json();
      onSave(data.filename);
      onClose();
    } catch (error) {
      console.error('Fehler beim Speichern der Zeichnung:', error);
      alert('Die Zeichnung konnte nicht gespeichert werden. Bitte versuchen Sie es erneut.');
    }
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Übung zeichnen"
      style={{
        content: {
          position: 'fixed',
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          width: '90vw',
          height: '80vh',
          maxWidth: '1000px',
          padding: '0',
          border: 'none',
          borderRadius: '8px',
          backgroundColor: '#fff',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          overflow: 'hidden',
        },
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          zIndex: 1000,
        }
      }}
    >
      <DrawingCanvas onSave={handleSaveDrawing} onCancel={onClose} />
    </Modal>
  );
};

export default DrawingModal;
