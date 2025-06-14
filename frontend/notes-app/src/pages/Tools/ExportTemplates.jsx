import React, { useState } from 'react';
import Layout from '../../components/Layout/Layout';
import { HiUpload, HiTemplate, HiCheck, HiDocumentReport, HiExclamation, HiDownload } from 'react-icons/hi';

const ExportTemplates = () => {
  const [exportFormat, setExportFormat] = useState('json');
  const [selectedTemplates, setSelectedTemplates] = useState([]);
  const [exportStatus, setExportStatus] = useState(null); // 'success', 'error', or null
  
  const templates = [
    { id: 1, name: 'Weekly Training Plan', category: 'Training', lastModified: '2023-09-15' },
    { id: 2, name: 'Player Performance Review', category: 'Evaluation', lastModified: '2023-10-02' },
    { id: 3, name: 'Match Analysis Form', category: 'Analysis', lastModified: '2023-08-28' },
    { id: 4, name: 'Team Meeting Notes', category: 'Notes', lastModified: '2023-09-30' },
    { id: 5, name: 'Season Planning Template', category: 'Planning', lastModified: '2023-07-15' },
  ];

  const handleCheckboxChange = (templateId) => {
    setSelectedTemplates(prev => {
      if (prev.includes(templateId)) {
        return prev.filter(id => id !== templateId);
      } else {
        return [...prev, templateId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedTemplates.length === templates.length) {
      setSelectedTemplates([]);
    } else {
      setSelectedTemplates(templates.map(t => t.id));
    }
  };

  const handleExport = () => {
    if (selectedTemplates.length === 0) {
      setExportStatus('error');
      return;
    }
    
    setExportStatus('success');
    // In a real app, you would initiate the export process here
    
    // Simulate download after a delay
    setTimeout(() => {
      setExportStatus(null);
    }, 3000);
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Export Templates</h1>
        
        {/* Export options */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <h2 className="text-xl font-semibold flex items-center">
              <HiTemplate className="mr-2 text-blue-600" />
              Export Options
            </h2>
          </div>
          <div className="p-6">
            <p className="text-gray-600 mb-4">
              Select the format and templates you want to export. You can use these templates 
              on other devices or share them with your team.
            </p>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Export Format</label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio h-4 w-4 text-blue-600"
                    checked={exportFormat === 'json'}
                    onChange={() => setExportFormat('json')}
                  />
                  <span className="ml-2">JSON</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio h-4 w-4 text-blue-600"
                    checked={exportFormat === 'xml'}
                    onChange={() => setExportFormat('xml')}
                  />
                  <span className="ml-2">XML</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio h-4 w-4 text-blue-600"
                    checked={exportFormat === 'csv'}
                    onChange={() => setExportFormat('csv')}
                  />
                  <span className="ml-2">CSV</span>
                </label>
              </div>
            </div>
            
            {exportStatus === 'success' && (
              <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-4 flex items-center">
                <HiCheck className="text-green-600 mr-2" />
                <span className="text-green-800">Templates successfully exported! Downloading file...</span>
              </div>
            )}
            
            {exportStatus === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4 flex items-center">
                <HiExclamation className="text-red-600 mr-2" />
                <span className="text-red-800">Please select at least one template to export.</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Template selection */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold flex items-center">
              <HiDocumentReport className="mr-2 text-blue-600" />
              Your Templates
            </h2>
            <button 
              onClick={handleSelectAll}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {selectedTemplates.length === templates.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">
                      <span className="sr-only">Select</span>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Template Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Modified
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {templates.map((template) => (
                    <tr key={template.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          className="form-checkbox h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                          checked={selectedTemplates.includes(template.id)}
                          onChange={() => handleCheckboxChange(template.id)}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{template.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {template.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {template.lastModified}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button 
                onClick={handleExport}
                className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                  selectedTemplates.length > 0
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
                disabled={selectedTemplates.length === 0}
              >
                <HiDownload className="mr-2" />
                Export Selected Templates
              </button>
            </div>
          </div>
        </div>
        
        {/* Tips section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-blue-800 font-medium mb-2">Export Tips</h3>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• JSON format is recommended for full template functionality</li>
            <li>• CSV format is best for viewing data in spreadsheet applications</li>
            <li>• You can import these templates on any device with mytacticlab installed</li>
            <li>• Templates do not include linked data (e.g., player information)</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default ExportTemplates;
