import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/SideBar/SideBar';

const Layout = ({ children, userInfo, onSearchNote, handleClearSearch, searchQuery, setSearchQuery }) => {
  return (
    <div className="h-screen flex flex-col">
      {/* Navbar oben fixiert */}
      <div className="fixed top-0 left-16 right-0 z-10">
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
        <div className="bg-blue-600 text-white h-full fixed top-16 left-0 bottom-0 z-10">
          <Sidebar />
        </div>

        {/* Hauptinhalt */}
        <div className="flex-1 ml-16 p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;