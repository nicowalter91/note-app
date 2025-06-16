import React from 'react';
import { HiX, HiDownload, HiPencil, HiTrash, HiCalendar, HiCurrencyEuro, HiTag, HiDocumentText } from 'react-icons/hi';

const FinanceDetailModal = ({ entry, onClose, onEdit, onDelete, onDownloadReceipt }) => {
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

  const types = {
    income: 'Einnahme',
    expense: 'Ausgabe'
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (date) => {
    return new Date(date).toLocaleString('de-DE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
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
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Eintrag Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2"
          >
            <HiX className="text-xl" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Title and Type */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {entry.title}
              </h3>
              <div className="flex items-center gap-4">
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                  entry.type === 'income' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {types[entry.type]}
                </span>
                <span className="inline-flex px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800">
                  {categories[entry.category]}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-2xl font-bold ${entry.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                {entry.type === 'income' ? '+' : '-'}{formatCurrency(entry.amount)}
              </div>
            </div>
          </div>

          {/* Description */}
          {entry.description && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <HiDocumentText className="text-gray-500" />
                Beschreibung
              </h4>
              <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                {entry.description}
              </p>
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <HiCalendar className="text-gray-500" />
                Datum
              </h4>
              <p className="text-gray-900 font-medium">
                {formatDate(entry.date)}
              </p>
            </div>

            {/* Amount */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <HiCurrencyEuro className="text-gray-500" />
                Betrag
              </h4>
              <p className={`font-bold text-lg ${entry.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(entry.amount)}
              </p>
            </div>

            {/* Category */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <HiTag className="text-gray-500" />
                Kategorie
              </h4>
              <p className="text-gray-900 font-medium">
                {categories[entry.category]}
              </p>
            </div>

            {/* Type */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Typ
              </h4>
              <p className="text-gray-900 font-medium">
                {types[entry.type]}
              </p>
            </div>
          </div>

          {/* Receipt Section */}
          {entry.receipt && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <HiDocumentText className="text-gray-500" />
                Beleg
              </h4>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <HiDocumentText className="text-blue-600 text-lg" />
                    </div>
                    <div>
                      <p className="font-medium text-blue-900">
                        {entry.receipt.originalName}
                      </p>
                      <p className="text-sm text-blue-600">
                        {formatFileSize(entry.receipt.size)} • 
                        Hochgeladen am {formatDateTime(entry.receipt.uploadDate)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => onDownloadReceipt(entry._id)}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    <HiDownload />
                    Download
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Zeitstempel</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Erstellt:</span>
                <span className="text-gray-900 font-medium">
                  {formatDateTime(entry.createdOn)}
                </span>
              </div>
              {entry.updatedOn && entry.updatedOn !== entry.createdOn && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Zuletzt geändert:</span>
                  <span className="text-gray-900 font-medium">
                    {formatDateTime(entry.updatedOn)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg transition-colors"
          >
            Schließen
          </button>
          
          <div className="flex gap-3">
            <button
              onClick={() => onDelete(entry._id)}
              className="flex items-center gap-2 px-4 py-2 text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors"
            >
              <HiTrash />
              Löschen
            </button>
            <button
              onClick={onEdit}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <HiPencil />
              Bearbeiten
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceDetailModal;
