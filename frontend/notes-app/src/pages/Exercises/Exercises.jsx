import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import ExerciseCard from '../../components/Cards/ExerciseCard';
import { MdAdd } from 'react-icons/md';
import Modal from "react-modal";
import Layout from '../../components/Layout/Layout';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import SearchBar from '../../components/SearchBar/SearchBar';
import AddEditExercise from '../../pages/Exercises/AddEditExercises';
import AddNotesImg from '../../assets/img/addData.png';
import NoDataImg from '../../assets/img/noData.png';
import EmptyCard from '../../components/EmptyCard/EmptyCard';
import Toast from '../../components/ToastMessage/Toast';

const Exercises = () => {
  const [allExercises, setAllExercises] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [isSearch, setIsSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showPinnedOnly, setShowPinnedOnly] = useState(false); // Zustand für den Filter

  const itemsPerPage = 6;
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

  const showToastMessage = (message, type) => {
    setShowToastMsg({ isShown: true, message, type });
  };

  const handleCloseToast = () => {
    setShowToastMsg({ isShown: false, message: "" });
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = allExercises.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(allExercises.length / itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prevPage) => prevPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage((prevPage) => prevPage - 1);
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

  const getAllExercises = async () => {
    try {
      const response = await axiosInstance.get("/get-all-exercises");
      if (response.data && response.data.exercise) {
        let exercises = response.data.exercise;
        if (showPinnedOnly) {
          exercises = exercises.filter(ex => ex.isPinnedExercise); // Filter gepinnte Übungen
        }
        setAllExercises(exercises);
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.");
    }
  };

  const handleEditExercise = (exerciseDetails) => {
    setOpenAddEditModal({ isShown: true, data: exerciseDetails, type: "edit" });
  };

  const deleteExercise = async (data) => {
    const exerciseId = data._id;
    try {
      const response = await axiosInstance.delete("/delete-exercise/" + exerciseId);
      if (response.data && !response.data.error) {
        showToastMessage("Exercise Deleted Successfully", "delete");
        getAllExercises();
      } else {
        console.log("Fehler beim Löschen:", response.data.error);
      }
    } catch (error) {
      console.error("Fehler beim Löschen der Übung:", error);
    }
  };

  const onSearchExercise = async (query) => {
    if (!query.trim()) {
      setIsSearch(false);
      getAllExercises();
      return;
    }

    try {
      const response = await axiosInstance.get("/search-exercises", {
        params: { query },
      });
      if (response.data && response.data.exercise) {
        setIsSearch(true);
        setAllExercises(response.data.exercise);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateIsPinnedExercise = async (exerciseData) => {
    const exerciseId = exerciseData._id;
    const updatedPinStatus = !exerciseData.isPinnedExercise;

    try {
      const response = await axiosInstance.put(
        `/update-exercise-pinned/${exerciseId}`,
        { isPinnedExercise: updatedPinStatus }
      );

      if (response.data && response.data.exercise) {
        showToastMessage(updatedPinStatus ? "Exercise Pinned Successfully" : "Exercise Unpinned Successfully");
        setAllExercises((prevExercises) =>
          prevExercises.map((ex) =>
            ex._id === exerciseId ? { ...ex, isPinnedExercise: updatedPinStatus } : ex
          )
        );
      }
    } catch (error) {
      console.error("Fehler beim Aktualisieren des Pin-Status:", error);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setIsSearch(false);
    getAllExercises();
  };

  const filterPinnedExercises = () => {
    setShowPinnedOnly((prevState) => !prevState); // Filter umschalten
  };

  useEffect(() => {
    getAllExercises();
    getUserInfo();
  }, [showPinnedOnly]); // Re-rendere, wenn der Filterstatus geändert wird

  return (
    <Layout
      userInfo={userInfo}
      onLogout={() => { localStorage.clear(); navigate("/login"); }}
      onSearchExercise={onSearchExercise}
      handleClearSearch={handleClearSearch}
    >
      {/* Obere Container mit SearchBar, Filter und Paginierung */}
      <div className="sticky top-0 z-10 bg-white mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 w-full">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              handleSearch={() => onSearchExercise(searchQuery)}
              onClearSearch={handleClearSearch}
            />
            <button
              onClick={filterPinnedExercises}
              className={`px-4 py-2 rounded-lg ${showPinnedOnly ?   'bg-gray-300 text-gray-700' : 'bg-blue-600 text-white'}`}
            >
              {showPinnedOnly ? 'Show All' : 'Show Pinned'}
            </button>
  
            {/* Paginierung rechts */}
            <div className="flex items-center gap-4 ml-auto">
              <button
                onClick={() => prevPage()}
                disabled={currentPage === 1}
                className={`p-2 ${currentPage === 1 ? "text-gray-400" : "text-blue-600"}`}
              >
                <MdChevronLeft size={32} />
              </button>
  
              <span className="text-lg">
                Page {currentPage} of {totalPages || 1}
              </span>
  
              <button
                onClick={() => nextPage()}
                disabled={currentPage === totalPages || totalPages === 0}
                className={`p-2 ${currentPage === totalPages || totalPages === 0 ? "text-gray-400" : "text-blue-600"}`}
              >
                <MdChevronRight size={32} />
              </button>
            </div>
          </div>
        </div>
      </div>
  
      {/* Unterer Container mit den Exercises (scrollbar) */}
      <div className="mt-8 overflow-y-auto max-h-[calc(100vh-200px)]"> {/* Passe die Höhe an den verfügbaren Platz an */}
        {currentItems.length > 0 ? (
          <div className="grid grid-cols-3 gap-4">
            {currentItems.map((exercise) => (
              <ExerciseCard
              key={exercise._id}
              title={exercise.title}
              date={exercise.createdOn}
              organisation={exercise.organisation}
              durchfuehrung={exercise.durchfuehrung}
              coaching={exercise.coaching}
              variante={exercise.variante}
              tags={exercise.tags}
              isPinnedExercise={exercise.isPinnedExercise}
              onEdit={() => handleEditExercise(exercise)}
              onDelete={() => deleteExercise(exercise)}
              onPinExercise={() => updateIsPinnedExercise(exercise)}
              imageUrl={exercise.imageUrl} 
              />
            ))}
          </div>
        ) : (
          <EmptyCard imgSrc={isSearch ? NoDataImg : AddNotesImg} message={isSearch ? `Oops! No Exercises found matching your search.` : `Start creating your first Exercise! Click the 'Add' button to join thoughts, ideas, and reminders. Let's get started!`} />
        )}
      </div>
  
      {/* Button zum Hinzufügen einer neuen Übung */}
      <button
        className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 fixed right-10 bottom-10"
        onClick={() => { setOpenAddEditModal({ isShown: true, type: "add", data: null }); }}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>
  
      {/* Modal für das Hinzufügen/Bearbeiten einer Übung */}
      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => { }}
        style={{ overlay: { backgroundColor: "rgba(0,0,0,0.2)", zIndex: 9999 }, content: { zIndex: 10000 } }}
        className="w-4/5 max-h-3/4 bg-white rounded-md mx-auto mt-5 p-5 overflow-scroll"
      >
        <AddEditExercise
          type={openAddEditModal.type}
          exerciseData={openAddEditModal.data}
          onClose={() => { setOpenAddEditModal({ isShown: false, type: "add", data: null }); }}
          getAllExercises={getAllExercises}
          showToastMessage={showToastMessage}
        />
      </Modal>
  
      {/* Toast Nachricht */}
      <Toast
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={handleCloseToast}
      />
    </Layout>
  );
  
};

export default Exercises;
