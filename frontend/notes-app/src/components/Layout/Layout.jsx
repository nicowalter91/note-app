import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/SideBar/SideBar.jsx';
import Toast from '../../components/ToastMessage/Toast';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner'; // Corrected import for LoadingSpinner
import Footer from '../../components/Footer/Footer'; // Import Footer component

const Layout = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message: "",
    type: null,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null); // State for error handling

  const navigate = useNavigate();

  // User-Info abrufen
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user); // Speichert die Benutzerdaten im State
      }
    } catch (error) {
      setError("Failed to load user information."); // Set error message
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate("/login"); // Falls die Authentifizierung fehlschlägt, zum Login navigieren
      }
    }
  };

  useEffect(() => {
    getUserInfo(); // User-Info beim Laden der Seite abrufen
  }, []);

  // Funktion für die Suchanfrage
  const onSearchNote = (query) => {
    console.log("Suche nach:", query);
    // Hier kannst du deine Logik zum Filtern von Notizen oder Abfragen der API hinzufügen.
  };

  // Funktion zum Zurücksetzen der Suche
  const handleClearSearch = () => {
    console.log("Suchabfrage zurückgesetzt");
    setSearchQuery(""); // Setzt den Zustand der Suche zurück
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Navbar oben fixiert */}
      <div className="fixed top-0 left-0 right-0 z-10">
        {userInfo ? (
          <Navbar 
            userInfo={userInfo} 
            onSearchNote={onSearchNote} 
            handleClearSearch={handleClearSearch} 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        ) : error ? (
          <div className="text-red-500 text-center mt-4">{error}</div> // Error message
        ) : (
          <LoadingSpinner /> // Animated loading spinner
        )}
      </div>

      {/* Flex-Container für Sidebar und Hauptinhalt */}
      <div className="flex flex-1 pt-16">
        {/* Sidebar links */}
        <div className="bg-blue-600 text-white h-full fixed top-16 left-0 bottom-0 md:w-64 w-16 transition-width duration-300">
          <Sidebar
            userInfo={userInfo}
            onLogout={() => {
              localStorage.clear();
              navigate("/login");
            }}
          />
        </div>

        {/* Hauptinhalt rechts */}
        <div className="flex-1 ml-16 md:ml-64 p-6 overflow-y-auto">{children}</div>
      </div>

      {/* Toast-Benachrichtigung */}
      <Toast
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={() => setShowToastMsg({ isShown: false, message: "" })}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;
