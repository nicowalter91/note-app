import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/SideBar/SideBar';
import Footer from '../../components/Footer/Footer';

const Layout = ({ children, userInfo, onLogout }) => {
  return (
    <div className="h-screen flex flex-col">
      {/* Navbar */}
      <header className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
        <Navbar userInfo={userInfo} onLogout={onLogout} />
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="bg-gray-100 shadow-md border-r border-gray-200 w-64" style={{ height: 'calc(100vh - 4rem)', overflowY: 'auto' }}>
          <Sidebar />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;