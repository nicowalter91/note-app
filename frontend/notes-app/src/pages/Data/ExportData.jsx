import React, { useState } from 'react';
import Layout from '../../components/Layout/Layout';
import { FaDownload, FaFileExport, FaFileAlt, FaFileExcel, FaFileCsv, FaCheck, FaInfo } from 'react-icons/fa';

const ExportData = () => {
  const [exportType, setExportType] = useState('notes');
  const [fileFormat, setFileFormat] = useState('json');
  const [dateRange, setDateRange] = useState('all');
  const [exportStatus, setExportStatus] = useState('idle'); // idle, generating, success, error
  const [errorMessage, setErrorMessage] = useState('');
  
  const handleExport = () => {
    // Simulierte Export-Funktion
    setExportStatus('generating');
    
    // Simuliere asynchronen Export
    setTimeout(() => {
      // Hier würde der tatsächliche Export-Code stehen
      console.log('Exporting', exportType, 'as', fileFormat, 'with date range', dateRange);
      
      // Simuliere erfolgreichen Export nach 2 Sekunden
      setExportStatus('success');
      
      // In einer echten App würde hier der Download initiiert werden
      // window.location.href = `/api/export/${exportType}?format=${fileFormat}&dateRange=${dateRange}`;
    }, 2000);
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Export Data</h1>
        
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-center mb-6">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <FaFileExport className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Data Export</h2>
              <p className="text-gray-600">Export your data in various formats for backup or analysis</p>
            </div>
          </div>
          
          {/* Export Type Selection */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">What would you like to export?</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div 
                onClick={() => setExportType('notes')}
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${
                  exportType === 'notes' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <FaFileAlt className="text-xl mr-3" />
                <span className="font-medium">Notes</span>
                {exportType === 'notes' && (
                  <FaCheck className="ml-auto text-blue-600" />
                )}
              </div>
              
              <div 
                onClick={() => setExportType('players')}
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${
                  exportType === 'players' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <FaFileExcel className="text-xl mr-3" />
                <span className="font-medium">Player Data</span>
                {exportType === 'players' && (
                  <FaCheck className="ml-auto text-blue-600" />
                )}
              </div>
              
              <div 
                onClick={() => setExportType('exercises')}
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${
                  exportType === 'exercises' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <FaFileCsv className="text-xl mr-3" />
                <span className="font-medium">Exercises</span>
                {exportType === 'exercises' && (
                  <FaCheck className="ml-auto text-blue-600" />
                )}
              </div>
              
              <div 
                onClick={() => setExportType('all')}
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${
                  exportType === 'all' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <FaFileExport className="text-xl mr-3" />
                <span className="font-medium">All Data</span>
                {exportType === 'all' && (
                  <FaCheck className="ml-auto text-blue-600" />
                )}
              </div>
            </div>
            
            {/* File Format Selection */}
            <h3 className="text-lg font-medium mb-4">Choose a file format</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div 
                onClick={() => setFileFormat('json')}
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${
                  fileFormat === 'json' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span className="font-mono text-xl mr-3">.json</span>
                <span className="font-medium">JSON Format</span>
                {fileFormat === 'json' && (
                  <FaCheck className="ml-auto text-blue-600" />
                )}
              </div>
              
              <div 
                onClick={() => setFileFormat('csv')}
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${
                  fileFormat === 'csv' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span className="font-mono text-xl mr-3">.csv</span>
                <span className="font-medium">CSV Format</span>
                {fileFormat === 'csv' && (
                  <FaCheck className="ml-auto text-blue-600" />
                )}
              </div>
              
              <div 
                onClick={() => setFileFormat('xlsx')}
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${
                  fileFormat === 'xlsx' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                } ${(exportType === 'notes' || exportType === 'all') ? 'opacity-50 cursor-not-allowed' : ''}`}
                {...((exportType === 'notes' || exportType === 'all') ? { onClick: () => {} } : {})}
              >
                <span className="font-mono text-xl mr-3">.xlsx</span>
                <span className="font-medium">Excel Format</span>
                {fileFormat === 'xlsx' && !(exportType === 'notes' || exportType === 'all') && (
                  <FaCheck className="ml-auto text-blue-600" />
                )}
              </div>
            </div>
            
            {/* Date Range Selection */}
            <h3 className="text-lg font-medium mb-4">Choose a date range</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div 
                onClick={() => setDateRange('all')}
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${
                  dateRange === 'all' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span className="font-medium">All Time</span>
                {dateRange === 'all' && (
                  <FaCheck className="ml-auto text-blue-600" />
                )}
              </div>
              
              <div 
                onClick={() => setDateRange('month')}
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${
                  dateRange === 'month' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span className="font-medium">Last Month</span>
                {dateRange === 'month' && (
                  <FaCheck className="ml-auto text-blue-600" />
                )}
              </div>
              
              <div 
                onClick={() => setDateRange('quarter')}
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${
                  dateRange === 'quarter' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span className="font-medium">Last Quarter</span>
                {dateRange === 'quarter' && (
                  <FaCheck className="ml-auto text-blue-600" />
                )}
              </div>
              
              <div 
                onClick={() => setDateRange('year')}
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${
                  dateRange === 'year' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <span className="font-medium">Last Year</span>
                {dateRange === 'year' && (
                  <FaCheck className="ml-auto text-blue-600" />
                )}
              </div>
            </div>
          </div>
          
          {/* Status and Export Button */}
          {exportStatus === 'generating' && (
            <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 mb-6" role="alert">
              <div className="flex items-center">
                <div className="mr-2 animate-spin">
                  <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <p>Generating export file...</p>
              </div>
            </div>
          )}
          
          {exportStatus === 'success' && (
            <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-6" role="alert">
              <div className="flex">
                <div className="mr-2">
                  <FaCheck />
                </div>
                <div>
                  <p className="font-medium">Export successful!</p>
                  <p>Your data has been exported successfully. Download should start automatically.</p>
                </div>
              </div>
            </div>
          )}
          
          {exportStatus === 'error' && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
              <div className="flex">
                <div className="mr-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Export failed</p>
                  <p>{errorMessage}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Format Compatibility Warning */}
          {fileFormat === 'xlsx' && (exportType === 'notes' || exportType === 'all') && (
            <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6" role="alert">
              <div className="flex items-start">
                <FaInfo className="mr-2 mt-1" />
                <div>
                  <p className="font-medium">Format Compatibility Issue</p>
                  <p>Excel format (.xlsx) is not compatible with notes export. Please choose JSON or CSV format.</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-center">
            <button
              onClick={handleExport}
              disabled={exportStatus === 'generating' || (fileFormat === 'xlsx' && (exportType === 'notes' || exportType === 'all'))}
              className={`flex items-center py-2 px-6 rounded-md font-medium ${
                exportStatus === 'generating' || (fileFormat === 'xlsx' && (exportType === 'notes' || exportType === 'all'))
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white transition'
              }`}
            >
              <FaDownload className="mr-2" />
              Export Data
            </button>
          </div>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="font-semibold mb-2">About Data Export</h3>
          <ul className="text-sm text-gray-700 space-y-2">
            <li className="flex items-start">
              <FaCheck className="text-blue-600 mt-1 mr-2" />
              <span>
                <strong>JSON format</strong> provides complete data including all relationships and is ideal for backup.
              </span>
            </li>
            <li className="flex items-start">
              <FaCheck className="text-blue-600 mt-1 mr-2" />
              <span>
                <strong>CSV format</strong> is great for importing into spreadsheet applications or data analysis tools.
              </span>
            </li>
            <li className="flex items-start">
              <FaCheck className="text-blue-600 mt-1 mr-2" />
              <span>
                <strong>Excel format</strong> is pre-formatted for easy viewing and is available for player and exercise data.
              </span>
            </li>
            <li className="flex items-start">
              <FaCheck className="text-blue-600 mt-1 mr-2" />
              <span>
                We recommend exporting your data regularly for backup purposes.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default ExportData;
