import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar'; // Navbar-Komponente importieren
import EmptyCard from '../../components/EmptyCard/EmptyCard'; // Leere Karte für den Fall, dass keine Notizen vorhanden sind
import NoteCard from '../../components/Cards/NoteCard'; // Karte für jede Notiz
import { MdAdd } from 'react-icons/md'; // Icon für 'Add' Button
import AddEditNotes from './AddEditNotes'; // Komponente für Hinzufügen und Bearbeiten von Notizen
import Modal from "react-modal"; // Modal-Komponente
import { useNavigate } from 'react-router-dom'; // React Router für Navigation
import axiosInstance from '../../utils/axiosInstance'; // Axios für API-Aufrufe
import Toast from '../../components/ToastMessage/Toast'; // Toast-Benachrichtigung
import AddNotesImg from '../../assets/img/addData.png'; // Bild für den Fall, dass keine Notizen vorhanden sind
import NoDataImg from '../../assets/img/noData.png'; // Bild für den Fall, dass keine Notizen gefunden wurden

const Home = () => {

  // Zustand für das Anzeigen des Add/Edit-Modals
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false, // Gibt an, ob das Modal angezeigt wird
    type: "add", // "add" für neue Notiz, "edit" für Bearbeitung
    data: null, // Daten der Notiz (nur für Edit)
  });

  // Zustand für die Toast-Benachrichtigungen
  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false, // Gibt an, ob die Toast-Nachricht angezeigt wird
    message: "", // Die Nachricht, die im Toast angezeigt wird
    data: null, // Zusätzliche Daten für die Toast-Nachricht (falls benötigt)
  });

  // Zustand für alle Notizen
  const [allNotes, setAllNotes] = useState([]);
  
  // Zustand für die Benutzerdaten
  const [userInfo, setUserInfo] = useState(null);

  // Zustand für die Suche
  const [isSearch, setIsSearch] = useState(false);

  const navigate = useNavigate(); // React Router Hook für Navigation

  // Funktion zum Bearbeiten einer Notiz
  const handleEdit = (noteDetails) => {
    setOpenAddEditModal({ isShown: true, data: noteDetails, type: "edit" });
  };

  // Funktion zum Anzeigen einer Toast-Nachricht
  const showToastMessage = (message, type) => {
    setShowToastMsg({
      isShown: true,
      message,
      type
    });
  };

  // Funktion zum Schließen der Toast-Nachricht
  const handleCloseToast = () => {
    setShowToastMsg({
      isShown: false,
      message: "",
    });
  };

  // Funktion zum Abrufen der Benutzerdaten
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user); // Benutzerdaten setzen
      }
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear(); // Bei 401 Fehler (unauthorized) den lokalen Speicher löschen
        navigate("/login"); // Zur Login-Seite navigieren
      }
    }
  };

  // Funktion zum Abrufen aller Notizen
  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get("/get-all-notes");

      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes); // Alle Notizen setzen
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again."); // Fehlerbehandlung
    }
  };

  // Funktion zum Löschen einer Notiz
  const deleteNote = async (data) => {
    const noteId = data._id;
    
    try {
      const response = await axiosInstance.delete("/delete-note/" + noteId);

      if (response.data && !response.data.error) {
        showToastMessage("Note Deleted Successfully", 'delete');
        getAllNotes(); // Alle Notizen nach dem Löschen erneut abrufen
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        console.log("An unexpected error occurred. Please try again.");
      }
    }
  };

  // Funktion zur Suche nach Notizen
  const onSearchNote = async (query) => {
    try {
      const response = await axiosInstance.get("/search-notes", {
        params: { query },
      });

      if (response.data && response.data.notes) {
        setIsSearch(true);
        setAllNotes(response.data.notes); // Gefundene Notizen setzen
      }
    } catch (error) {
      console.log(error); // Fehlerbehandlung
    }
  };

  // Funktion zum Setzen des "Pinned"-Status einer Notiz
  const updateIsPinned = async (noteData) => {
    const noteId = noteData._id;

    try {
      const response = await axiosInstance.put(
        "/update-note-pinned/" + noteId, 
        { isPinned: !noteData.isPinned }
      );

      if (response.data && response.data.note) {
        showToastMessage("Note Updated Successfully");
        getAllNotes(); // Alle Notizen nach dem Update erneut abrufen
      }
    } catch (error) {
      console.log(error); // Fehlerbehandlung
    }
  };

  // Funktion zum Zurücksetzen der Suchergebnisse
  const handleClearSearch = () => {
    setIsSearch(false);
    getAllNotes(); // Alle Notizen erneut abrufen
  };

  useEffect(() => {
    getAllNotes(); // Alle Notizen abrufen, wenn die Komponente geladen wird
    getUserInfo(); // Benutzerdaten abrufen
    return () => {
      // Cleanup-Funktion (falls erforderlich)
    };
  }, []);

  return (
    <div>
      <Navbar userInfo={userInfo} onSearchNote={onSearchNote} handleClearSearch={handleClearSearch} /> 
      {/* Navbar mit Benutzerdaten und Suchfunktion */}

      <div className='container mx-auto'>
        {allNotes.length > 0 ? (
          <div className='grid grid-cols-3 gap-4 mt-8'>
            {allNotes.map((item, index) => (
              <NoteCard 
                key={item._id}
                title={item.title}
                date={item.createdOn}
                content={item.content}
                tags={item.tags}
                isPinned={item.isPinned}
                onEdit={() => handleEdit(item)} 
                onDelete={() => deleteNote(item)} 
                onPinNote={() => updateIsPinned(item)}
              />
            ))}
          </div>
        ) : (
          <EmptyCard 
            imgSrc={isSearch ? NoDataImg : AddNotesImg}
            message={isSearch ? `Oops! No notes found matching your search.` : `Start creating your first note! Click the 'Add' button to join thoughts, ideas, and reminders. Let's go started!`} 
          />
        )}
      </div>

      <button 
        className='w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10' 
        onClick={() => {
          setOpenAddEditModal({ isShown: true, type: "add", data: null });
        }}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>

      <Modal 
        isOpen={openAddEditModal.isShown} 
        onRequestClose={() => {}}
        style={{ overlay: { backgroundColor: "rgba(0,0,0,0.2)" } }}
        contentLabel=""
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
      >
        <AddEditNotes 
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={() => {
            setOpenAddEditModal({ isShown: false, type: "add", data: null });
          }}
          getAllNotes={getAllNotes}
          showToastMessage={showToastMessage}
        />
      </Modal>

      <Toast 
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={handleCloseToast}
      />
    </div>
  );
};

export default Home;
