import React, { useState } from 'react';
import Layout from '../../components/Layout/Layout';
import { HiDownload, HiTemplate, HiCheck, HiExclamation, HiCollection } from 'react-icons/hi';

const ImportTemplates = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [importStatus, setImportStatus] = useState(null); // 'success', 'error', or null
  const [availableTemplates, setAvailableTemplates] = useState([
    { id: 1, name: 'Team Meeting Notes', category: 'Notes', downloads: 1245 },
    { id: 2, name: 'Player Performance Review', category: 'Evaluation', downloads: 958 },
    { id: 3, name: 'Training Session Plan', category: 'Training', downloads: 2134 },
    { id: 4, name: 'Match Analysis', category: 'Analysis', downloads: 1678 },
    { id: 5, name: 'Season Planning', category: 'Planning', downloads: 872 },
  ]);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleImport = () => {
    // Simulate import process
    if (selectedFile) {
      setImportStatus('success');
      // In a real app, you would process the file here
    } else {
      setImportStatus('error');
    }
  };

  const handleTemplateDownload = (templateId) => {
    // Simulate template download
    console.log(`Downloading template ID: ${templateId}`);
    setImportStatus('success');
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Import Templates</h1>
        
        {/* Import from file section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <h2 className="text-xl font-semibold flex items-center">
              <HiTemplate className="mr-2 text-blue-600" />
              Import from File
            </h2>
          </div>
          <div className="p-6">
            <p className="text-gray-600 mb-4">
              Upload a template file (.json, .xml) to import templates into your account.
            </p>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6">
              {selectedFile ? (
                <div>
                  <p className="text-green-600 font-medium mb-2 flex items-center justify-center">
                    <HiCheck className="mr-1" /> File selected
                  </p>
                  <p className="text-gray-700">{selectedFile.name}</p>
                  <p className="text-gray-500 text-sm">
                    {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                  <button 
                    onClick={() => setSelectedFile(null)}
                    className="mt-3 text-sm text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <>
                  <HiDownload className="mx-auto h-10 w-10 text-gray-400 mb-3" />
                  <p className="text-gray-700 mb-2">Drag and drop your template file here</p>
                  <p className="text-gray-500 text-sm mb-4">or</p>
                  <label 
                    htmlFor="template-upload" 
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    Browse Files
                  </label>
                  <input 
                    id="template-upload" 
                    type="file" 
                    accept=".json,.xml" 
                    className="hidden" 
                    onChange={handleFileChange}
                  />
                </>
              )}
            </div>
            
            {importStatus === 'success' && (
              <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-4 flex items-center">
                <HiCheck className="text-green-600 mr-2" />
                <span className="text-green-800">Templates successfully imported!</span>
              </div>
            )}
            
            {importStatus === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4 flex items-center">
                <HiExclamation className="text-red-600 mr-2" />
                <span className="text-red-800">Please select a valid template file.</span>
              </div>
            )}
            
            <div className="flex justify-end">
              <button 
                onClick={handleImport}
                className={`${
                  selectedFile 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                } px-4 py-2 rounded-md transition-colors`}
                disabled={!selectedFile}
              >
                Import Templates
              </button>
            </div>
          </div>
        </div>
        
        {/* Available templates section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <h2 className="text-xl font-semibold flex items-center">
              <HiCollection className="mr-2 text-blue-600" />
              Available Templates
            </h2>
          </div>
          <div className="p-6">
            <p className="text-gray-600 mb-4">
              Browse and download ready-to-use templates from our collection.
            </p>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Template Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Downloads
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {availableTemplates.map((template) => (
                    <tr key={template.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{template.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {template.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {template.downloads.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => handleTemplateDownload(template.id)}
                          className="text-blue-600 hover:text-blue-900 font-medium"
                        >
                          Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ImportTemplates;
