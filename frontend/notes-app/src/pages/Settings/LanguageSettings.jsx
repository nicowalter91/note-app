import React, { useState } from 'react';
import Layout from '../../components/Layout/Layout';
import { FaGlobe, FaCheck, FaSave } from 'react-icons/fa';

const LanguageSettings = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  const [timeFormat, setTimeFormat] = useState('12');
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
  ];
  
  const handleSave = () => {
    // Hier würde der Code zum Speichern der Spracheinstellungen im Backend stehen
    console.log('Saving language settings:', {
      language: selectedLanguage,
      dateFormat,
      timeFormat
    });
    
    // Erfolgreiche Speicherung simulieren
    setSaveSuccess(true);
    
    // Nach 3 Sekunden die Erfolgsmeldung ausblenden
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Language Settings</h1>
          
          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md flex items-center transition"
          >
            <FaSave className="mr-2" />
            Save Changes
          </button>
        </div>
        
        {saveSuccess && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded" role="alert">
            <p className="font-medium">Success!</p>
            <p>Your language settings have been updated.</p>
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-6 border-b">
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <FaGlobe className="text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Application Language</h2>
                <p className="text-gray-600">Select your preferred language for the application interface</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {languages.map((language) => (
                <div
                  key={language.code}
                  onClick={() => setSelectedLanguage(language.code)}
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${
                    selectedLanguage === language.code 
                      ? 'border-blue-500 bg-blue-50 text-blue-700' 
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-2xl mr-3">{language.flag}</span>
                  <span className="font-medium">{language.name}</span>
                  {selectedLanguage === language.code && (
                    <FaCheck className="ml-auto text-blue-600" />
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold mb-4">Date Format</h2>
            <p className="text-gray-600 mb-6">Choose how dates are displayed across the application</p>
            
            <div className="space-y-3">
              <div 
                onClick={() => setDateFormat('MM/DD/YYYY')}
                className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition ${
                  dateFormat === 'MM/DD/YYYY' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div>
                  <h3 className="font-medium">MM/DD/YYYY</h3>
                  <p className="text-sm text-gray-500">Example: 06/14/2025</p>
                </div>
                {dateFormat === 'MM/DD/YYYY' && (
                  <FaCheck className="text-blue-600" />
                )}
              </div>
              
              <div 
                onClick={() => setDateFormat('DD/MM/YYYY')}
                className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition ${
                  dateFormat === 'DD/MM/YYYY' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div>
                  <h3 className="font-medium">DD/MM/YYYY</h3>
                  <p className="text-sm text-gray-500">Example: 14/06/2025</p>
                </div>
                {dateFormat === 'DD/MM/YYYY' && (
                  <FaCheck className="text-blue-600" />
                )}
              </div>
              
              <div 
                onClick={() => setDateFormat('YYYY-MM-DD')}
                className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition ${
                  dateFormat === 'YYYY-MM-DD' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div>
                  <h3 className="font-medium">YYYY-MM-DD</h3>
                  <p className="text-sm text-gray-500">Example: 2025-06-14</p>
                </div>
                {dateFormat === 'YYYY-MM-DD' && (
                  <FaCheck className="text-blue-600" />
                )}
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Time Format</h2>
            <p className="text-gray-600 mb-6">Choose how time is displayed across the application</p>
            
            <div className="space-y-3">
              <div 
                onClick={() => setTimeFormat('12')}
                className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition ${
                  timeFormat === '12' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div>
                  <h3 className="font-medium">12-hour format</h3>
                  <p className="text-sm text-gray-500">Example: 2:30 PM</p>
                </div>
                {timeFormat === '12' && (
                  <FaCheck className="text-blue-600" />
                )}
              </div>
              
              <div 
                onClick={() => setTimeFormat('24')}
                className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition ${
                  timeFormat === '24' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div>
                  <h3 className="font-medium">24-hour format</h3>
                  <p className="text-sm text-gray-500">Example: 14:30</p>
                </div>
                {timeFormat === '24' && (
                  <FaCheck className="text-blue-600" />
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="font-semibold mb-2">Note about Language Changes</h3>
          <p className="text-sm text-gray-600 mb-2">
            Changing the language will affect all text in the application interface. Some content like notes and user-generated data will remain in their original language.
          </p>
          <p className="text-sm text-gray-600">
            A page refresh may be required for all changes to take effect.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default LanguageSettings;
