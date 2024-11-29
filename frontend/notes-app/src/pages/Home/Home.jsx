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
import Sidebar from '../../components/SideBar/SideBar';

const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message: "",
    data: null,
  });

  const [allNotes, setAllNotes] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [isSearch, setIsSearch] = useState(false);

  // Paginierung: Zustand für die aktuelle Seite und die Anzahl der Notizen pro Seite
  const [currentPage, setCurrentPage] = useState(1);
  const notesPerPage = 11; // Maximale Anzahl der angezeigten Notizen pro Seite

  const navigate = useNavigate();

  const handleEdit = (noteDetails) => {
    setOpenAddEditModal({ isShown: true, data: noteDetails, type: "edit" });
  };

  const showToastMessage = (message, type) => {
    setShowToastMsg({
      isShown: true,
      message,
      type,
    });
  };

  const handleCloseToast = () => {
    setShowToastMsg({
      isShown: false,
      message: "",
    });
  };

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get("/get-all-notes");
      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.");
    }
  };

  const deleteNote = async (data) => {
    const noteId = data._id;
    try {
      const response = await axiosInstance.delete("/delete-note/" + noteId);
      if (response.data && !response.data.error) {
        showToastMessage("Note Deleted Successfully", "delete");
        getAllNotes();
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.");
    }
  };

  const onSearchNote = async (query) => {
    try {
      const response = await axiosInstance.get("/search-notes", {
        params: { query },
      });
      if (response.data && response.data.notes) {
        setIsSearch(true);
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateIsPinned = async (noteData) => {
    const noteId = noteData._id;
    try {
      const response = await axiosInstance.put(
        "/update-note-pinned/" + noteId,
        { isPinned: !noteData.isPinned }
      );
      if (response.data && response.data.note) {
        showToastMessage("Note Updated Successfully");
        getAllNotes();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleClearSearch = () => {
    setIsSearch(false);
    getAllNotes();
  };

  useEffect(() => {
    getAllNotes();
    getUserInfo();
    return () => { };
  }, []);

  // Paginierung: Berechne, welche Notizen auf der aktuellen Seite angezeigt werden
  const indexOfLastNote = currentPage * notesPerPage;
  const indexOfFirstNote = indexOfLastNote - notesPerPage;
  const currentNotes = allNotes.slice(indexOfFirstNote, indexOfLastNote);

  // Berechne die Gesamtzahl der Seiten
  const totalPages = Math.ceil(allNotes.length / notesPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Fixierte Navbar oben */}
      <div className="fixed top-0 left-0 right-0 z-10">
        <Navbar
          userInfo={userInfo}
          onSearchNote={onSearchNote}
          handleClearSearch={handleClearSearch}
        />
      </div>

      {/* Flex-Container für Sidebar und Hauptinhalt */}
      <div className="flex flex-1 pt-16">
        {/* Sidebar links, die unter der Navbar bleibt */}
        <div>
        <Sidebar userInfo={userInfo} onLogout={() => { localStorage.clear(); navigate("/login"); }} />
        </div>

        {/* Hauptinhalt rechts */}
        <div className="flex-1 ml-64 p-6 overflow-y-auto">
          <h1 className="text-4xl font-medium text-blue-500 my-6">Notes</h1>
          {/* Paginierungsbuttons */}
          <div className="flex justify-between mt-6">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
            >
              Previous
            </button>

            <span className="self-center text-lg">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
            >
              Next
            </button>
          </div>

          {currentNotes.length > 0 ? (
            <div className="grid grid-cols-3 gap-4 mt-8">
              {currentNotes.map((item) => (
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
              message={
                isSearch
                  ? `Oops! No notes found matching your search.`
                  : `Start creating your first note! Click the 'Add' button to join thoughts, ideas, and reminders. Let's get started!`
              }
            />
          )}


        </div>
      </div>

      {/* Button zum Hinzufügen einer neuen Notiz */}
      <button
        className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 fixed right-10 bottom-10"
        onClick={() => {
          setOpenAddEditModal({ isShown: true, type: "add", data: null });
        }}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>

      {/* Modal für Notizen hinzufügen/bearbeiten */}
      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => { }}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
            zIndex: 9999, // Höherer z-index für das Overlay
          },
          content: {
            zIndex: 10000, // Höherer z-index für den Inhalt des Modals
          },
        }}
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


      {/* Toast-Benachrichtigung */}
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
