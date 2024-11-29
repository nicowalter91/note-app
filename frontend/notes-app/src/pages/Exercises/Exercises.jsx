import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import ExerciseCard from '../../components/Cards/ExerciseCard';
import { MdAdd } from 'react-icons/md';
import Modal from "react-modal";
import Layout from '../../components/Layout/Layout';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import SearchBar from '../../components/SearchBar/SearchBar'; // Importiere die SearchBar

const Exercises = () => {
  const [allExercises, setAllExercises] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");  // Zustand für die Suchabfrage

  const [currentPage, setCurrentPage] = useState(1);
  const exercisesPerPage = 12;

  const navigate = useNavigate();

  // Alle Übungen abrufen
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

  // Suchanfrage senden
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

  // Paginierung
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

  // Modal Handling
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // useEffect für das initiale Laden der Übungen
  useEffect(() => {
    getAllExercises();
  }, []);

  return (
    <Layout>
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

          {/* Paginierung */}
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
      <div className="grid grid-cols-3 gap-4 mt-8">
        
          <ExerciseCard />
      
      </div>

      {/* Add Exercise Button */}
      <button
        className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 fixed right-10 bottom-10"
        onClick={openModal}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>

      {/* Modal-Komponente für das Hinzufügen einer Übung */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 w-1/3">
            <h2 className="text-xl font-medium mb-4">Add New Exercise</h2>
            {/* Hier können Eingabefelder für das Hinzufügen der Übung kommen */}
            <div className="flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Exercises;
