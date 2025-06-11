import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import axiosInstance from '../../utils/axiosInstance';
import { FaSave, FaTimes, FaArrowLeft } from 'react-icons/fa';
import Toast from '../../components/ToastMessage/Toast';

const AddEditPlayer = () => {
  const { playerId } = useParams();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isEdit, setIsEdit] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    number: '',
    birthdate: '',
    height: '',
    weight: '',
    notes: '',
    statistics: {
      gamesPlayed: 0,
      goals: 0,
      assists: 0,
      yellowCards: 0,
      redCards: 0
    },
    performanceMetrics: {
      technicalSkills: 5,
      tacticalUnderstanding: 5,
      physicalFitness: 5,
      mentalStrength: 5,
      teamwork: 5
    },
    strengths: [],
    weaknesses: []
  });

  useEffect(() => {
    getUserInfo();
    if (playerId) {
      setIsEdit(true);
      loadPlayer();
    }
  }, [playerId]);

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data?.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };
  const loadPlayer = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/get-player/${playerId}`);
      if (response.data?.player) {
        const player = response.data.player;
        setFormData({
          name: player.name || '',
          position: player.position || '',
          number: player.number || '',
          birthdate: player.birthdate ? player.birthdate.split('T')[0] : '',
          height: player.height || '',
          weight: player.weight || '',
          notes: player.notes || '',
          statistics: player.statistics || {
            gamesPlayed: 0,
            goals: 0,
            assists: 0,
            yellowCards: 0,
            redCards: 0
          },
          performanceMetrics: player.performanceMetrics || {
            technicalSkills: 5,
            tacticalUnderstanding: 5,
            physicalFitness: 5,
            mentalStrength: 5,
            teamwork: 5
          },
          strengths: player.strengths || [],
          weaknesses: player.weaknesses || []
        });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Fehler beim Laden des Spielers' });
      console.error('Error loading player:', error);
    } finally {
      setLoading(false);
    }
  };  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validierung
    if (!validateForm()) {
      setMessage({ type: 'error', text: 'Bitte überprüfen Sie die Eingaben' });
      return;
    }

    try {
      setSaving(true);
      
      if (isEdit) {
        const response = await axiosInstance.put(`/edit-player/${playerId}`, formData);
        if (response.data) {
          setMessage({ type: 'success', text: 'Spieler erfolgreich aktualisiert' });
          setTimeout(() => navigate('/team'), 1500);
        }
      } else {
        const response = await axiosInstance.post('/add-player', formData);
        if (response.data) {
          setMessage({ type: 'success', text: 'Spieler erfolgreich hinzugefügt' });
          setTimeout(() => navigate('/team'), 1500);
        }
      }
    } catch (error) {
      console.error('Error saving player:', error);
      if (error.response?.data?.message) {
        setMessage({ type: 'error', text: error.response.data.message });
      } else {
        setMessage({ type: 'error', text: 'Fehler beim Speichern des Spielers' });
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/team');
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name ist erforderlich';
    }
    
    if (!formData.position) {
      errors.position = 'Position ist erforderlich';
    }
    
    if (formData.number && (formData.number < 1 || formData.number > 99)) {
      errors.number = 'Trikotnummer muss zwischen 1 und 99 liegen';
    }
    
    if (formData.height && formData.height < 100) {
      errors.height = 'Größe muss mindestens 100 cm betragen';
    }
    
    if (formData.weight && formData.weight < 30) {
      errors.weight = 'Gewicht muss mindestens 30 kg betragen';
    }
    
    // Validiere Performance-Metriken
    Object.keys(formData.performanceMetrics).forEach(key => {
      const value = formData.performanceMetrics[key];
      if (value < 1 || value > 10) {
        errors[`performanceMetrics.${key}`] = 'Wert muss zwischen 1 und 10 liegen';
      }
    });
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const getFieldError = (fieldName) => {
    return formErrors[fieldName];
  };

  const getFieldClasses = (fieldName, baseClasses = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500") => {
    const hasError = formErrors[fieldName];
    if (hasError) {
      return baseClasses.replace('border-gray-300', 'border-red-300').replace('focus:border-blue-500', 'focus:border-red-500').replace('focus:ring-blue-500', 'focus:ring-red-500');
    }
    return baseClasses;
  };

  return (
    <Layout userInfo={userInfo}>
      {message.text && (
        <Toast type={message.type} message={message.text} onClose={() => setMessage({ type: '', text: '' })} />
      )}
      
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <button
                onClick={handleCancel}
                className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
              >
                <FaArrowLeft className="mr-2" /> Zurück zum Team
              </button>
              <h1 className="text-3xl font-bold text-gray-800">
                {isEdit ? 'Spieler bearbeiten' : 'Neuen Spieler hinzufügen'}
              </h1>
            </div>
          </div>          {/* Formular */}
          {loading ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Lade Spielerdaten...</span>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Grundinformationen */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Grundinformationen</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={getFieldClasses('name')}
                    />
                    {getFieldError('name') && (
                      <p className="mt-1 text-sm text-red-600">{getFieldError('name')}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Position *</label>
                    <select
                      required
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      className={getFieldClasses('position')}
                    >
                      <option value="">Bitte wählen</option>
                      <option value="Torwart">Torwart</option>
                      <option value="Verteidigung">Verteidigung</option>
                      <option value="Mittelfeld">Mittelfeld</option>
                      <option value="Sturm">Sturm</option>
                    </select>
                    {getFieldError('position') && (
                      <p className="mt-1 text-sm text-red-600">{getFieldError('position')}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Trikotnummer</label>
                    <input
                      type="number"
                      value={formData.number}
                      onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                      className={getFieldClasses('number')}
                    />
                    {getFieldError('number') && (
                      <p className="mt-1 text-sm text-red-600">{getFieldError('number')}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Geburtsdatum</label>
                    <input
                      type="date"
                      value={formData.birthdate}
                      onChange={(e) => setFormData({ ...formData, birthdate: e.target.value })}
                      className={getFieldClasses('birthdate')}
                    />
                    {getFieldError('birthdate') && (
                      <p className="mt-1 text-sm text-red-600">{getFieldError('birthdate')}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Größe (cm)</label>
                    <input
                      type="number"
                      value={formData.height}
                      onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                      className={getFieldClasses('height')}
                    />
                    {getFieldError('height') && (
                      <p className="mt-1 text-sm text-red-600">{getFieldError('height')}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Gewicht (kg)</label>
                    <input
                      type="number"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      className={getFieldClasses('weight')}
                    />
                    {getFieldError('weight') && (
                      <p className="mt-1 text-sm text-red-600">{getFieldError('weight')}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Statistiken */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Spielerstatistiken</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Spiele</label>
                    <input
                      type="number"
                      value={formData.statistics.gamesPlayed}
                      onChange={(e) => setFormData({ ...formData, statistics: { ...formData.statistics, gamesPlayed: parseInt(e.target.value) || 0 } })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tore</label>
                    <input
                      type="number"
                      value={formData.statistics.goals}
                      onChange={(e) => setFormData({ ...formData, statistics: { ...formData.statistics, goals: parseInt(e.target.value) || 0 } })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Assists</label>
                    <input
                      type="number"
                      value={formData.statistics.assists}
                      onChange={(e) => setFormData({ ...formData, statistics: { ...formData.statistics, assists: parseInt(e.target.value) || 0 } })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Gelbe Karten</label>
                    <input
                      type="number"
                      value={formData.statistics.yellowCards}
                      onChange={(e) => setFormData({ ...formData, statistics: { ...formData.statistics, yellowCards: parseInt(e.target.value) || 0 } })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Rote Karten</label>
                    <input
                      type="number"
                      value={formData.statistics.redCards}
                      onChange={(e) => setFormData({ ...formData, statistics: { ...formData.statistics, redCards: parseInt(e.target.value) || 0 } })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Performance Metriken */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Leistungskennzahlen (1-10)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Technische Fähigkeiten</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={formData.performanceMetrics.technicalSkills}
                      onChange={(e) => setFormData({ ...formData, performanceMetrics: { ...formData.performanceMetrics, technicalSkills: parseInt(e.target.value) || 5 } })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Taktisches Verständnis</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={formData.performanceMetrics.tacticalUnderstanding}
                      onChange={(e) => setFormData({ ...formData, performanceMetrics: { ...formData.performanceMetrics, tacticalUnderstanding: parseInt(e.target.value) || 5 } })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Kondition</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={formData.performanceMetrics.physicalFitness}
                      onChange={(e) => setFormData({ ...formData, performanceMetrics: { ...formData.performanceMetrics, physicalFitness: parseInt(e.target.value) || 5 } })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Mentale Stärke</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={formData.performanceMetrics.mentalStrength}
                      onChange={(e) => setFormData({ ...formData, performanceMetrics: { ...formData.performanceMetrics, mentalStrength: parseInt(e.target.value) || 5 } })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Teamwork</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={formData.performanceMetrics.teamwork}
                      onChange={(e) => setFormData({ ...formData, performanceMetrics: { ...formData.performanceMetrics, teamwork: parseInt(e.target.value) || 5 } })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Notizen */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Notizen</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Zusätzliche Informationen über den Spieler..."
                />
              </div>

              {/* Aktions-Buttons */}
              <div className="flex justify-end space-x-4 pt-4 border-t">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex items-center px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  <FaTimes className="mr-2" />
                  Abbrechen
                </button>                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {isEdit ? 'Aktualisiere...' : 'Erstelle...'}
                    </>
                  ) : (
                    <>
                      <FaSave className="mr-2" />
                      {isEdit ? 'Aktualisieren' : 'Hinzufügen'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AddEditPlayer;
