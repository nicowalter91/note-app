import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar'; // Navbar-Komponente importieren
import Sidebar from '../../components/SideBar/SideBar.jsx'; // Sidebar-Komponente importieren
import Toast from '../../components/ToastMessage/Toast'; // Toast-Komponente importieren
import { useNavigate } from 'react-router-dom'; // useNavigate für die Navigation importieren
import axiosInstance from '../../utils/axiosInstance'; // Axios für API-Aufrufe importieren

const Layout = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message: "",
    type: null,
  });
  const [searchQuery, setSearchQuery] = useState(""); // Zustand für die Suchabfrage

  const navigate = useNavigate();

  // User-Info abrufen
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user); // Speichert die Benutzerdaten im State
      }
    } catch (error) {
      if (error.response.status === 401) {
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
        ) : (
          <div>Loading...</div> // Ladeanzeige
        )}
      </div>

      {/* Flex-Container für Sidebar und Hauptinhalt */}
      <div className="flex flex-1 pt-16">
        {/* Sidebar links */}
        <div className="bg-blue-600 text-white h-full fixed top-16 left-0 bottom-0">
          <Sidebar
            userInfo={userInfo}
            onLogout={() => {
              localStorage.clear();
              navigate("/login");
            }}
          />
        </div>

        {/* Hauptinhalt rechts */}
        <div className="flex-1 ml-32 p-6 overflow-y-auto mr-32">{children}</div>
      </div>

      {/* Toast-Benachrichtigung */}
      <Toast
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={() => setShowToastMsg({ isShown: false, message: "" })}
      />
    </div>
  );
};

export default Layout;
