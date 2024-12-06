import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import NoteCard from '../../components/Cards/NoteCard';
import { MdAdd, MdChevronLeft, MdChevronRight } from 'react-icons/md';
import AddEditNotes from './AddEditNotes';
import Modal from "react-modal";
import Toast from '../../components/ToastMessage/Toast';
import EmptyCard from '../../components/EmptyCard/EmptyCard';
import AddNotesImg from '../../assets/img/addData.png';
import NoDataImg from '../../assets/img/noData.png';
import Layout from '../../components/Layout/Layout';
import SearchBar from '../../components/SearchBar/SearchBar';

const Notes = () => {
  const [allNotes, setAllNotes] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [isSearch, setIsSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const navigate = useNavigate();

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

  //*** Paginierung ***//
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = allNotes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(allNotes.length / itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      console.log(`Navigating to next page: ${currentPage + 1}`);
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      console.log(`Navigating to previous page: ${currentPage - 1}`);
      setCurrentPage((prevPage) => prevPage - 1);
    }
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

  const handleEdit = (noteDetails) => {
    setOpenAddEditModal({ isShown: true, data: noteDetails, type: "edit" });
    console.log(noteDetails);
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
    if (!query.trim()) {
      setIsSearch(false);
      getAllNotes();
      return;
    }

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

  const handleClearSearch = () => {
    setSearchQuery("");
    setIsSearch(false);
    getAllNotes();
  };

  useEffect(() => {
    getAllNotes();
    getUserInfo();
  }, []);

  return (
    <Layout
      userInfo={userInfo}
      onLogout={() => { localStorage.clear(); navigate("/login"); }}
      onSearchNote={onSearchNote}
      handleClearSearch={handleClearSearch}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4 w-full">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            handleSearch={() => onSearchNote(searchQuery)}
            onClearSearch={handleClearSearch}
          />

          {/* Paginierung rechts */}
          <div className="flex items-center gap-4 ml-auto">
            <button
              onClick={() => {
                console.log("Prev button clicked");
                prevPage();
              }}
              disabled={currentPage === 1}
              className={`p-2 ${currentPage === 1 ? "text-gray-400" : "text-blue-600"}`}
              style={{ zIndex: 10 }}
            >
              <MdChevronLeft size={32} />
            </button>

            <span className="text-lg">
              Page {currentPage} of {totalPages || 1}
            </span>

            <button
              onClick={() => {
                console.log("Next button clicked");
                nextPage();
              }}
              disabled={currentPage === totalPages || totalPages === 0}
              className={`p-2 ${currentPage === totalPages || totalPages === 0
                ? "text-gray-400"
                : "text-blue-600"
                }`}
              style={{ zIndex: 10 }}
            >
              <MdChevronRight size={32} />
            </button>
          </div>
        </div>
      </div>

      {/* Übungen anzeigen */}
      {currentItems.length > 0 ? (
        <div className="grid grid-cols-3 gap-4 mt-8">
          {currentItems.map((item) => (
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

      <button
        className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 fixed right-10 bottom-10"
        onClick={() => {
          setOpenAddEditModal({ isShown: true, type: "add", data: null });
        }}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => { }}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
            zIndex: 9999,
          },
          content: {
            zIndex: 10000,
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

      <Toast
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={handleCloseToast}
      />
    </Layout>
  );
};

export default Notes;
