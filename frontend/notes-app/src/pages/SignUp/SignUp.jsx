import React, { useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import PasswordInput from '../../components/Input/PasswordInput';
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import bgImage from '../../assets/img/soccer_background.jpg'; // Hintergrundbild importieren

const SignUp = () => {
  // State-Hooks für Formularwerte
  const [name, setName] = useState(""); // Name des Benutzers
  const [email, setEmail] = useState(""); // Email des Benutzers
  const [password, setPassword] = useState(""); // Passwort des Benutzers
  const [error, setError] = useState(null); // Fehlerzustand
  const [isSubmitting, setIsSubmitting] = useState(false); // Zustand für Formularabsendung (Verhindert mehrfaches Absenden)

  // useNavigate-Hook von react-router-dom zum Weiterleiten auf eine andere Seite
  const navigate = useNavigate();

  // Handler für die Anmeldung
  const handleSignUp = async (e) => {
    e.preventDefault(); // Verhindert das Standardverhalten (Seiten-Reload) bei Absenden des Formulars

    // Vorab Validierungen der Eingabefelder
    if (!name) {
      setError("Please enter your name"); // Setzt eine Fehlermeldung, wenn der Name nicht eingegeben wurde
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address."); // Setzt eine Fehlermeldung, wenn die Email ungültig ist
      return;
    }

    if (!password) {
      setError("Please enter the password"); // Setzt eine Fehlermeldung, wenn das Passwort leer ist
      return;
    }

    setError("");  // Fehler zurücksetzen, falls alle Eingaben valide sind
    setIsSubmitting(true);  // Formular befindet sich im Absende-Zustand (Laden)

    try {
      // API-Aufruf zur Registrierung des Benutzers
      const response = await axiosInstance.post("/create-account", {
        fullName: name,
        email: email,
        password: password,
      });      // Erfolgsfall: Wenn ein accessToken zurückgegeben wird, wird der Benutzer eingeloggt
      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken); // Speichert das accessToken im LocalStorage
        navigate('/dashboard'); // Weiterleitung zur Dashboard-Seite
      } else {
        // Wenn kein Token zurückgegeben wird, wird eine Fehlernachricht gesetzt
        setError(response.data.message || "An error occurred during registration.");
      }

    } catch (error) {
      // Fehlerbehandlung für unerwartete Fehler
      setError(error?.response?.data?.message || "An unexpected error occurred. Please try again");
    } finally {
      // Schaltet den Absende-Zustand zurück, unabhängig vom Erfolg oder Fehler
      setIsSubmitting(false);
    }
  }

  return (
    <>
      {/* Navbar-Komponente */}
      <Navbar />

      {/* Haupt-Layout: Flexbox für zwei Spalten */}
      <div className='flex min-h-screen'>
        {/* Linke Seite: SignUp-Formular */}
        <div className='flex-1 flex items-center justify-center bg-white'>
          <div className='w-96 border rounded px-7 py-10'>
            <form onSubmit={handleSignUp}>
              {/* Formularüberschrift */}
              <h4 className="text-2xl mb-7 font-medium">SignUp</h4>
              <p className='text-sm font-thin'>SignUp for a new experience</p>

              <div className='mt-10'>
                {/* Eingabefeld für den Namen */}
                <input
                  type="text"
                  placeholder='Name'
                  className='input-box'
                  value={name}
                  onChange={(e) => setName(e.target.value)} // Ändert den Namen im State
                />

                {/* Eingabefeld für die E-Mail */}
                <input
                  type="text"
                  placeholder='Email'
                  className='input-box'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} // Ändert die E-Mail im State
                />

                {/* Passwort-Eingabefeld, verwendet eine separate Komponente */}
                <PasswordInput
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} // Ändert das Passwort im State
                />
              </div>

              {/* Wenn ein Fehler existiert, wird er hier angezeigt */}
              {error && <p className="text-red-500 text-xs pb-1">{error}</p>}

              {/* Submit-Button */}
              <button
                type='submit'
                className={`btn-primary ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isSubmitting} // Verhindert das Absenden bei laufendem Upload
              >
                {isSubmitting ? 'Creating Account...' : 'Create Account'} {/* Textänderung des Buttons während des Ladevorgangs */}
              </button>

              {/* Link zur Login-Seite, falls der Benutzer bereits ein Konto hat */}
              <p className='text-sm text-center mt-4'>
                Already have an account?{" "}
                <Link to="/login" className='font-medium text-primary underline'>
                  Login
                </Link>
              </p>
            </form>
          </div>
        </div>

        {/* Rechte Seite: Hintergrundbild */}
        <div className='flex-1 bg-cover bg-center' style={{ backgroundImage: `url(${bgImage})` }}>
          {/* Optionaler Inhalt für die rechte Seite */}
        </div>
      </div>
    </>
  );
};

export default SignUp;
