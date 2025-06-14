import React, { useState } from 'react';
import Layout from '../../components/Layout/Layout';
import { FaUpload, FaFileImport, FaFileAlt, FaFileExcel, FaFileCsv, FaCheck, FaInfo } from 'react-icons/fa';

const ImportData = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [importType, setImportType] = useState('notes');
  const [importStatus, setImportStatus] = useState('idle'); // idle, uploading, success, error
  const [errorMessage, setErrorMessage] = useState('');
  
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setImportStatus('idle');
      setErrorMessage('');
    }
  };
  
  const handleImportTypeChange = (type) => {
    setImportType(type);
    setImportStatus('idle');
    setErrorMessage('');
  };
  
  const handleImport = () => {
    if (!selectedFile) {
      setImportStatus('error');
      setErrorMessage('Please select a file to import');
      return;
    }
    
    // Simulierte Import-Funktion
    setImportStatus('uploading');
    
    // Simuliere asynchronen Import
    setTimeout(() => {
      // Hier würde der tatsächliche Import-Code stehen
      console.log('Importing', selectedFile.name, 'as', importType);
      
      // Simuliere erfolgreichen Import nach 2 Sekunden
      setImportStatus('success');
    }, 2000);
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Import Data</h1>
        
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-center mb-6">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <FaFileImport className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Data Import</h2>
              <p className="text-gray-600">Import your data from files in various formats</p>
            </div>
          </div>
          
          {/* Import Type Selection */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">What would you like to import?</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div 
                onClick={() => handleImportTypeChange('notes')}
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${
                  importType === 'notes' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <FaFileAlt className="text-xl mr-3" />
                <span className="font-medium">Notes</span>
                {importType === 'notes' && (
                  <FaCheck className="ml-auto text-blue-600" />
                )}
              </div>
              
              <div 
                onClick={() => handleImportTypeChange('players')}
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${
                  importType === 'players' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <FaFileExcel className="text-xl mr-3" />
                <span className="font-medium">Player Data</span>
                {importType === 'players' && (
                  <FaCheck className="ml-auto text-blue-600" />
                )}
              </div>
              
              <div 
                onClick={() => handleImportTypeChange('exercises')}
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${
                  importType === 'exercises' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <FaFileCsv className="text-xl mr-3" />
                <span className="font-medium">Exercises</span>
                {importType === 'exercises' && (
                  <FaCheck className="ml-auto text-blue-600" />
                )}
              </div>
            </div>
          </div>
          
          {/* File Upload Section */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Upload File</h3>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleFileChange}
                accept={
                  importType === 'notes' ? '.json, .txt' : 
                  importType === 'players' ? '.xlsx, .csv, .json' : 
                  '.csv, .json'
                }
              />
              
              {selectedFile ? (
                <div className="mb-4">
                  <div className="flex items-center justify-center mb-2">
                    <FaFileAlt className="text-blue-600 text-2xl mr-2" />
                    <span className="font-medium">{selectedFile.name}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {(selectedFile.size / 1024).toFixed(2)} KB
                  </span>
                </div>
              ) : (
                <div className="mb-4">
                  <FaUpload className="text-blue-600 text-3xl mx-auto mb-2" />
                  <p className="text-gray-600">
                    Drag and drop a file here, or click to select a file
                  </p>
                </div>
              )}
              
              <label
                htmlFor="file-upload"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md cursor-pointer transition"
              >
                {selectedFile ? 'Change File' : 'Select File'}
              </label>
            </div>
            
            {/* Supported Formats Info */}
            <div className="mt-4 flex items-start text-sm text-gray-600">
              <FaInfo className="text-blue-500 mr-2 mt-1" />
              <div>
                <p className="font-medium">Supported file formats:</p>
                <p>
                  {importType === 'notes' && 'JSON, TXT'}
                  {importType === 'players' && 'Excel (XLSX), CSV, JSON'}
                  {importType === 'exercises' && 'CSV, JSON'}
                </p>
              </div>
            </div>
          </div>
          
          {/* Status and Import Button */}
          {importStatus === 'uploading' && (
            <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 mb-6" role="alert">
              <div className="flex items-center">
                <div className="mr-2 animate-spin">
                  <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <p>Uploading and processing your file...</p>
              </div>
            </div>
          )}
          
          {importStatus === 'success' && (
            <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-6" role="alert">
              <div className="flex">
                <div className="mr-2">
                  <FaCheck />
                </div>
                <div>
                  <p className="font-medium">Import successful!</p>
                  <p>Your data has been imported successfully.</p>
                </div>
              </div>
            </div>
          )}
          
          {importStatus === 'error' && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
              <div className="flex">
                <div className="mr-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Import failed</p>
                  <p>{errorMessage}</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-center">
            <button
              onClick={handleImport}
              disabled={!selectedFile || importStatus === 'uploading'}
              className={`flex items-center py-2 px-6 rounded-md font-medium ${
                !selectedFile || importStatus === 'uploading'
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white transition'
              }`}
            >
              <FaFileImport className="mr-2" />
              Import Data
            </button>
          </div>
        </div>
        
        <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
          <h3 className="font-medium mb-1">Important Note</h3>
          <p className="text-sm">
            Importing data may overwrite existing data if there are conflicts. Make sure to back up your data before importing.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default ImportData;
