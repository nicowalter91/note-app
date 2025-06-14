import React, { useState } from 'react';
import Layout from '../../components/Layout/Layout';
import { FaBell, FaEnvelope, FaMobile, FaDesktop, FaSave } from 'react-icons/fa';

const NotificationSettings = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    desktopNotifications: true,
    notifications: {
      newNotes: true,
      comments: true,
      reminders: true,
      teamUpdates: true,
      systemUpdates: false
    }
  });
  
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const handleToggle = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  const handleNotificationToggle = (key) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key]
      }
    }));
  };
  
  const handleSave = () => {
    // Hier würde der Code zum Speichern der Einstellungen im Backend stehen
    console.log('Saving notification settings:', settings);
    
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
          <h1 className="text-3xl font-bold">Notification Settings</h1>
          
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
            <p>Your notification settings have been updated.</p>
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold mb-4">Notification Channels</h2>
            <p className="text-gray-600 mb-6">Choose how you want to receive notifications</p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <FaEnvelope className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-sm text-gray-500">Receive notifications via email</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={settings.emailNotifications}
                    onChange={() => handleToggle('emailNotifications')}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <FaMobile className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Push Notifications</h3>
                    <p className="text-sm text-gray-500">Receive push notifications on your mobile device</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={settings.pushNotifications}
                    onChange={() => handleToggle('pushNotifications')}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <FaDesktop className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Desktop Notifications</h3>
                    <p className="text-sm text-gray-500">Receive notifications in your browser</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={settings.desktopNotifications}
                    onChange={() => handleToggle('desktopNotifications')}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Notification Types</h2>
            <p className="text-gray-600 mb-6">Choose which notifications you want to receive</p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">New Notes</h3>
                  <p className="text-sm text-gray-500">Notifications about new notes</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={settings.notifications.newNotes}
                    onChange={() => handleNotificationToggle('newNotes')}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Comments</h3>
                  <p className="text-sm text-gray-500">Notifications about comments on your notes</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={settings.notifications.comments}
                    onChange={() => handleNotificationToggle('comments')}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Reminders</h3>
                  <p className="text-sm text-gray-500">Reminder notifications for scheduled events</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={settings.notifications.reminders}
                    onChange={() => handleNotificationToggle('reminders')}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Team Updates</h3>
                  <p className="text-sm text-gray-500">Notifications about team changes and updates</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={settings.notifications.teamUpdates}
                    onChange={() => handleNotificationToggle('teamUpdates')}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">System Updates</h3>
                  <p className="text-sm text-gray-500">Notifications about system updates and maintenance</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={settings.notifications.systemUpdates}
                    onChange={() => handleNotificationToggle('systemUpdates')}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-6">
          <div className="flex items-start">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <FaBell className="text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Notification Schedule</h3>
              <p className="text-sm text-gray-600">
                You can set quiet hours for notifications in your account settings. During quiet hours, notifications will be collected but not delivered until the quiet period ends.
              </p>
              <a href="/settings" className="text-blue-600 hover:underline text-sm mt-2 inline-block">
                Configure Quiet Hours
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotificationSettings;
