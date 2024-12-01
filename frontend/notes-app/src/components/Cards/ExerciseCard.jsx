import React, { useState } from 'react';
import moment from 'moment';
import { MdOutlinePushPin, MdAdd } from 'react-icons/md';
import { MdCreate, MdDelete, MdClose } from 'react-icons/md'; // Close-Icon für das Modal
import Modal from 'react-modal'; // Modal importieren
import Example from '../../assets/img/example.png'; // Beispielbild

// NoteCard-Komponente: Eine Komponente zur Darstellung einer Notizkarte
const NoteCard = ({ title, date, content, isPinned, onEdit, onDelete, onPinNote, onAddExercise }) => {
    // Zustand für das Modal
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Öffnet das Modal mit dem gesamten Inhalt der Karte
    const openModal = () => {
        setIsModalOpen(true);
    };

    // Schließt das Modal
    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="flex gap-4">
            {/* Die reguläre NoteCard */}
            <div
                className="border rounded p-4 bg-white hover:shadow-xl transition-all ease-out w-full sm:w-1/3 md:w-1/4 lg:w-1/4 cursor-pointer"
                onClick={openModal} // Modal öffnen bei Klick auf die Karte
            >
                <div className="flex items-center justify-between">
                    <div>
                        {/* Titel der Notiz */}
                        <h6 className="text-sm font-medium">3vs2 Linie brechen</h6>
                        {/* Formatiertes Datum */}
                        <span className="text-xs text-slate-500">{moment(date).format('DD.MM.YYYY')}</span>
                    </div>

                    {/* Pin-Icon, das auf den Status "isPinned" reagiert */}
                    <MdOutlinePushPin
                        className={`icon-btn ${isPinned ? 'text-primary' : 'text-slate-300'}`}
                        onClick={onPinNote} // Event-Handler, der das Pinnen der Notiz ermöglicht
                    />
                </div>

                {/* Bild mit abgerundeten Ecken und kleinerer Breite */}
                <img src={Example} alt="Logo" className="w-full h-32 object-cover rounded-md mt-4" />

                {/* Vorschau des Inhalts der Notiz (nur die ersten 60 Zeichen) */}
                <p className="text-xs text-slate-600 mt-2">Hier steht eine Beschreibung</p>

                {/* Buttons für Bearbeiten und Löschen der Notiz */}
                <div className="flex items-center gap-2 mt-4">
                    {/* Bearbeiten-Icon */}
                    <MdCreate className="icon-btn hover:text-green-600" onClick={onEdit} />
                    {/* Löschen-Icon */}
                    <MdDelete className="icon-btn hover:text-red-500" onClick={onDelete} />
                </div>
            </div>

            {/* Die leere Karte mit gestricheltem Rand */}
            <div
                className="border-dashed border-2 border-gray-400 rounded p-4 w-full sm:w-1/3 md:w-1/4 lg:w-1/4 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-all"
                onClick={onAddExercise} // onClick-Handler für das Hinzufügen einer Übung
            >
                <div className="flex flex-col items-center justify-center text-center">
                    <MdAdd className="text-4xl text-gray-500 mb-2" /> {/* Plus-Symbol */}
                    <p className="text-sm text-gray-500">Add Exercise</p>
                </div>
            </div>

            {/* Modal-Komponente */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                style={{
                    overlay: {
                        backgroundColor: "rgba(0,0,0,0.2)",
                        zIndex: 9999,
                    },
                    content: {
                        zIndex: 10000,
                        width: '60%', // Breite des Modals (60%)
                        maxWidth: '900px', // Maximale Breite des Modals
                        maxHeight: '60%', // Maximale Höhe des Modals
                        backgroundColor: 'white',
                        margin: 'auto',
                        borderRadius: '10px',
                        padding: '20px',
                        overflowY: 'auto',
                    },
                }}
                contentLabel="Modal Inhalt"
            >
                {/* Kopfzeile: Titel, Datum und Close-Button */}
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-medium">3vs2 Linie brechen</h3>
                        <span className="text-sm text-slate-500">{moment(date).format('DD.MM.YYYY')}</span>
                    </div>
                    <button
                        className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-50"
                        onClick={closeModal}  // Modal schließen
                    >
                        <MdClose className="text-xl text-slate-400" />
                    </button>
                </div>

                {/* Modal-Inhalt */}
                <div className="p-4">
                    {/* Bild und Content nebeneinander */}
                    <div className="flex mt-4 gap-4">
                        <img src={Example} alt="Logo" className="w-1/2 h-auto object-cover rounded-md" />
                        <p className="text-sm text-gray-700 w-1/2">Hier steht eine Beschreibung</p>
                    </div>

                    {/* Edit- und Delete-Buttons unten rechts */}
                    <div className="flex justify-end gap-2 mt-6">
                        <MdCreate className="icon-btn hover:text-green-600" onClick={onEdit} />
                        <MdDelete className="icon-btn hover:text-red-500" onClick={onDelete} />
                    </div>
                </div>
            </Modal>


        </div>
    );
};

// Exportiert die NoteCard-Komponente, damit sie in anderen Teilen der Anwendung verwendet werden kann
export default NoteCard;
