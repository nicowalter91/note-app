import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/SideBar/SideBar.jsx';
import Toast from '../../components/ToastMessage/Toast';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';

const Layout = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message: "",
    type: null,
  });

  const navigate = useNavigate();

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  const showToastMessage = (message, type) => {
    setShowToastMsg({
      isShown: true,
      message,
      type,
    });
  };

  const handleCloseToast = () => {
    setShowToastMsg({
      isShown: false,
      message: "",
    });
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <div className="h-screen flex flex-col">
      {/* Navbar oben fixiert */}
      <div className="fixed top-0 left-0 right-0 z-10">
        <Navbar
          userInfo={userInfo}
          onSearchNote={() => {}}
          handleClearSearch={() => {}}
        />
      </div>

      {/* Flex-Container für Sidebar und Hauptinhalt */}
      <div className="flex flex-1 pt-16">
        {/* Sidebar links */}
        <div className="w-64 bg-blue-600 text-white h-full fixed top-16 left-0 bottom-0">
          <Sidebar
            userInfo={userInfo}
            onLogout={() => {
              localStorage.clear();
              navigate("/login");
            }}
          />
        </div>

        {/* Hauptinhalt rechts */}
        <div className="flex-1 ml-64 p-6 overflow-y-auto">{children}</div>
      </div>

      {/* Toast-Benachrichtigung */}
      <Toast
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={handleCloseToast}
      />
    </div>
  );
};

export default Layout;
