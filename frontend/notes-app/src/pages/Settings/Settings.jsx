import React, { useState, useEffect } from 'react'
import Layout from '../../components/Layout/Layout'
import { Tab } from '@headlessui/react'
import { LuBuilding, LuUsers } from 'react-icons/lu'
import UserManagement from '../UserManagement/UserManagement'
import axiosInstance from '../../utils/axiosInstance'
import Toast from '../../components/ToastMessage/Toast'

const Settings = () => {
  const [message, setMessage] = useState({ type: '', text: '' });
  const [clubSettings, setClubSettings] = useState({
    name: '',
    team: '',
    address: '',
    city: '',
    zipCode: '',
    primaryColor: '#000000',
    secondaryColor: '#ffffff',
    logo: null
  });

  useEffect(() => {
    const fetchClubSettings = async () => {
      try {
        const response = await axiosInstance.get('/club-settings');
        const settings = response.data;
        setClubSettings(prevSettings => ({
          ...prevSettings,
          ...settings,
          logo: settings.logo ? `${axiosInstance.defaults.baseURL}/${settings.logo}` : null
        }));
      } catch (error) {
        if (error.response?.status !== 404) {
          setMessage({
            type: 'error',
            text: 'Fehler beim Laden der Einstellungen'
          });
        }
      }
    };

    fetchClubSettings();
  }, []);

  const handleClubSettingsChange = (e) => {
    const { name, value } = e.target;
    setClubSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setClubSettings(prev => ({
        ...prev,
        logo: file
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(clubSettings).forEach(([key, value]) => {
        if (key === 'logo' && typeof value === 'string') {
          // Überspringen, wenn das Logo eine URL ist (also nicht geändert wurde)
          return;
        }
        formData.append(key, value);
      });

      await axiosInstance.post('/club-settings', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setMessage({
        type: 'success',
        text: 'Einstellungen erfolgreich gespeichert'
      });
    } catch (error) {
      console.error('Error saving club settings:', error);
      setMessage({
        type: 'error',
        text: 'Fehler beim Speichern der Einstellungen'
      });
    }
  };
  return (
    <Layout>
      <div className="p-6 bg-gray-100 min-h-screen">
        {message.text && (
          <Toast 
            message={message.text} 
            type={message.type} 
            onClose={() => setMessage({ type: '', text: '' })}
          />
        )}
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Einstellungen</h1>
        
        <Tab.Group>
          <Tab.List className="flex space-x-1 rounded-xl bg-white p-1 mb-6 shadow">
            <Tab className={({ selected }) =>
              `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
              ${selected 
                ? 'bg-blue-600 text-white shadow'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              } flex items-center justify-center space-x-2`
            }>
              <LuBuilding className="w-5 h-5" />
              <span>Vereinseinstellungen</span>
            </Tab>
            <Tab className={({ selected }) =>
              `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
              ${selected 
                ? 'bg-blue-600 text-white shadow'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              } flex items-center justify-center space-x-2`
            }>
              <LuUsers className="w-5 h-5" />
              <span>Benutzerverwaltung</span>
            </Tab>
          </Tab.List>

          <Tab.Panels>
            {/* Vereinseinstellungen Panel */}
            <Tab.Panel>
              <div className="bg-white rounded-xl shadow p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Logo Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vereinslogo
                    </label>
                    <div className="flex items-center space-x-6">
                      <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                        {clubSettings.logo ? (
                          <img
                            src={URL.createObjectURL(clubSettings.logo)}
                            alt="Vorschau"
                            className="max-w-full max-h-full p-2"
                          />
                        ) : (
                          <div className="text-center p-4">
                            <LuBuilding className="w-12 h-12 mx-auto text-gray-400" />
                            <p className="text-sm text-gray-500 mt-2">Logo hochladen</p>
                          </div>
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="block w-full text-sm text-gray-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-full file:border-0
                          file:text-sm file:font-semibold
                          file:bg-blue-50 file:text-blue-700
                          hover:file:bg-blue-100"
                      />
                    </div>
                  </div>

                  {/* Vereinsname */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vereinsname
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={clubSettings.name}
                      onChange={handleClubSettingsChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  {/* Mannschaft */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mannschaft
                    </label>
                    <input
                      type="text"
                      name="team"
                      value={clubSettings.team}
                      onChange={handleClubSettingsChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="z.B. U15"
                    />
                  </div>

                  {/* Anschrift */}
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Straße
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={clubSettings.address}
                        onChange={handleClubSettingsChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          PLZ
                        </label>
                        <input
                          type="text"
                          name="zipCode"
                          value={clubSettings.zipCode}
                          onChange={handleClubSettingsChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Stadt
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={clubSettings.city}
                          onChange={handleClubSettingsChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Vereinsfarben */}
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Primärfarbe
                      </label>
                      <input
                        type="color"
                        name="primaryColor"
                        value={clubSettings.primaryColor}
                        onChange={handleClubSettingsChange}
                        className="h-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sekundärfarbe
                      </label>
                      <input
                        type="color"
                        name="secondaryColor"
                        value={clubSettings.secondaryColor}
                        onChange={handleClubSettingsChange}
                        className="h-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Einstellungen speichern
                    </button>
                  </div>
                </form>
              </div>
            </Tab.Panel>

            {/* Benutzerverwaltung Panel */}
            <Tab.Panel>
              <UserManagement />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </Layout>
  )
}

export default Settings
