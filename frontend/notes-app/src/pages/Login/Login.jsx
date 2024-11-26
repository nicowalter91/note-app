import React, { useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import { Link, useNavigate } from "react-router-dom";
import PasswordInput from '../../components/Input/PasswordInput';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';

// Erweiterte E-Mail-Validierung mit Regex
const isValidEmail = (email) => {
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return emailPattern.test(email);
};

const Login = () => {
  const [email, setEmail] = useState(""); // Zustand für E-Mail
  const [password, setPassword] = useState(""); // Zustand für Passwort
  const [error, setError] = useState(null); // Zustand für Fehlernachricht

  const navigate = useNavigate(); // React Router Hook für Navigation

  // Login-Handler
  const handleLogin = async (e) => {
    e.preventDefault(); // Verhindert das Standardformularverhalten (Seiten-Reload)

    // Erweiterte E-Mail-Validierung
    if (!isValidEmail(email)) {
      setError("Bitte gib eine gültige E-Mail-Adresse ein.");
      return;
    }

    // Überprüfen, ob das Passwort eingegeben wurde
    if (!password) {
      setError("Bitte gib ein Passwort ein.");
      return;
    }

    setError(""); // Fehler zurücksetzen, wenn alle Validierungen bestanden sind

    // Login API Call
    try {
      const response = await axiosInstance.post("/login", {
        email: email,
        password: password,
      });

      // Erfolgreiche Login-Antwort
      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken); // Token im Local Storage speichern
        navigate("/dashboard"); // Benutzer zum Dashboard weiterleiten
      }
    } catch (error) {
      // Fehlerbehandlung
      if (error.response) {
        if (error.response.status === 401) {
          setError("Falsche E-Mail-Adresse oder Passwort.");
        } else if (error.response.data && error.response.data.message) {
          setError(error.response.data.message); // Serverfehlernachricht anzeigen
        } else {
          setError("Ein unerwarteter Fehler ist aufgetreten. Bitte versuche es später noch einmal.");
        }
      } else {
        // Fehler, wenn keine Antwort vom Server kommt (z.B. Netzwerkfehler)
        setError("Netzwerkfehler. Bitte überprüfe deine Internetverbindung.");
      }
    }
  };

  return (
    <>
      <Navbar /> {/* Navbar anzeigen */}

      <div className='flex items-center justify-center mt-28'>
        <div className='w-96 border rounded bg-white px-7 py-10'>
          <form onSubmit={handleLogin}>
            <h4 className="text-2xl mb-7">LogIn</h4>

            {/* Eingabefeld für E-Mail */}
            <input 
              type="text" 
              placeholder='E-Mail' 
              className='input-box' 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />

            {/* Passwort-Eingabefeld */}
            <PasswordInput 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />

            {/* Anzeige der Fehlermeldung, falls vorhanden */}
            {error && <p className="text-red-500 text-xs pb-1">{error}</p>}

            {/* Login-Button */}
            <button type='submit' className='btn-primary'>Login</button>

            {/* Link zum Erstellen eines Kontos, falls der Benutzer noch nicht registriert ist */}
            <p className='text-sm text-center mt-4'>
              Noch nicht registriert?{" "}
              <Link to="/signUp" className='font-medium text-primary underline'>
                Erstelle ein Konto
              </Link>
            </p>
          
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
