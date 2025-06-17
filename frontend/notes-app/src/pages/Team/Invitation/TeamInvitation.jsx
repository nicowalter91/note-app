import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader, Card, Button, LoadingSpinner } from '../../../components/UI/DesignSystem';
import { FaUsers, FaUserCheck, FaUserTimes, FaCheckCircle } from 'react-icons/fa';
import { acceptInvitation } from '../../../utils/teamMembersService';

const TeamInvitation = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [invitation, setInvitation] = useState(null);
  const [status, setStatus] = useState('pending'); // 'pending', 'accepted', 'error'
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Hier würde man die Einladungsdetails laden
    // Für jetzt nehmen wir an, dass der Token gültig ist
    setInvitation({
      inviterName: 'Max Mustermann',
      role: 'Co-Trainer',
      teamName: 'FC Beispiel'
    });
  }, [token]);

  const handleAcceptInvitation = async () => {
    try {
      setLoading(true);
      await acceptInvitation(token);
      setStatus('accepted');
      setMessage('Willkommen im Team! Sie werden in Kürze weitergeleitet...');
      
      // Nach 2 Sekunden zum Dashboard weiterleiten
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
      
    } catch (error) {
      setStatus('error');
      setMessage('Fehler beim Annehmen der Einladung. Der Link könnte abgelaufen sein.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeclineInvitation = () => {
    setStatus('declined');
    setMessage('Sie haben die Einladung abgelehnt.');
  };

  const getRoleInfo = (role) => {
    const roles = {
      'assistant': { label: 'Co-Trainer', icon: FaUserCheck, color: 'blue' },
      'caretaker': { label: 'Betreuer', icon: FaUsers, color: 'green' },
      'physiotherapist': { label: 'Physiotherapeut', icon: FaUserCheck, color: 'purple' },
      'analyst': { label: 'Analyst', icon: FaUserCheck, color: 'yellow' }
    };
    return roles[role] || roles['assistant'];
  };

  if (!invitation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const roleInfo = getRoleInfo(invitation.role);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <Card className="text-center">
          <div className="p-8">
            {status === 'pending' && (
              <>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaUsers className="text-2xl text-blue-600" />
                </div>
                
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Team-Einladung
                </h1>
                
                <p className="text-gray-600 mb-6">
                  <strong>{invitation.inviterName}</strong> hat Sie eingeladen, dem Team <strong>{invitation.teamName}</strong> beizutreten.
                </p>
                
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-center space-x-2">
                    <roleInfo.icon className={`text-${roleInfo.color}-600`} />
                    <span className="font-medium">Ihre Rolle: {roleInfo.label}</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Button
                    variant="primary"
                    onClick={handleAcceptInvitation}
                    loading={loading}
                    className="w-full"
                  >
                    Einladung annehmen
                  </Button>
                  
                  <Button
                    variant="secondary"
                    onClick={handleDeclineInvitation}
                    disabled={loading}
                    className="w-full"
                  >
                    Ablehnen
                  </Button>
                </div>
              </>
            )}
            
            {status === 'accepted' && (
              <>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaCheckCircle className="text-2xl text-green-600" />
                </div>
                <h1 className="text-2xl font-bold text-green-800 mb-2">
                  Willkommen im Team!
                </h1>
                <p className="text-green-600">{message}</p>
              </>
            )}
            
            {(status === 'error' || status === 'declined') && (
              <>
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaUserTimes className="text-2xl text-red-600" />
                </div>
                <h1 className="text-2xl font-bold text-red-800 mb-2">
                  {status === 'error' ? 'Fehler' : 'Einladung abgelehnt'}
                </h1>
                <p className="text-red-600 mb-4">{message}</p>
                
                <Button
                  variant="secondary"
                  onClick={() => navigate('/login')}
                  className="w-full"
                >
                  Zur Anmeldung
                </Button>
              </>
            )}
          </div>
        </Card>
        
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Football Trainer App - Professionelles Team-Management
          </p>
        </div>
      </div>
    </div>
  );
};

export default TeamInvitation;
