import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';

// ProtectedRoute Komponente - prüft ob Benutzer angemeldet ist
const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = loading, true = authenticated, false = not authenticated
  
  useEffect(() => {
    const validateToken = async () => {
      // Prüfe ob ein Token im localStorage existiert
      const token = localStorage.getItem('token');
      
      if (!token) {
        setIsAuthenticated(false);
        return;
      }
      
      try {
        // Prüfe ob das Token noch gültig ist, indem wir eine Anfrage an den Server senden
        await axiosInstance.get('/get-user');
        setIsAuthenticated(true);
      } catch (error) {
        // Token ist ungültig oder abgelaufen
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      }
    };
    
    validateToken();
  }, []);
  
  // Loading state
  if (isAuthenticated === null) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        <span className="ml-3 text-gray-700">Authentifizierung wird überprüft...</span>
      </div>
    );
  }
  
  // Wenn nicht authentifiziert, leite zum Login weiter
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Wenn authentifiziert, zeige die geschützte Komponente
  return children;
};

export default ProtectedRoute;
