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

   //*** Variablen ***//
  const [allExercises, setAllExercises] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [isSearch, setIsSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");  // Zustand für die Suchabfrage
  const [currentPage, setCurrentPage] = useState(1);
  const exercisesPerPage = 12;
  const navigate = useNavigate();

  //*** Zustand Modal ***//
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  //*** Zustand Toastmessage ***//
  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message: "",
    data: null,
  });

   //*** Toast-Nachricht anzeigen ***//
   const showToastMessage = (message, type) => {
    setShowToastMsg({
      isShown: true,
      message,
      type,
    });
  };

  //*** Toast schließen ***//
  const handleCloseToast = () => {
    setShowToastMsg({
      isShown: false,
      message: "",
    });
  };

  //*** Paginierung ***//
  const indexOfLastExercise = currentPage * exercisesPerPage;
  const indexOfFirstExercise = indexOfLastExercise - exercisesPerPage;
  const currentExercises = allExercises.slice(indexOfFirstExercise, indexOfLastExercise);
  const totalPages = Math.ceil(allExercises.length / exercisesPerPage);

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

   //*** User-Info abrufen ***//
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

    //*** Alle Exercises abrufen ***//
    const getAllExercises = async () => {
      try {
        const response = await axiosInstance.get("/get-all-exercises");
        if (response.data && response.data.exercises) {
          setAllExercises(response.data.exercises);
        }
      } catch (error) {
        console.log("An unexpected error occurred. Please try again.");
      }
    };

    //*** Exercise editieren ***//
  const handleEditExercise = (noteDetails) => {
    setOpenAddEditModal({ isShown: true, data: noteDetails, type: "edit" });
  };

  //*** Exercise löschen ***//
  const deleteExercise = async (data) => {
    const exerciseId = data._id;
    try {
      const response = await axiosInstance.delete("/delete-note/" + exerciseId);
      if (response.data && !response.data.error) {
        showToastMessage("Exercise Deleted Successfully", "delete");
        getAllExercises();
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.");
    }
  };


  //***  Suchanfrage senden ***//
  const onSearchExercise = async (query) => {
    if (!query.trim()) {
      setIsSearch(false);
      getAllExercises(); // Wenn die Suchanfrage leer ist, alle Übungen zurücksetzen
      return;
    }

    try {
      const response = await axiosInstance.get("/search-exercises", {
        params: { query },
      });
      if (response.data && response.data.exercises) {
        setIsSearch(true);
        setAllExercises(response.data.exercises);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //*** Alle Notizen pinnen/unpinnen ***//
  const updateIsPinnedExercise
   = async (exerciseData) => {
    const exerciseId = exerciseData._id;
    try {
      const response = await axiosInstance.put(
        "/update-exercise-pinned/" + exerciseId,
        { isPinned: !exerciseData.isPinned }
      );
      if (response.data && response.data.exercise) {
        showToastMessage("Exercise Updated Successfully");
        getAllExercises();
      }
    } catch (error) {
      console.log(error);
    }
  };

    //*** Suchabfrage zurücksetzen ***//
    const handleClearSearch = () => {
      setSearchQuery("");
      setIsSearch(false);
      getAllExercises(); // Alle Notizen zurücksetzen, wenn die Suche gelöscht wird
    };


  //*** useEffect für initiales Laden der Exercises und Benutzerdaten ***//
  useEffect(() => {
    getAllExercises();
    getUserInfo();
  }, []);

  return (
    <Layout
    userInfo={userInfo}
    onLogout={() => { localStorage.clear(); navigate("/login"); }}
    onSearchExercise={onSearchExercise}
    handleClearSearch={handleClearSearch}
    >
      <h1 className="text-4xl font-medium text-blue-500 my-6">Exercises</h1>

      <div className="flex items-center justify-between mb-6">
        {/* Flexbox für SearchBar und Paginierung nebeneinander */}
        <div className="flex items-center gap-4 w-full">
          {/* Die Suchleiste */}
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            handleSearch={() => onSearchExercise(searchQuery)}
            onClearSearch={() => {
              setSearchQuery("");
              setIsSearch(false);
              getAllExercises();
            }}
          />

          {/* Paginierung rechts */}
          <div className="flex items-center gap-4 ml-auto">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className="p-2 text-blue-600 disabled:text-gray-400"
            >
              <MdChevronLeft size={32} />
            </button>

            <span className="text-lg">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className="p-2 text-blue-600 disabled:text-gray-400"
            >
              <MdChevronRight size={32} />
            </button>
          </div>
        </div>
      </div>

      {/* Übungen anzeigen */}
      {currentExercises.length > 0 ? (
      <div className="grid grid-cols-3 gap-4 mt-8">
        {currentExercises.map((exercise) => (
          <ExerciseCard
            key={exercise._id}
            title={exercise.title}
            date={exercise.createdOn}
            organisation={exercise.organisation}
            durchfuehrung={exercise.durchfuehrung}
            coaching={exercise.coaching}
            variante={exercise.variante}
            onEdit={()=> handleEditExercise(exercise)}
            onDelete={() => deleteExercise(exercise)}
            onPinExercise={() => updateIsPinnedExercise(exercise) }
          />
        ))}
      </div>
      ) : (
        <EmptyCard
        imgSrc={isSearch ? NoDataImg : AddNotesImg}
        message={
          isSearch
            ? `Oops! No Exercises found matching your search.`
            : `Start creating your first Exercise! Click the 'Add' button to join thoughts, ideas, and reminders. Let's get started!`
        }
      />
    )}
      

      {/* Add Exercise Button */}
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
        <AddEditExercise
          type={openAddEditModal.type}
          ExerciseData={openAddEditModal.data}
          onClose={() => {
            setOpenAddEditModal({ isShown: false, type: "add", data: null });
          }}
          getAllExercises={getAllExercises}
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
    </Layout>
  );
};

export default Exercises;
