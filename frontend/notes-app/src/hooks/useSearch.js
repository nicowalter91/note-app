import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

const useSearchNotes = (initialQuery = "") => {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [isSearch, setIsSearch] = useState(false);

  const onSearchNote = async (query) => {
    if (query.trim() === "") {
      setIsSearch(false);
      setResults([]); // Löscht alle Suchergebnisse, wenn die Suche leer ist
      return;
    }

    try {
      const response = await axiosInstance.get("/search-notes", {
        params: { query },
      });
      if (response.data && response.data.notes) {
        setResults(response.data.notes);
        setIsSearch(true);
      }
    } catch (error) {
      console.log("Fehler bei der Suche: ", error);
      setResults([]);
    }
  };

  const handleClearSearch = () => {
    setQuery("");
    setIsSearch(false);
    setResults([]);
  };

  useEffect(() => {
    if (query) {
      onSearchNote(query);
    }
  }, [query]);

  return { query, setQuery, results, isSearch, onSearchNote, handleClearSearch };
};

export default useSearchNotes;
