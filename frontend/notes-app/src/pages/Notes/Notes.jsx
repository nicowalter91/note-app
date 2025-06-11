import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import NoteCard from '../../components/Cards/NoteCard';
import { MdChevronLeft, MdChevronRight, MdGridView, MdViewList } from 'react-icons/md';
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
  const [viewMode, setViewMode] = useState('grid'); // 'grid' oder 'list'
  const [sortBy, setSortBy] = useState('date'); // 'date', 'title', 'priority'
  const [filterTags, setFilterTags] = useState([]);
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

  const sortNotes = (notes) => {
    return notes.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.createdOn) - new Date(a.createdOn);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'priority':
          return b.isPinned - a.isPinned;
        default:
          return 0;
      }
    });
  };

  const filterNotesByTags = (notes) => {
    if (filterTags.length === 0) return notes;
    return notes.filter(note => 
      note.tags.some(tag => filterTags.includes(tag))
    );
  };

  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get("/get-all-notes");
      if (response.data && response.data.notes) {
        const sortedNotes = sortNotes(response.data.notes);
        setAllNotes(sortedNotes);
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

  const onSetSearchResult = (response)=>{
    if(response.data.notes){
        setIsSearch(true);
        setAllNotes(response.data.notes);
    }
    else{
      throw new Error("Error: Reponse data doesn't contain response.data.notes Property"); 
    }
  }

    //*** Suchabfrage zurücksetzen ***//
    const onClearSearch = () => {
      setSearchQuery("");
      setIsSearch(false);
      getAllNotes(); // Alle Notes zurücksetzen, wenn die Suche gelöscht wird
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
      handleClearSearch={handleClearSearch}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Notizen</h1>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setOpenAddEditModal({ isShown: true, type: "add", data: null })}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Neue Aufgabe
              </button>
              <select 
                className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="date">Nach Datum sortieren</option>
                <option value="title">Nach Titel sortieren</option>
                <option value="priority">Nach Priorität sortieren</option>
              </select>
              <div className="flex gap-2 bg-white rounded-lg p-1 border border-gray-300">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
                >
                  <MdGridView size={24} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
                >
                  <MdViewList size={24} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4 w-full">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                searchUrl="/search-notes"
                onSetSearchResult={onSetSearchResult}
                onClearSearch={onClearSearch}
                placeholder="Notizen durchsuchen..."
              />

              <div className="flex items-center gap-4 ml-auto">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg transition-colors ${
                    currentPage === 1 
                      ? 'bg-gray-100 text-gray-400' 
                      : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                  }`}
                >
                  <MdChevronLeft size={24} />
                </button>

                <span className="text-lg font-medium text-gray-700">
                  Seite {currentPage} von {totalPages || 1}
                </span>

                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className={`p-2 rounded-lg transition-colors ${
                    currentPage === totalPages || totalPages === 0
                      ? 'bg-gray-100 text-gray-400'
                      : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                  }`}
                >
                  <MdChevronRight size={24} />
                </button>
              </div>
            </div>
          </div>

          {currentItems.length > 0 ? (
            <div className={`${
              viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' 
                : 'flex flex-col gap-4'
            } mt-8`}>
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
                  viewMode={viewMode}
                />
              ))}
            </div>
          ) : (
            <EmptyCard
              imgSrc={isSearch ? NoDataImg : AddNotesImg}
              message={
                isSearch
                  ? "Keine passenden Notizen gefunden. Versuchen Sie es mit anderen Suchbegriffen."
                  : "Erstellen Sie Ihre erste Notiz! Klicken Sie auf 'Neue Aufgabe', um Gedanken, Ideen und Erinnerungen festzuhalten."
              }
            />
          )}
        </div>

        <Modal
          isOpen={openAddEditModal.isShown}
          onRequestClose={() => {
            setOpenAddEditModal({ isShown: false, type: "add", data: null });
          }}
          style={{
            overlay: {
              backgroundColor: "rgba(0,0,0,0.5)",
              zIndex: 9999,
            },
            content: {
              zIndex: 10000,
              inset: '50% auto auto 50%',
              transform: 'translate(-50%, -50%)',
              border: 'none',
              borderRadius: '0.75rem',
              padding: '2rem',
              maxWidth: '800px',
              width: '90%',
              maxHeight: '90vh',
            },
          }}
          contentLabel="Notiz bearbeiten"
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
    </Layout>
  );
};

export default Notes;
