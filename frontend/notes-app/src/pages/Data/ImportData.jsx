import React, { useState } from 'react';
import Layout from '../../components/Layout/Layout';
import { PageHeader, Card, Button, Badge, LoadingSpinner } from '../../components/UI/DesignSystem';
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
        <PageHeader 
          title="Daten importieren"
          subtitle="Importieren Sie Ihre Daten aus verschiedenen Dateiformaten"
        />
        
        <Card className="p-8 mb-8">
          <div className="flex items-center mb-6">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <FaFileImport className="text-blue-600" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Datenimport</h2>
              <p className="text-gray-600">Importieren Sie Ihre Daten aus Dateien in verschiedenen Formaten</p>
            </div>
          </div>
          
          {/* Import Type Selection */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Was möchten Sie importieren?</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card 
                onClick={() => handleImportTypeChange('notes')}
                className={`p-4 cursor-pointer transition border-l-4 ${
                  importType === 'notes' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <FaFileAlt className="text-xl mr-3" />
                  <span className="font-medium">Aufgaben</span>
                  {importType === 'notes' && (
                    <FaCheck className="ml-auto text-blue-600" />
                  )}
                </div>
              </Card>
              
              <Card 
                onClick={() => handleImportTypeChange('players')}
                className={`p-4 cursor-pointer transition border-l-4 ${
                  importType === 'players' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <FaFileExcel className="text-xl mr-3" />
                  <span className="font-medium">Spielerdaten</span>
                  {importType === 'players' && (
                    <FaCheck className="ml-auto text-blue-600" />
                  )}
                </div>
              </Card>
              
              <Card 
                onClick={() => handleImportTypeChange('exercises')}
                className={`p-4 cursor-pointer transition border-l-4 ${
                  importType === 'exercises' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <FaFileCsv className="text-xl mr-3" />
                  <span className="font-medium">Übungen</span>
                  {importType === 'exercises' && (
                    <FaCheck className="ml-auto text-blue-600" />
                  )}
                </div>
              </Card>
            </div>
          </div>
            {/* File Upload Section */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Datei hochladen</h3>
            
            <Card className="border-2 border-dashed border-gray-300 p-8 text-center hover:border-blue-400 transition-colors">
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
                  <Badge variant="info" className="text-sm">
                    {(selectedFile.size / 1024).toFixed(2)} KB
                  </Badge>
                </div>
              ) : (
                <div className="mb-4">
                  <FaUpload className="text-blue-600 text-3xl mx-auto mb-2" />
                  <p className="text-gray-600">
                    Datei hierher ziehen oder klicken, um eine Datei auszuwählen
                  </p>
                </div>
              )}
              
              <Button
                as="label"
                htmlFor="file-upload"
                variant="primary"
                className="cursor-pointer"
              >
                {selectedFile ? 'Datei ändern' : 'Datei auswählen'}
              </Button>
            </Card>
            
            {/* Supported Formats Info */}
            <Card className="mt-4 bg-blue-50 border-blue-200">
              <div className="flex items-start text-sm text-gray-600">
                <FaInfo className="text-blue-500 mr-2 mt-1" />
                <div>
                  <p className="font-medium">Unterstützte Dateiformate:</p>
                  <p>
                    {importType === 'notes' && 'JSON, TXT'}
                    {importType === 'players' && 'Excel (XLSX), CSV, JSON'}
                    {importType === 'exercises' && 'CSV, JSON'}
                  </p>
                </div>
              </div>
            </Card>
          </div>
            {/* Status and Import Button */}
          {importStatus === 'uploading' && (
            <Card className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 mb-6">
              <div className="flex items-center">
                <LoadingSpinner size="sm" className="mr-2" />
                <p>Datei wird hochgeladen und verarbeitet...</p>
              </div>
            </Card>
          )}
          
          {importStatus === 'success' && (
            <Card className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-6">
              <div className="flex">
                <div className="mr-2">
                  <FaCheck />
                </div>
                <div>
                  <p className="font-medium">Import erfolgreich!</p>
                  <p>Ihre Daten wurden erfolgreich importiert.</p>
                </div>
              </div>
            </Card>
          )}
          
          {importStatus === 'error' && (
            <Card className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6">
              <div className="flex">
                <div className="mr-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Import fehlgeschlagen</p>
                  <p>{errorMessage}</p>
                </div>
              </div>
            </Card>
          )}
          
          <div className="flex justify-center">
            <Button
              onClick={handleImport}
              disabled={!selectedFile || importStatus === 'uploading'}
              variant={!selectedFile || importStatus === 'uploading' ? 'secondary' : 'primary'}
              className="flex items-center"
            >
              <FaFileImport className="mr-2" />
              Daten importieren
            </Button>
          </div>
        </Card>
        
        <Card className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 p-4">
          <h3 className="font-medium mb-1 flex items-center">
            <FaInfo className="mr-2" />
            Wichtiger Hinweis
          </h3>
          <p className="text-sm">
            Das Importieren von Daten kann vorhandene Daten überschreiben, wenn es Konflikte gibt. Stellen Sie sicher, dass Sie Ihre Daten sichern, bevor Sie importieren.
          </p>
        </Card>
      </div>
    </Layout>
  );
};

export default ImportData;
