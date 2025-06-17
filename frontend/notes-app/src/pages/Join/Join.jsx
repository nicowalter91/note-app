import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, LoadingSpinner } from '../../components/UI/DesignSystem';
import { validateInvitationToken, acceptInvitation } from '../../utils/teamMembersService';
import { FaUsers, FaCheckCircle, FaTimesCircle, FaBuilding, FaClock } from 'react-icons/fa';

const Join = () => {
  const { token } = useParams();
  const navigate = useNavigate();  const [loading, setLoading] = useState(true);
  const [invitation, setInvitation] = useState(null);
  const [error, setError] = useState(null);
  const [accepting, setAccepting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    validateToken();
  }, [token]);

  const validateToken = async () => {
    try {
      setLoading(true);
      const response = await validateInvitationToken(token);
      setInvitation(response.invitation);
    } catch (error) {
      console.error('Fehler beim Validieren des Tokens:', error);
      setError('Ungültiger oder abgelaufener Einladungslink');
    } finally {
      setLoading(false);
    }
  };  const handleAcceptInvitation = async () => {
    try {
      setAccepting(true);
      const response = await acceptInvitation(token);
      
      if (response.success) {
        setSuccess(true);
        
        // Zeige spezielle Nachrichten basierend auf der Antwort
        if (response.isNewUser) {
          setError(null);
          setSuccess(false);
          setMessage(`Ein Account wurde für Sie erstellt!
          
E-Mail: ${response.userEmail}
Temporäres Passwort: ${response.temporaryPassword}

Bitte notieren Sie sich diese Daten und ändern Sie Ihr Passwort nach dem ersten Login.`);
          
          setTimeout(() => {
            navigate('/login?newUser=true&email=' + encodeURIComponent(response.userEmail));
          }, 5000);
        } else {
          setMessage('Einladung angenommen! Sie werden zur Login-Seite weitergeleitet...');
          setTimeout(() => {
            navigate('/login?email=' + encodeURIComponent(response.userEmail));
          }, 2000);
        }
      }
    } catch (error) {
      console.error('Fehler beim Annehmen der Einladung:', error);
      
      // Spezifische Behandlung für verschiedene Fehler
      if (error.response && error.response.status === 400) {
        const message = error.response.data.message;
        if (message.includes('registrieren') || message.includes('einloggen')) {
          setError('Sie müssen sich zuerst registrieren oder anmelden. Sie werden zur Login-Seite weitergeleitet...');
          setTimeout(() => {
            navigate(`/login?invite=${token}`);
          }, 3000);
          return;
        }
      }
      
      setError('Fehler beim Annehmen der Einladung. Bitte versuchen Sie es erneut.');
    } finally {
      setAccepting(false);
    }
  };

  const handleDecline = () => {
    navigate('/login');
  };

  const formatExpiryDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleDisplayName = (role) => {
    const roleMap = {
      assistant: 'Co-Trainer',
      caretaker: 'Betreuer',
      physiotherapist: 'Physiotherapeut',
      analyst: 'Analyst'
    };
    return roleMap[role] || role;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Einladung wird überprüft...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <div className="p-8 text-center">
            <FaTimesCircle className="mx-auto text-5xl text-red-500 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Ungültige Einladung</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button 
              variant="primary" 
              onClick={() => navigate('/login')}
              className="w-full"
            >
              Zur Anmeldung
            </Button>
          </div>
        </Card>
      </div>
    );
  }
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <div className="p-8 text-center">
            <FaCheckCircle className="mx-auto text-5xl text-green-500 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Willkommen im Team!</h1>
            <p className="text-gray-600 mb-6">
              Sie wurden erfolgreich zum Team hinzugefügt. Sie werden gleich weitergeleitet...
            </p>
            <LoadingSpinner />
          </div>
        </Card>
      </div>
    );
  }

  if (message) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="max-w-lg w-full">
          <div className="p-8 text-center">
            <FaCheckCircle className="mx-auto text-5xl text-blue-500 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Account erstellt!</h1>
            <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">{message}</pre>
            </div>
            <LoadingSpinner />
            <p className="text-sm text-gray-500 mt-2">Sie werden automatisch weitergeleitet...</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="max-w-lg w-full">
        <div className="p-8">
          <div className="text-center mb-8">
            <FaUsers className="mx-auto text-5xl text-blue-500 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Team-Einladung</h1>
            <p className="text-gray-600">Sie wurden eingeladen, einem Team beizutreten</p>
          </div>

          {invitation && (
            <div className="space-y-6">
              {/* Team Information */}
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <FaBuilding className="text-blue-600 mr-2" />
                  <h3 className="font-semibold text-gray-900">Team-Details</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Verein:</span>
                    <span className="font-medium">{invitation.clubName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Eingeladen von:</span>
                    <span className="font-medium">{invitation.inviterName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ihre Rolle:</span>
                    <span className="font-medium text-blue-600">
                      {getRoleDisplayName(invitation.role)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">E-Mail:</span>
                    <span className="font-medium">{invitation.email}</span>
                  </div>
                </div>
              </div>

              {/* Expiry Info */}
              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <FaClock className="text-yellow-600 mr-2" />
                  <span className="font-medium text-gray-900">Gültigkeit</span>
                </div>
                <p className="text-sm text-gray-600">
                  Diese Einladung läuft ab am: <strong>{formatExpiryDate(invitation.expiresAt)}</strong>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <Button
                  variant="primary"
                  onClick={handleAcceptInvitation}
                  loading={accepting}
                  disabled={accepting}
                  className="flex-1"
                >
                  <FaCheckCircle className="mr-2" />
                  Einladung annehmen
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDecline}
                  disabled={accepting}
                  className="flex-1"
                >
                  Ablehnen
                </Button>
              </div>

              <p className="text-xs text-gray-500 text-center">
                Mit dem Annehmen der Einladung treten Sie dem Team bei und erhalten Zugriff 
                entsprechend Ihrer zugewiesenen Rolle.
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Join;
