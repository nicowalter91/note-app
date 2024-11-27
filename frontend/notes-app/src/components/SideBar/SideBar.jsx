import React from 'react';
import { FaDumbbell, FaCog, FaTable, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {

    const NavItem = ({ icon, label }) => (
        <a
          href={`/${label.toLowerCase()}`}
          className="flex items-center px-6 py-3 hover:bg-white hover:text-blue-500 transition duration-200"
        >
          <span className="mr-3">{icon}</span>
          <span className="text-lg">{label}</span>
        </a>
      );

    const navigate = useNavigate();
    const onLogout = () => {
        localStorage.clear(); // Löscht alle Daten im lokalen Speicher.
        navigate("/login");   // Navigiert den Benutzer zur Login-Seite.
      };

      return (
        <div className="h-screen w-64 bg-blue-600 text-white flex flex-col">
          {/* Willkommen Text oben */}
          <div className="text-left ml-5 text-2xl py-6">
            <p>👋 Willkommen</p>
          </div>
    
          {/* Navigation Items */}
          <nav className="flex flex-col mt-6 space-y-2">
            <NavItem icon={<FaTable />} label="Dashboard" />
            <NavItem icon={<FaDumbbell />} label="Exercises" />
            <NavItem icon={<FaCog />} label="Settings" />
          </nav>
    
          {/* Logout-Button am unteren Rand */}
          <button 
            className="text-sm text-blue-600 bg-white py-2 px-4 m-5  rounded-full mt-auto mb-20 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={onLogout}>
            Logout
          </button>
        </div>
      );
    };


export default Sidebar;
