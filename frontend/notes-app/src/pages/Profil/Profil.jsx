import React from 'react'
import Sidebar from  '../../components/SideBar/SideBar'
import Navbar from '../../components/Navbar/Navbar';

const Profil = () => {
  return (
    <>
      <Navbar />
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Profil</h1>
        {/* Inhalt der Profil-Seite */}
      </div>
    </>
  );
}

export default Profil

