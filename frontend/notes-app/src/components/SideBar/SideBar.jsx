import React, { useState } from 'react';
import {
  FaPen,
  FaDumbbell,
  FaTools,
  FaSignOutAlt,
  FaUser,
  FaUsers,
  FaClipboard,
  FaVideo,
} from 'react-icons/fa';
import { LuChevronFirst } from 'react-icons/lu';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';

const Sidebar = ({ onLogout }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [showNews, setShowNews] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === `/${path.toLowerCase()}`;

  const NavItem = ({ icon, label, onClick }) => {
    const active = isActive(label);

    return (
      <a
        href={label.toLowerCase() !== 'logout' ? `/${label.toLowerCase()}` : '#'}
        onClick={onClick}
        className={`group flex items-center w-full px-4 py-2 rounded-lg transition duration-200 ${
          active
            ? 'bg-blue-50 text-blue-600 shadow-md'
            : 'hover:bg-gray-100 hover:text-blue-600 text-white'
        } ${isCollapsed ? 'justify-center' : ''}`}
      >
        <span className="text-xl">{icon}</span>
        <span
          className={`ml-2 text-sm font-medium transition-all duration-300 ${
            isCollapsed
              ? 'hidden group-hover:block absolute left-20 bg-white text-gray-800 rounded px-2 py-1 shadow-lg'
              : 'block'
          }`}
        >
          {label}
        </span>
      </a>
    );
  };

  return (
    <div
      className={`fixed left-0 top-0 h-full bg-blue-700 text-white flex flex-col transition-all duration-300 z-50 ${
        isCollapsed ? 'w-16' : 'w-60'
      }`}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="text-white p-3 focus:outline-none flex items-center justify-center absolute top-0 right-0"
      >
        <LuChevronFirst
          className={`text-2xl transform transition-transform ${
            isCollapsed ? 'rotate-0' : 'rotate-180 items-center'
          }`}
        />
      </button>


      <nav className="flex flex-col space-y-2 mt-20 px-2 flex-grow">
        {!isCollapsed && <p className='text-xs px-2'>MENU</p>}
        <NavItem icon={<FaPen />} label="Notes" />
        <NavItem icon={<FaDumbbell />} label="Exercises" />
        <NavItem icon={<FaUsers />} label="Team" />
        <NavItem icon={<FaClipboard />} label="Tactic" />
        <NavItem icon={<FaVideo />} label="Video" />
      </nav>

      

      <div className="flex flex-col px-2 space-y-2 mb-4">
        {!isCollapsed && <p className='text-xs px-2'>OTHER</p>}
        <NavItem icon={<FaUser />} label="Profil" />
        <NavItem icon={<FaTools />} label="Settings" />
        <NavItem icon={<FaSignOutAlt />} label="Logout" onClick={handleLogout} />
      </div>
      {!isCollapsed && showNews && (
        <div className="bg-white text-black p-4 m-4 rounded-lg relative mt-16">
          <button
            onClick={() => setShowNews(false)}
            className="absolute top-2 right-2 text-black"
          >
            &times;
          </button>
          <h4 className="font-bold text-xs text-white bg-yellow-500 rounded-xl w-16 text-center mb-2 p-1">BETA V1</h4>
          <p className='text-xs'>Check out the new beta version! This is an example text for the news section.</p>
          <button className="bg-blue-600 mt-5 text-white text-sm px-2 py-1 rounded-lg mt-2">Update</button>
        </div>
      )}
    </div>
  );
};

const Layout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  
  return (
    <div className="flex">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div className="flex flex-col flex-grow">
        <nav>
        </nav>
        <main className="flex-grow p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
