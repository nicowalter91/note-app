import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/SideBar/SideBar.jsx';
import Toast from '../../components/ToastMessage/Toast';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import Footer from '../../components/Footer/Footer';
import { HiMenuAlt2, HiX } from 'react-icons/hi';

const Layout = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message: "",
    type: null,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Load sidebarOpen state from localStorage or default to true for desktop and false for mobile
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const savedState = localStorage.getItem('sidebarOpen');
    if (savedState !== null) {
      return JSON.parse(savedState);
    }
    // Default: open on desktop, closed on mobile
    return window.innerWidth >= 768;
  });
  
  // Dark mode state with localStorage persistence
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('darkMode');
    return savedTheme !== null ? JSON.parse(savedTheme) : false;
  });

  const navigate = useNavigate();

  // Save sidebar state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('sidebarOpen', JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);
  
  // Save theme state and apply it to HTML element
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  // Get user info on component mount
  const getUserInfo = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      console.error("Failed to fetch user info:", error);
      setError("Failed to load user information.");
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserInfo();
    
    // Responsiveness: Handle sidebar state based on screen size
    const handleResize = () => {
      if (window.innerWidth < 768) {
        // On small screens, don't automatically open the sidebar
        // But keep the state if user has manually set it
        if (!localStorage.getItem('sidebarOpen')) {
          setSidebarOpen(false);
        }
      }
    };
    
    // Initial check
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Search function for notes
  const onSearchNote = (query) => {
    console.log("Searching for:", query);
    // Implement your search logic here
  };

  // Function to reset search
  const handleClearSearch = () => {
    console.log("Search query reset");
    setSearchQuery("");
  };

  // Logout function
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Toggle Sidebar with localStorage persistence
  const toggleSidebar = () => {
    const newState = !sidebarOpen;
    setSidebarOpen(newState);
    localStorage.setItem('sidebarOpen', JSON.stringify(newState));
  };
  
  // Toggle dark mode with localStorage persistence
  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };
  
  // Mock notifications data
  const notifications = [
    "New training session has been scheduled for tomorrow",
    "Player John Smith has submitted his progress report",
    "Coach has commented on your latest tactic"
  ];
  
  return (
    <div className="h-screen flex flex-col">
      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 right-0 z-20">
        {loading ? (
          <div className="w-full h-16 flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-800">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="w-full h-16 bg-red-500 text-white flex items-center justify-center">
            <p className="text-sm font-medium">{error}</p>
          </div>
        ) : (
          <Navbar 
            userInfo={userInfo} 
            onSearchNote={onSearchNote} 
            handleClearSearch={handleClearSearch} 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            toggleSidebar={toggleSidebar}
            sidebarOpen={sidebarOpen}
            onLogout={handleLogout}
            isDarkMode={isDarkMode}
            toggleTheme={toggleTheme}
            notifications={notifications}
          />
        )}
      </div>

      {/* Mobile sidebar toggle button */}
      <button 
        onClick={toggleSidebar}
        className="md:hidden fixed bottom-6 right-6 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
        aria-label={sidebarOpen ? "Close Sidebar" : "Open Sidebar"}
      >
        {sidebarOpen ? <HiX className="text-xl" /> : <HiMenuAlt2 className="text-xl" />}
      </button>

      {/* Main Content with Sidebar */}
      <div className="flex flex-1 pt-16">
        {/* Sidebar with improved transition */}
        <div 
          className={`fixed top-16 left-0 bottom-0 z-10 h-[calc(100vh-4rem)] transition-all duration-300 ease-in-out
            ${sidebarOpen 
              ? 'md:w-64 w-[280px] translate-x-0 shadow-lg' 
              : 'w-0 -translate-x-full md:translate-x-0 md:w-0'}`}
        >
          {sidebarOpen && (
            <Sidebar
              userInfo={userInfo}
              onLogout={handleLogout}
              isDarkMode={isDarkMode}
              toggleTheme={toggleTheme}
            />
          )}
        </div>

        {/* Main Content with smooth transition */}
        <div 
          className={`flex-1 transition-all duration-300 p-6 overflow-y-auto
            ${sidebarOpen ? 'md:ml-64' : 'ml-0'}`}
        >
          <div className="h-full">
            {children}
          </div>
        </div>
      </div>      {/* Toast Notification */}
      <Toast
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={() => setShowToastMsg({ isShown: false, message: "" })}
      />

      {/* Footer with adjusted position */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'md:pl-64' : 'pl-0'}`}>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
