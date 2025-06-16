import React, { useState, useEffect } from 'react';
import { HiX, HiUpload, HiTrash } from 'react-icons/hi';
import axiosInstance from '../../../utils/axiosInstance';

const AddEditFinanceModal = ({ entry, onClose, onSave, showToast }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    type: 'expense',
    category: 'other',
    date: new Date().toISOString().split('T')[0]
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [existingReceipt, setExistingReceipt] = useState(null);
  const [loading, setLoading] = useState(false);

  const categories = {
    equipment: 'Ausrüstung',
    travel: 'Reisen',
    tournament: 'Turniere',
    training: 'Training',
    maintenance: 'Wartung',
    fees: 'Gebühren',
    sponsorship: 'Sponsoring',
    donations: 'Spenden',
    fundraising: 'Fundraising',
    other: 'Sonstiges'
  };

  useEffect(() => {
    if (entry) {
      setFormData({
        title: entry.title || '',
        description: entry.description || '',
        amount: entry.amount?.toString() || '',
        type: entry.type || 'expense',
        category: entry.category || 'other',
        date: entry.date ? new Date(entry.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
      });
      setExistingReceipt(entry.receipt || null);
    }
  }, [entry]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        showToast('Die Datei ist zu groß. Maximale Größe: 10MB', 'error');
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        showToast('Nicht unterstützter Dateityp. Erlaubt: JPEG, PNG, PDF, DOC, DOCX', 'error');
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      showToast('Titel ist erforderlich', 'error');
      return;
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      showToast('Gültiger Betrag ist erforderlich', 'error');
      return;
    }

    try {
      setLoading(true);

      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title.trim());
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('amount', parseFloat(formData.amount));
      formDataToSend.append('type', formData.type);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('date', formData.date);

      if (selectedFile) {
        formDataToSend.append('receipt', selectedFile);
      }

      let response;
      if (entry) {
        // Edit existing entry
        response = await axiosInstance.put(`/team-finance/${entry._id}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        // Add new entry
        response = await axiosInstance.post('/team-finance', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      if (response.data && !response.data.error) {
        showToast(
          entry ? 'Eintrag erfolgreich aktualisiert' : 'Eintrag erfolgreich hinzugefügt',
          'success'
        );
        onSave();
      }
    } catch (error) {
      console.error('Error saving finance entry:', error);
      const errorMessage = error.response?.data?.message || 'Fehler beim Speichern des Eintrags';
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    // Reset file input
    const fileInput = document.getElementById('receipt-file');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {entry ? 'Eintrag bearbeiten' : 'Neuer Eintrag'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2"
          >
            <HiX className="text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titel *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              placeholder="z.B. Neue Bälle, Turnieranmeldung, Sponsoring..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Beschreibung
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              placeholder="Zusätzliche Details..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Type and Amount */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Typ *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="expense">Ausgabe</option>
                <option value="income">Einnahme</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Betrag (€) *
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                placeholder="0.00"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Category and Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategorie *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {Object.entries(categories).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Datum *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Receipt Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Beleg
            </label>
            
            {/* Existing Receipt */}
            {existingReceipt && !selectedFile && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HiUpload className="text-blue-600" />
                    <span className="text-sm text-blue-800">
                      Aktueller Beleg: {existingReceipt.originalName}
                    </span>
                  </div>
                  <span className="text-xs text-blue-600">
                    {formatFileSize(existingReceipt.size)}
                  </span>
                </div>
              </div>
            )}

            {/* File Input */}
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="receipt-file"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <HiUpload className="w-8 h-8 mb-2 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Klicken zum Hochladen</span> oder Datei hierher ziehen
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, PDF, DOC, DOCX (MAX. 10MB)</p>
                </div>
                <input
                  id="receipt-file"
                  type="file"
                  onChange={handleFileChange}
                  accept=".png,.jpg,.jpeg,.pdf,.doc,.docx"
                  className="hidden"
                />
              </label>
            </div>

            {/* Selected File Preview */}
            {selectedFile && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HiUpload className="text-green-600" />
                    <span className="text-sm text-green-800">
                      {selectedFile.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-green-600">
                      {formatFileSize(selectedFile.size)}
                    </span>
                    <button
                      type="button"
                      onClick={removeSelectedFile}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <HiTrash className="text-sm" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Speichere...' : (entry ? 'Aktualisieren' : 'Hinzufügen')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditFinanceModal;
